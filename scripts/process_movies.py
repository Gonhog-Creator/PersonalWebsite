import os
import json
import asyncio
import pandas as pd
import aiohttp
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional

# Configuration
SCRIPT_DIR = Path(__file__).parent
ROOT_DIR = SCRIPT_DIR.parent
DATA_DIR = ROOT_DIR / 'src' / 'data'
EXCEL_PATH = DATA_DIR / 'Mega Movie Masterclass.xlsx'
MOVIE_DATA_JSON = DATA_DIR / 'movieData.json'

# OMDB API Configuration
OMDB_API_KEY = "5b99783d"  # replace with your actual OMDB API key
OMDB_API_URL = "http://www.omdbapi.com/"
REQUEST_DELAY = 0.01  # Small delay between requests to avoid rate limiting

# Ensure data directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)

def clean_rating(rating: Any, is_rotten_tomatoes: bool = False) -> float:
    """
    Convert rating to float, handling various formats.
    
    Args:
        rating: The rating value to clean
        is_rotten_tomatoes: If True, treat as a percentage (0-100) instead of 0-10 scale
        
    Returns:
        float: The cleaned rating, normalized to 0-10 scale (or 0-1 for Rotten Tomatoes)
    """
    if pd.isna(rating) or not str(rating).strip():
        return 0.0
    
    try:
        # Convert to string and clean
        rating_str = str(rating).strip()
        
        # Handle empty string after cleaning
        if not rating_str:
            return 0.0
            
        # Handle percentages (e.g., '90%')
        if '%' in rating_str:
            try:
                num = float(''.join(c for c in rating_str if c.isdigit() or c == '.'))
                if is_rotten_tomatoes:
                    return round(min(max(num / 100, 0.0), 1.0), 2)
                return round(min(max(num / 10, 0.0), 10.0), 1)
            except (ValueError, TypeError):
                return 0.0
        
        # Handle fractions (e.g., '8/10')
        if '/' in rating_str:
            try:
                num, denom = map(float, rating_str.split('/'))
                if denom == 0:
                    return 0.0
                value = num / denom
                if is_rotten_tomatoes and denom == 100:
                    return round(min(max(value, 0.0), 1.0), 2)
                return round(min(max(value * (1 if is_rotten_tomatoes else 10), 0.0), 10.0), 1)
            except (ValueError, TypeError):
                pass
        
        # Handle direct number
        try:
            value = float(rating_str)
            if is_rotten_tomatoes:
                if value > 1:  # Convert percentage to decimal
                    value /= 100
                return round(min(max(value, 0.0), 1.0), 2)
            return round(min(max(value, 0.0), 10.0), 1)
        except (ValueError, TypeError):
            pass
            
    except Exception as e:
        print(f"Error cleaning rating '{rating}': {e}")
        
    return 0.0
        
def clean_date(date_str: Any) -> str:
    """Convert date to YYYY-MM-DD format."""
    if pd.isna(date_str):
        return ''
    
    # Try different date formats
    date_formats = [
        '%Y-%m-%d',  # YYYY-MM-DD
        '%d/%m/%Y',  # DD/MM/YYYY
        '%m/%d/%Y',  # MM/DD/YYYY
        '%Y',        # Just the year
        '%b %d, %Y', # Jan 1, 2023
        '%d-%b-%y',  # 01-Jan-23
    ]
    
    for fmt in date_formats:
        try:
            date_obj = datetime.strptime(str(date_str).strip(), fmt)
            return date_obj.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    # If no format matches, try to extract just the year
    try:
        year = str(int(float(str(date_str))))
        if 1900 <= int(year) <= datetime.now().year + 5:  # Sanity check
            return f"{year}-01-01"  # Default to Jan 1st if only year is available
    except (ValueError, TypeError):
        pass
    
    return ''

def get_dashboard_metrics() -> Dict[str, float]:
    """Extract metrics from the Dashboard sheet."""
    try:
        print("Fetching dashboard metrics...")
        # Read the Dashboard sheet
        df = pd.read_excel(EXCEL_PATH, sheet_name='Dashboard', header=None)
        
        # Initialize metrics
        total_movies = 0
        total_hours = 0.0
        
        # Search for the metrics in the sheet
        for i, row in df.iterrows():
            for j, cell in enumerate(row):
                if cell == 'Total Movies Watched':
                    # The value is in the same row, 2 columns to the right
                    if j + 2 < len(df.columns):
                        total_movies = int(df.iloc[i, j+2])
                        print(f"  - Found Total Movies: {total_movies}")
                elif cell == 'Total Hours Watched':
                    # The value is in the same row, 2 columns to the right
                    if j + 2 < len(df.columns):
                        # Convert to float to preserve decimal places
                        total_hours = float(df.iloc[i, j+2])
                        print(f"  - Found Total Hours: {total_hours:.1f}")
                        
        print("Dashboard metrics retrieved successfully")
        return {
            'totalMovies': total_movies,
            'totalHours': round(total_hours, 1)  # Round to 1 decimal place
        }
        
    except Exception as e:
        print(f"Error reading dashboard metrics: {str(e)}")
        return {'totalMovies': 0, 'totalHours': 0}

def process_excel() -> Dict[str, Any]:
    """Process the Excel file and return movie data and metrics."""
    print(f"Looking for Excel file at: {EXCEL_PATH}")
    print(f"File exists: {EXCEL_PATH.exists()}")
    
    if not EXCEL_PATH.exists():
        print(f"Error: Excel file not found at {EXCEL_PATH}")
        print("Current working directory:", os.getcwd())
        print("Files in data directory:", os.listdir(EXCEL_PATH.parent))
        return {'movies': [], 'metrics': {'totalMovies': 0, 'totalHours': 0}}
    
    try:
        print("Attempting to read Excel file...")
        # Get dashboard metrics first
        metrics = get_dashboard_metrics()
        
        # Read the Movies sheet
        df = pd.read_excel(EXCEL_PATH)
        print(f"Successfully read Excel file. Found {len(df)} rows.")

        # Clean up column names (strip whitespace and make lowercase)
        df.columns = [str(col).strip().lower() for col in df.columns]
        
        # Filter out rows without ratings
        df = df.dropna(subset=['final score'], how='all')
        df = df[df['final score'].astype(str).str.strip().astype(bool)]
        print(f"After filtering unwatched movies: {len(df)} rows remaining")
        
        # Clean and transform the data
        movies = []
        valid_count = 0
        
        # Print sample of first 5 rows with all columns for debugging
        # Process each row in the dataframe
        for idx, row in df.iterrows():
            try:
                # Skip rows with empty or invalid titles
                title = str(row.get('movie name', '')).strip()
                if not title or title.lower() in ('nan', 'n/a', 'tbd', 'tba', 'none'):
                    continue
                    
                # Check rating
                rating = clean_rating(row.get('final score'))
                if rating == 0.0:
                    continue
                
                # Create movie object with lowercase column names to match the standardized format
                movie = {
                    'id': f"movie_{len(movies) + 1}",
                    'title': title,
                    'releaseDate': clean_date(row.get('release date')),
                    'genre': str(row.get('genre', '')).strip(),
                    # Ratings
                    'myRating': rating,
                    'imdbScore': clean_rating(row.get('imdb')),
                    'rottenTomatoesScore': clean_rating(row.get('rotten'), is_rotten_tomatoes=True),  # Handle as percentage
                    'protagonistRating': clean_rating(row.get('protagonist')),
                    'antagonistRating': clean_rating(row.get('antagonist')),
                    'soundtrackRating': clean_rating(row.get('soundtrack')),
                    'setDesignRating': clean_rating(row.get('set design')),
                    'plotRating': clean_rating(row.get('plot')),
                    'endingRating': clean_rating(row.get('ending')),
                    'year': clean_date(row.get('release date', ''))[:4] or 'N/A',
                    'watchedDate': clean_date(row.get('date watched', '')),
                    'runtime': int(float(str(row.get('runtime', 0)).split()[0])) if pd.notna(row.get('runtime')) else 0,
                    'style': str(row.get('style', '')).strip(),
                    'mediaType': str(row.get('show or movie', 'Movie')).strip().capitalize(),
                    'differences': {
                        'imdb': clean_rating(row.get('diff imdb', 0)) / 10,  # Convert to 1-point scale
                        'rotten': clean_rating(row.get('diff rotten', 0)) / 10  # Convert to 1-point scale
                    },
                }
                
                # Add to the list (no need for is_valid_movie check since we already validated)
                movies.append(movie)
                valid_count += 1
                    
            except Exception as e:
                # Silently skip errors for cleaner output
                pass
                continue
                
        # Sort by rating (highest first)
        movies.sort(key=lambda x: x['myRating'], reverse=True)
        
        # Add position/index
        for i, movie in enumerate(movies, 1):
            movie['position'] = i
            
        print(f"Successfully processed {valid_count} movies out of {len(df)} total entries")
        
        # If we couldn't get metrics from the dashboard, use the count of movies
        if metrics['totalMovies'] == 0:
            metrics['totalMovies'] = len(movies)
            metrics['totalHours'] = len(movies) * 2  # Default to 2 hours per movie
        
        return {
            'movies': movies,
            'metrics': metrics
        }
    
    except Exception as e:
        print(f"Error processing Excel file: {e}")
        return {'movies': [], 'metrics': {'totalMovies': 0, 'totalHours': 0}}

async def search_movie(session: aiohttp.ClientSession, title: str, year: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Search for a movie by title and optional year on OMDB."""
    # Special handling for Dune movies to get the correct versions
    if 'dune' in title.lower():
        # Handle Dune: Part Two (2024)
        if 'part two' in title.lower() or (year and int(year) >= 2023):
            dune_part_two = await search_by_imdb_id(session, 'tt15239678')
            if dune_part_two and dune_part_two.get('Response') == 'True':
                print("  Found Dune: Part Two (2024) by IMDB ID")
                return dune_part_two
        # Handle original Dune (2021)
        elif not year or int(year or '0') >= 2020:
            dune_2021 = await search_by_imdb_id(session, 'tt1160419')
            if dune_2021 and dune_2021.get('Response') == 'True':
                print("  Found Dune (2021) by IMDB ID")
                return dune_2021
        
    params = {
        'apikey': OMDB_API_KEY,
        't': title,
        'type': 'movie',
        'plot': 'short',
        'r': 'json'
    }
    
    if year:
        try:
            if '-' in year:
                year = year.split('-')[0]
            params['y'] = year
            
            # First try with the exact year
            async with session.get(OMDB_API_URL, params=params) as response:
                data = await response.json()
                if data.get('Response') == 'True':
                    return data
                    
            # If no exact match, try without the year to get more results
            # and filter by year later
            del params['y']
            
        except (ValueError, TypeError) as e:
            print(f"Error processing year {year}: {e}")
    
    try:
        # Try the search with the modified parameters
        async with session.get(
            OMDB_API_URL,
            params=params,
            timeout=aiohttp.ClientTimeout(total=10)
        ) as response:
            data = await response.json()
            if data.get('Response') == 'True':
                # If we have a year, verify it's a close match
                if year and 'Year' in data:
                    data_year = data['Year'].split('–')[0]  # Handle year ranges
                    if abs(int(data_year) - int(year)) <= 2:  # Allow 2 years difference
                        return data
                    print(f"Year mismatch for {title}: expected around {year}, got {data_year}")
                else:
                    return data
            
            # If we get here, try a search query instead of exact title match
            search_params = {
                'apikey': OMDB_API_KEY,
                's': title,
                'type': 'movie',
                'r': 'json'
            }
            if year:
                search_params['y'] = year
                
            async with session.get(OMDB_API_URL, params=search_params) as search_response:
                search_data = await search_response.json()
                if search_data.get('Response') == 'True' and 'Search' in search_data:
                    # Find the best match from search results
                    for result in search_data['Search']:
                        if 'imdbID' in result:
                            # Get full details for each result
                            movie_data = await search_by_imdb_id(session, result['imdbID'])
                            if movie_data and 'Year' in movie_data:
                                movie_year = movie_data['Year'].split('–')[0]
                                if not year or abs(int(movie_year) - int(year)) <= 2:
                                    return movie_data
            
            print(f"Movie not found: {title} ({year or 'no year'})")
            return None
            
    except (aiohttp.ClientError, asyncio.TimeoutError) as e:
        print(f"Error searching for movie '{title}': {e}")
        return None
        
async def search_by_imdb_id(session: aiohttp.ClientSession, imdb_id: str) -> Optional[Dict[str, Any]]:
    """Search for a movie by its IMDB ID."""
    try:
        params = {
            'apikey': OMDB_API_KEY,
            'i': imdb_id,
            'plot': 'short',
            'r': 'json'
        }
        
        async with session.get(OMDB_API_URL, params=params, timeout=10) as response:
            data = await response.json()
            if data.get('Response') == 'True':
                return data
            return None
    except (aiohttp.ClientError, asyncio.TimeoutError) as e:
        print(f"Error fetching movie by IMDB ID {imdb_id}: {e}")
        return None

# Removed needs_enhancement function as it's no longer needed

async def fetch_movie_data(session: aiohttp.ClientSession, movie: Dict[str, Any]) -> Dict[str, Any]:
    """Fetch complete movie data from OMDB in a single call."""
    try:
        # Skip if we already have an IMDB ID
        if movie.get('imdbId') and not movie.get('force_refresh', False):
            return movie
            
        # Fetch data from OMDB
        omdb_data = await search_movie(session, movie['title'], movie.get('releaseDate'))
        
        if not omdb_data or omdb_data.get('Response') == 'False':
            print(f"  No match found on OMDB for {movie['title']}")
            return movie
        
        # Process poster URL
        omdb_poster = omdb_data.get('Poster')
        poster_url = (
            omdb_poster 
            if omdb_poster and omdb_poster not in ('N/A', 'N/A.jpg') and omdb_poster.startswith(('http://', 'https://'))
            else '/img/placeholder-poster.jpg'
        )
        
        # Process genres
        genres = []
        if movie.get('genre'):
            genres = [g.strip() for g in movie['genre'].split(',') if g.strip()]
        elif 'Genre' in omdb_data:
            genres = [g.strip() for g in omdb_data['Genre'].split(',') if g.strip()]
            
        # Process actors
        actors = []
        if 'Actors' in omdb_data:
            actors = [a.strip() for a in omdb_data['Actors'].split(',') if a.strip()]
            
        # Process runtime
        runtime = movie.get('runtime', 0)
        if not runtime and 'Runtime' in omdb_data and omdb_data['Runtime'] not in ('N/A', None):
            try:
                runtime = int(omdb_data['Runtime'].split()[0])
            except (ValueError, AttributeError):
                runtime = 0
                
        # Process IMDB rating (convert to 0-100 scale)
        imdb_rating = movie.get('imdbScore', 0)
        if not imdb_rating and 'imdbRating' in omdb_data and omdb_data['imdbRating'] not in ('N/A', None):
            try:
                imdb_rating = float(omdb_data['imdbRating']) * 10  # Convert from 0-10 to 0-100 scale
            except (ValueError, TypeError):
                imdb_rating = 0
        
        # Update movie with all data
        return {
            **movie,
            'imdbId': omdb_data.get('imdbID', movie.get('imdbId')),
            'posterUrl': poster_url,
            'plot': omdb_data.get('Plot', movie.get('plot', '')),
            'imdbScore': imdb_rating,
            'genres': genres,
            'runtime': runtime,
            'year': omdb_data.get('Year', movie.get('year', '')).split('–')[0],
            'rated': omdb_data.get('Rated', movie.get('rated', '')),
            'director': omdb_data.get('Director', movie.get('director', '')),
            'actors': actors,
            'language': omdb_data.get('Language', movie.get('language', '')),
            'country': omdb_data.get('Country', movie.get('country', '')),
            'metascore': omdb_data.get('Metascore', movie.get('metascore', 'N/A')),
            'awards': omdb_data.get('Awards', movie.get('awards', '')),
            'production': omdb_data.get('Production', movie.get('production', ''))
        }
        
    except Exception as e:
        print(f"Error fetching data for {movie.get('title')}: {e}")
        return movie

def is_valid_movie(movie: Dict[str, Any]) -> bool:
    """Check if a movie has a valid rating and required fields."""
    try:
        # Debug: Print movie being validated
        print(f"\nValidating movie: {movie.get('title')}")
        
        # Check required fields first
        required_fields = ['title', 'myRating']
        for field in required_fields:
            if field not in movie or movie[field] is None:
                print(f"  - Missing required field: {field}")
                return False
        
        # Check title is valid
        title = str(movie.get('title', '')).strip()
        if not title or title.lower() in ('nan', 'n/a', 'tbd', 'tba', 'none'):
            print(f"  - Invalid title: {title}")
            return False
            
        # If we get here, all validations passed
        return True
        
    except Exception as e:
        print(f"  - Error validating movie: {e}")
        return False

def load_existing_movies() -> Dict[str, Any]:
    """Load existing movies from movieData.json if it exists."""
    if not MOVIE_DATA_JSON.exists():
        return {}
        
    try:
        with open(MOVIE_DATA_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Create a dictionary with a composite key of title_year for easier lookup
            movies_dict = {}
            for movie in data.get('movies', []):
                title = movie.get('title', '').lower().strip()
                year = str(movie.get('year', '')).split('–')[0].strip()
                if title and year:
                    key = f"{title}_{year}"
                    movies_dict[key] = movie
            return movies_dict
    except Exception as e:
        print(f"Error loading existing movies: {e}")
        return {}

async def main():
    """Main entry point that processes Excel and fetches movie data."""
    try:
        print("Starting movie data processing...")
        
        # Load existing movies
        existing_movies = load_existing_movies()
        print(f"Loaded {len(existing_movies)} existing movies from movieData.json")
        
        # Process the Excel file
        print("Processing Excel file...")
        data = process_excel()
        excel_movies = {}
        
        # Convert list to dict with title+year as key for easier lookup
        for movie in data.get('movies', []):
            key = f"{movie.get('title', '')}_{movie.get('year', '')}"
            excel_movies[key] = movie
        
        metrics = data.get('metrics', {'totalMovies': 0, 'totalHours': 0})
        
        if not excel_movies:
            print("No movies found in the Excel file. Exiting...")
            return 1
            
        print(f"Found {len(excel_movies)} movies in the Excel file.")
        
        # Prepare the movie data structure
        movie_data = {
            'metadata': {
                'lastUpdated': datetime.now().isoformat(),
                'totalMovies': len(excel_movies),
                'totalHours': metrics.get('totalHours', 0),
                'generatedBy': 'process_movies.py',
                'version': '1.2.0'  # Bump version for the new data structure
            },
            'movies': []
        }
        
        # Process movies and fetch new data if needed
        print("\nProcessing movies...")
        async with aiohttp.ClientSession() as session:
            processed_movies = []
            new_movies = 0
            updated_movies = 0
            
            for i, (key, movie) in enumerate(excel_movies.items(), 1):
                try:
                    # Create a consistent key for the current movie
                    title = movie.get('title', '').lower().strip()
                    year = str(movie.get('year', '')).split('–')[0].strip()
                    movie_key = f"{title}_{year}"
                    
                    # Check if we already have this movie in our existing data
                    existing_movie = existing_movies.get(movie_key)
                    
                    if existing_movie:
                        # Use existing movie data but update with any new ratings from Excel
                        movie_with_data = {
                            **existing_movie,
                            'myRating': movie.get('myRating', existing_movie.get('myRating')),
                            'watchedDate': movie.get('watchedDate', existing_movie.get('watchedDate'))
                        }
                        updated_movies += 1
                    else:
                        # Special handling for Dune movies
                        if 'dune' in title:
                            if 'part two' in title and 'dune_2024' in existing_movies:
                                existing_movie = existing_movies['dune_2024']
                            elif 'part two' not in title and 'dune_2021' in existing_movies:
                                existing_movie = existing_movies['dune_2021']
                            
                            if existing_movie:
                                movie_with_data = {
                                    **existing_movie,
                                    'myRating': movie.get('myRating', existing_movie.get('myRating')),
                                    'watchedDate': movie.get('watchedDate', existing_movie.get('watchedDate'))
                                }
                                updated_movies += 1
                                processed_movies.append(movie_with_data)
                                continue
                        
                        # If we get here, we need to fetch new data
                        print(f"Fetching data for new movie: {movie.get('title')} ({movie.get('year', 'N/A')})")
                        movie_with_data = await fetch_movie_data(session, movie)
                        new_movies += 1
                        await asyncio.sleep(REQUEST_DELAY)  # Rate limiting
                    
                    processed_movies.append(movie_with_data)
                        
                except Exception as e:
                    print(f"  Error processing movie {movie.get('title')}: {e}")
                    processed_movies.append(movie)  # Keep the original movie data if there's an error
            
            # Sort movies by rating (highest first)
            processed_movies.sort(key=lambda x: x.get('myRating', 0), reverse=True)
            
            # Update the movie data with processed movies
            movie_data['movies'] = processed_movies
            
            # Update metadata
            movie_data['metadata']['newMovies'] = new_movies
            movie_data['metadata']['updatedMovies'] = updated_movies
            
            # Save the data
            print("\nSaving movie data...")
            with open(MOVIE_DATA_JSON, 'w', encoding='utf-8') as f:
                json.dump(movie_data, f, indent=2, ensure_ascii=False)
            
            # Print summary
            print(f"\nSuccessfully processed {len(processed_movies)} movies.")
            print(f"- New movies added: {new_movies}")
            print(f"- Existing movies updated: {updated_movies}")
            print(f"- Total movies: {len(processed_movies)}")
            print(f"- Total hours: {metrics.get('totalHours', 0)}")
            print(f"Data saved to: {MOVIE_DATA_JSON}")
            
    except Exception as e:
        print(f"\nError processing movies: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())

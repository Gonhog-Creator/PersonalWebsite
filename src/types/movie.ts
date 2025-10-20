export interface Movie {
  id: string;
  title: string;
  releaseDate?: string;
  genre?: string;
  genres?: string[];
  imdbId?: string;
  imdbScore?: number;
  rottenTomatoesScore?: number;
  myRating: number;
  posterUrl: string;
  plot?: string;
  year?: string;
  rated?: string;
  director?: string;
  actors?: string[];
  language?: string;
  country?: string;
  metascore?: string;
  awards?: string;
  production?: string;
  runtime?: number;
  style?: string;
  mediaType?: string;
  watchedDate?: string;
  differences?: {
    imdb: number;
    rotten: number;
  };
  protagonistRating?: number;
  antagonistRating?: number;
  soundtrackRating?: number;
  setDesignRating?: number;
  plotRating?: number;
  endingRating?: number;
}

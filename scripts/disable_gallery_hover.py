import os
import re
from pathlib import Path

def process_file(file_path):
    """Process a single file to disable hover effects."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Pattern to find the hover effect div and its styles
        hover_pattern = r'<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">\s*<p className="text-white text-sm md:text-base font-semibold px-6 py-4 w-full text-center">\s*\{image\.alt\}\s*<\/p>\s*<\/div>'
        
        # Comment out the hover effect div
        new_content = re.sub(
            hover_pattern,
            '{\n            /* Hover effect disabled as per user request\n            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">\n              <p className="text-white text-sm md:text-base font-semibold px-6 py-4 w-full text-center">\n                {image.alt}\n              </p>\n            </div>\n            */\n          }',
            content
        )
        
        # Only write if content was actually changed
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Updated: {file_path}")
            return True
        
        return False
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")
        return False

def process_directory(directory):
    """Process all files in a directory and its subdirectories."""
    updated_count = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file in ['page.tsx', 'page.js', 'page.jsx']:
                file_path = os.path.join(root, file)
                if process_file(file_path):
                    updated_count += 1
    
    return updated_count

def main():
    # Path to the galleries directory
    galleries_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'app', 'galleries')
    
    try:
        updated_count = process_directory(galleries_dir)
        print(f"\n✅ Successfully updated {updated_count} gallery pages.")
        print("Hover effects have been disabled in all galleries and sub-galleries.")
    except Exception as e:
        print(f"Error processing galleries: {e}")

if __name__ == "__main__":
    main()

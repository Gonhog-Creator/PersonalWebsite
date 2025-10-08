import os
import json
import random
from pathlib import Path
from typing import List, Dict, Any

def scan_images(directory: str) -> List[Dict[str, Any]]:
    """Scan a directory recursively for image files and return their metadata."""
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    excluded_paths = {
        'img/icons',
        'img/RDE',
        'img/skills',
        'imgWolfspeed',
        'favicon.ico',
        'logo.png',
        'profile.png',
        'wooden_cart.kpg',
        'WorldMapImage.png'
    }
    images = []
    
    for root, _, files in os.walk(directory):
        # Skip excluded directories
        rel_path = os.path.relpath(root, os.path.dirname(directory))
        if any(excluded in rel_path for excluded in excluded_paths):
            continue
            
        for file in files:
            # Skip excluded files
            file_rel_path = os.path.join(rel_path, file).replace('\\', '/')
            if any(excluded in file_rel_path for excluded in excluded_paths) or file in excluded_paths:
                continue
                
            if Path(file).suffix.lower() in image_extensions:
                file_path = Path(root) / file
                web_path = str(file_path).replace(str(Path(directory).parent), '').replace('\\', '/')
                
                images.append({
                    'id': f"img-{os.path.getmtime(file_path)}-{random.randint(1000, 9999)}",
                    'src': web_path,
                    'alt': Path(file).stem.replace('_', ' ').replace('-', ' '),
                    'isPanorama': 'pano' in file.lower() or 'panorama' in file.lower()
                })
    
    return images

def main():
    # Define paths
    base_dir = Path(__file__).parent.parent
    img_dir = base_dir / 'public' / 'img'
    data_dir = base_dir / 'src' / 'data'
    
    # Create data directory if it doesn't exist
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Define output file paths
    gallery_json = data_dir / 'galleryImages.json'
    pano_json = data_dir / 'galleryPanos.json'
    
    print(f"Scanning for images in {img_dir}...")
    all_images = scan_images(str(img_dir))
    panorama_images = [img for img in all_images if img['isPanorama']]
    
    # Save all image paths
    with open(gallery_json, 'w', encoding='utf-8') as f:
        json.dump([img['src'] for img in all_images], f, indent=2)
    
    # Save panorama image paths
    with open(pano_json, 'w', encoding='utf-8') as f:
        json.dump([img['src'] for img in panorama_images], f, indent=2)
    
    print(f"✅ Generated gallery data:")
    print(f"- Total images found: {len(all_images)}")
    print(f"- Panorama images found: {len(panorama_images)}")
    print(f"- Saved to: ")
    print(f"  {gallery_json.relative_to(base_dir)} ({len(all_images)} images)")
    print(f"  {pano_json.relative_to(base_dir)} ({len(panorama_images)} panoramas)")

if __name__ == "__main__":
    main()

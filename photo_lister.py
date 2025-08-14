import os

def list_photos(directory):
    print("const imageDetails: Record<number, { alt: string }> = {")
    
    # Get all image files and sort them
    image_files = []
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                # Extract image number from filename (assuming format like "scotland (1).jpg")
                img_num = int(''.join(filter(str.isdigit, filename)))
                image_files.append((img_num, filename))
            except (ValueError, IndexError):
                continue
    
    # Sort and print the images
    for img_num, _ in sorted(image_files, key=lambda x: x[0]):
        print(f"  {img_num}: {{ alt: 'DescriptionComingSoon' }},")
    
    print("};")

if __name__ == "__main__":
    # Example usage - replace with your target directory
    gallery_path = ("public/img/USA")  # Change this to your target directory
    list_photos(gallery_path)

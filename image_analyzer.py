import os
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

# Load the BLIP model - much better for detailed image captioning
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large").to(device)


def get_image_description(image_path):
    try:
        # Load and preprocess the image
        image = Image.open(image_path).convert('RGB')

        # Generate caption
        inputs = processor(image, return_tensors="pt").to(device)
        out = model.generate(**inputs, max_length=50)
        caption = processor.decode(out[0], skip_special_tokens=True)

        # Make the caption more natural
        caption = caption[0].upper() + caption[1:]  # Capitalize first letter
        if not caption.endswith(('.', '!', '?')):
            caption += '.'

        return f"{{ alt: '{caption}' }}"
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return None


def generate_descriptions(directory):
    print("const imageDetails: Record<number, { alt: string }> = {")

    # Get all image files
    image_files = []
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            try:
                # Extract image number from filename (assuming format like "argentina (1).jpg")
                img_num = int(''.join(filter(str.isdigit, filename)))
                image_files.append((img_num, filename))
            except (ValueError, IndexError):
                continue

    # Process images in order
    for img_num, filename in sorted(image_files, key=lambda x: x[0]):
        filepath = os.path.join(directory, filename)
        desc = get_image_description(filepath)
        if desc:
            print(f"  {img_num}: {desc},")

    print("};")


# Run analysis
gallery_path = "public/img/Argentina"
generate_descriptions(gallery_path)
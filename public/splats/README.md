# Gaussian Splats

Place your `.splat` files here so they can be served by Next.js.

## Bologna

The Bologna gallery page expects:

```
public/splats/bologna.splat
```

## How to generate a .splat file

### Option 1: Postshot (recommended)

1. Open your Postshot project.
2. Export as `.splat`.
3. Copy the exported `.splat` file to this folder.

### Option 2: Nerfstudio

1. Train a Gaussian splat model:
   ```bash
   ns-train splatfacto --data /path/to/images
   ```
2. Export to `.splat`:
   ```bash
   ns-export gaussian-splat --load-config /path/to/config.yml --output-dir /path/to/output
   ```
3. Copy the `.splat` file to this folder.

## Making splats from videos

1. Extract frames:
   ```bash
   ffmpeg -i video.mp4 -vf "fps=2,scale=1920:-1" frames/%04d.jpg
   ```
2. Use Postshot, Polycam, or Nerfstudio to train from the extracted frames.
3. Export the resulting `.splat` file.

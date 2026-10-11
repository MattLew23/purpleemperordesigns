# Fibonacci Slice Composer (V1)

A browser-only desktop tool that recomposes a source image into vertical hard-cut panels using a fixed Fibonacci-inspired pattern.

## V1 behavior

- Accepts JPG/PNG inputs.
- Supports file picker, drag-and-drop, and camera capture input.
- Automatically slices and composes one output image.
- Uses vertical strip proportions in this order: `2:3:5:3:2`.
- Reorders the two `3`-width strips by swapping them.
- Rotates both `3`-width strips by `180°`.
- Preserves original source resolution in the composed canvas.
- Exports full-size PNG or JPG.
- Saves the last loaded source image in browser `localStorage`.

## Run locally

Open `index.html` directly in a browser.

For a local server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

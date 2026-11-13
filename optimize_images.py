"""Writes a resized .webp copy next to every photo in the folders below.

The originals are left untouched. Run from the sillywilly folder:
    python optimize_images.py
"""
from pathlib import Path

from PIL import Image, ImageOps

# folder -> longest side in pixels
TARGETS = {
    "src/assets/Ski Journey Photos": 900,  # polaroids (shown at most 270px wide)
    "src/assets/Experience Polaroid Photos": 900,
    "src/assets/Background Photos": 2000,  # full-screen backgrounds
}
EXTS = {".jpg", ".jpeg", ".png"}

total_before = total_after = 0
for folder, max_side in TARGETS.items():
    for src in sorted(Path(folder).iterdir()):
        if src.suffix.lower() not in EXTS:
            continue
        im = ImageOps.exif_transpose(Image.open(src))  # keep phone photos upright
        im.thumbnail((max_side, max_side), Image.LANCZOS)  # only shrinks
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        out = src.with_suffix(".webp")
        im.save(out, "WEBP", quality=80, method=6)
        before, after = src.stat().st_size, out.stat().st_size
        total_before += before
        total_after += after
        print(f"{before // 1024:>6} KB -> {after // 1024:>4} KB  {im.size[0]}x{im.size[1]}  {src.name}")

print(f"\nTotal: {total_before // 1024} KB -> {total_after // 1024} KB")

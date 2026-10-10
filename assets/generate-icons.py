#!/usr/bin/env python3
"""Generates the app icon, Android adaptive icon layers and splash image.

Pure standard library (no Pillow/ImageMagick): run `python3 assets/generate-icons.py`.
Writes an .svg (source) and a .png (what app.json references) per asset into assets/images/.
Colours come from src/theme/palette.ts (Terracota base, Salvia 700, Fundo).
"""
import math
import os
import struct
import zlib

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
FUNDO, TERRACOTA, SALVIA = "#f5ead8", "#c67139", "#56633f"

# Mark in a 100x100 unit box: two bars on a common baseline (the "scale" of a comparison).
# Left = taller/pricier (Terracota), right = shorter/cheaper (Salvia).
BARS = [(6, 8, 36, 82, 11, TERRACOTA), (58, 40, 36, 50, 11, SALVIA)]  # x, y, w, h, r, colour


def hex_rgb(h):
    return tuple(int(h[i : i + 2], 16) for i in (1, 3, 5))


def spec(size, box, mono=False):
    """Bars scaled so the 100-unit box is `box` px wide, centred on a size x size canvas."""
    s, off = box / 100.0, (size - box) / 2.0
    return [
        (off + x * s, off + y * s, w * s, h * s, r * s, "#000000" if mono else c)
        for x, y, w, h, r, c in BARS
    ]


def svg(size, shapes, bg=None):
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">']
    if bg:
        parts.append(f'<rect width="{size}" height="{size}" fill="{bg}"/>')
    for x, y, w, h, r, c in shapes:
        parts.append(f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" rx="{r:g}" fill="{c}"/>')
    parts.append("</svg>\n")
    return "\n".join(parts)


def render(size, shapes, bg=None):
    """Anti-aliased rasteriser (rounded-rect SDF). Returns rows of [r, g, b, a] (straight alpha)."""
    if bg:
        r, g, b = hex_rgb(bg)
        px = [[float(r), float(g), float(b), 1.0] for _ in range(size * size)]
    else:
        px = [[0.0, 0.0, 0.0, 0.0] for _ in range(size * size)]  # premultiplied while drawing
    for x, y, w, h, rad, col in shapes:
        colour = hex_rgb(col)
        cx, cy, hw, hh = x + w / 2, y + h / 2, w / 2, h / 2
        for j in range(max(0, int(y) - 2), min(size, int(y + h) + 3)):
            for i in range(max(0, int(x) - 2), min(size, int(x + w) + 3)):
                qx = abs(i + 0.5 - cx) - (hw - rad)
                qy = abs(j + 0.5 - cy) - (hh - rad)
                d = math.hypot(max(qx, 0), max(qy, 0)) + min(max(qx, qy), 0) - rad
                a = min(1.0, max(0.0, 0.5 - d))
                if a == 0:
                    continue
                p = px[j * size + i]
                for k in range(3):
                    p[k] = colour[k] * a + p[k] * (1 - a)
                p[3] = a + p[3] * (1 - a)
    out = []
    for r, g, b, a in px:
        if a > 0:
            r, g, b = r / a, g / a, b / a
        out.append((round(r), round(g), round(b), round(a * 255)))
    return out


def write_png(path, size, pixels, opaque):
    """opaque=True writes RGB (no alpha channel at all), as required for the iOS icon."""
    raw = bytearray()
    for j in range(size):
        raw.append(0)
        for r, g, b, a in pixels[j * size : (j + 1) * size]:
            raw += bytes((r, g, b)) if opaque else bytes((r, g, b, a))

    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2 if opaque else 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)


ASSETS = [
    # name, size, mark width px, monochrome, background (None = transparent)
    ("icon", 1024, 560, False, FUNDO),  # iOS/store icon: opaque, square corners
    ("android-icon-foreground", 1024, 400, False, None),  # inside the 66dp safe zone (61%)
    ("android-icon-monochrome", 1024, 400, True, None),
    ("splash-icon", 1024, 560, False, None),
]

for name, size, box, mono, bg in ASSETS:
    shapes = spec(size, box, mono)
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(svg(size, shapes, bg))
    write_png(os.path.join(OUT, name + ".png"), size, render(size, shapes, bg), opaque=bg is not None)
    print("wrote", name, size)

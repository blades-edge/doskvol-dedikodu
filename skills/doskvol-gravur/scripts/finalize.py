#!/usr/bin/env python3
"""Normalize transparent ink artwork and verify its AVIF round trip."""
import argparse
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

INK = bytes((0x21, 0x1E, 0x1A))


def run(*args, data=None):
    return subprocess.run(["magick", *map(str, args)], input=data,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                          check=True).stdout


def finalize(source, destination):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if not shutil.which("magick"):
        raise ValueError("ImageMagick 7 with AVIF support is required (magick).")
    encoder = shutil.which("heif-enc")
    if not encoder:
        encoder = next((str(p) for p in (
            Path("/opt/homebrew/opt/libheif/bin/heif-enc"),
            Path("/usr/local/opt/libheif/bin/heif-enc"),
        ) if p.is_file()), None)
    if not encoder:
        raise ValueError("libheif's heif-enc with an AV1 encoder is required.")
    if destination.suffix.lower() != ".avif":
        raise ValueError("Output must use the .avif extension.")
    if destination.exists():
        raise ValueError("Output exists; choose a new filename.")
    info = run("identify", "-ping", "-format", "%w %h %n\n", source).decode().splitlines()
    if len(info) != 1 or info[0].split()[2] != "1":
        raise ValueError("Use a single still image.")
    width, height, _ = map(int, info[0].split())
    pixels = run(source, "-colorspace", "sRGB", "-alpha", "on", "-depth", "8", "rgba:-")
    if len(pixels) != width * height * 4:
        raise ValueError("Unexpected decoded image size.")
    alpha = pixels[3::4]
    if 0 not in alpha or not any(alpha):
        raise ValueError("Artwork must contain transparent background and visible ink. Regenerate with transparency; do not flatten paper into the image.")
    normalized = bytearray(pixels)
    for channel, value in enumerate(INK):
        normalized[channel::4] = bytes([value]) * (width * height)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=destination.parent) as scratch:
        encoded = Path(scratch) / "verified.avif"
        master = Path(scratch) / "ink.png"
        run("-size", f"{width}x{height}", "-depth", "8", "rgba:-",
            "-colorspace", "sRGB", "-strip", "PNG32:" + str(master),
            data=bytes(normalized))
        # Identity RGB matrix avoids YCbCr rounding even in nominally lossless AVIF.
        subprocess.run([encoder, "--avif", "--lossless", "--colour_primaries", "1",
                        "--transfer_characteristic", "13", "--matrix_coefficients", "0",
                        "-o", str(encoded), str(master)],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        decoded = run(encoded, "-colorspace", "sRGB", "-alpha", "on", "-depth", "8", "rgba:-")
        if len(decoded) != len(normalized) or decoded[3::4] != alpha:
            raise ValueError("AVIF encoder changed dimensions or alpha; no output delivered.")
        for offset in range(0, len(decoded), 4):
            if decoded[offset + 3] and decoded[offset:offset + 3] != INK:
                raise ValueError("AVIF encoder changed #211e1a; no output delivered. Use an encoder that preserves the exact RGB values.")
        # Exclusive creation prevents overwriting an existing asset, including races.
        os.link(encoded, destination)
    return destination


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    try:
        print(finalize(args.source, args.destination))
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        detail = error.stderr.decode(errors="replace") if isinstance(error, subprocess.CalledProcessError) else str(error)
        parser.exit(1, f"Cannot finalize engraving: {detail}\n")

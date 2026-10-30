"""Run with python3 -m unittest discover -s <skill>/scripts -p 'test_*.py'."""
import tempfile
import unittest
from pathlib import Path
from finalize import finalize, run, INK


class FinalizeTest(unittest.TestCase):
    def test_preserves_alpha_and_exact_ink_through_avif(self):
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / "source.png", Path(directory) / "ink.avif"
            # Distinct original colors, transparent background, and antialiased edges.
            pixels = bytes([255, 255, 255, 0, 90, 10, 80, 64,
                            0, 0, 0, 255, 200, 180, 100, 180])
            run("-size", "2x2", "-depth", "8", "rgba:-", "PNG32:" + str(source), data=pixels)
            finalize(source, output)
            result = run(output, "-depth", "8", "rgba:-")
            self.assertEqual(result[3::4], pixels[3::4])
            for offset in (4, 8, 12):
                self.assertEqual(result[offset:offset + 3], INK)
            before = output.read_bytes()
            with self.assertRaisesRegex(ValueError, "exists"):
                finalize(source, output)
            self.assertEqual(output.read_bytes(), before)

    def test_rejects_opaque_or_blank_artwork(self):
        with tempfile.TemporaryDirectory() as directory:
            for color in ("white", "none"):
                source = Path(directory) / f"{color}.png"
                run("-size", "2x2", f"xc:{color}", source)
                output = Path(directory) / f"{color}.avif"
                with self.assertRaisesRegex(ValueError, "transparent background"):
                    finalize(source, output)
                self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()

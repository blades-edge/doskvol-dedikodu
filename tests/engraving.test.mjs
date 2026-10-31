import assert from "node:assert/strict";
import test from "node:test";
import { remarkEngravings } from "../src/utils/engraving.mjs";

test("only selected original images receive the night class", () => {
  const selected = { type: "image", url: "../../assets/images/gravür.avif" };
  const other = { type: "image", url: "../../assets/images/other.avif" };
  const tree = { children: [{ children: [selected, other] }] };
  remarkEngravings({ images: ["../../assets/images/grav%C3%BCr.avif"] })(tree);
  assert.deepEqual(selected.data.hProperties.className, ["engraving-dark"]);
  assert.equal(other.data, undefined);
});

test("an empty selection leaves all images unchanged", () => {
  const image = { type: "image", url: "../../assets/images/cover.png" };
  remarkEngravings()({ children: [image] });
  assert.equal(image.data, undefined);
});

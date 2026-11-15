import assert from "node:assert/strict";
import test from "node:test";
import { remarkEngravings } from "../src/utils/engraving.mjs";

test("only local engravings outside the exception list receive the night class", () => {
  const exception = { type: "image", url: "../../assets/images/gravür.avif" };
  const other = { type: "image", url: "../../assets/images/other.avif" };
  const external = { type: "image", url: "https://example.com/other.avif" };
  const tree = { children: [{ children: [exception, other, external] }] };
  remarkEngravings({ exceptions: ["../../assets/images/grav%C3%BCr.avif"] })(tree);
  assert.equal(exception.data, undefined);
  assert.deepEqual(other.data.hProperties.className, ["engraving-dark"]);
  assert.equal(external.data, undefined);
});

test("an empty exception list styles local engravings", () => {
  const image = { type: "image", url: "../../assets/images/cover.png" };
  remarkEngravings()({ children: [image] });
  assert.deepEqual(image.data.hProperties.className, ["engraving-dark"]);
});

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

export function mergePages(target, incoming, mode, number) {
  if (!["production", "preview", "remove"].includes(mode)) {
    throw new Error("Unknown publication mode");
  }
  if (mode !== "production" && !/^[1-9]\d*$/.test(number)) {
    throw new Error("Invalid PR number");
  }
  if (mode !== "remove" && !existsSync(join(incoming, "index.html"))) {
    throw new Error("Publication must include index.html");
  }
  // Pages artifacts cannot contain links; do not trust downloaded PR artifacts.
  function checkFiles(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === ".git" || (!entry.isFile() && !entry.isDirectory())) {
        throw new Error("Unsupported publication entry");
      }
      if (entry.isDirectory()) checkFiles(join(directory, entry.name));
    }
  }
  if (mode !== "remove") checkFiles(incoming);
  mkdirSync(target, { recursive: true });
  if (mode === "production") {
    for (const entry of readdirSync(target)) {
      if (entry === ".git") continue;
      if (entry === "taslak") {
        for (const draft of readdirSync(join(target, entry))) {
          if (!/^pr-[1-9]\d*$/.test(draft)) {
            rmSync(join(target, entry, draft), { recursive: true, force: true });
          }
        }
      } else rmSync(join(target, entry), { recursive: true, force: true });
    }
    cpSync(incoming, target, { recursive: true });
  } else {
    const destination = join(target, "taslak", `pr-${number}`);
    rmSync(destination, { recursive: true, force: true });
    if (mode === "preview") cpSync(incoming, destination, { recursive: true });
  }
}

if (process.argv[1]?.endsWith("/merge-pages.mjs")) {
  mergePages(...process.argv.slice(2));
}

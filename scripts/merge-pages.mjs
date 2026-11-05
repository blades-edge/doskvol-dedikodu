import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function previewPath(kind, ref, encode = false) {
  if (kind === "pr" && /^[1-9]\d*$/.test(ref)) return `taslak/pr/${ref}`;
  if (kind === "b" && typeof ref === "string") {
    const parts = ref.split("/");
    if (parts.every((part) => part && !part.startsWith(".") &&
        !part.includes("..") && !/[\\\x00-\x20\x7f]/.test(part))) {
      return ["taslak", "b", ...parts.map((part) => encode ? encodeURIComponent(part) : part)].join("/");
    }
  }
  throw new Error("Invalid preview ref");
}

export function mergePages(target, incoming, mode, ref, kind = "pr") {
  if (!["production", "preview", "remove"].includes(mode)) {
    throw new Error("Unknown publication mode");
  }
  const path = mode === "production" ? null : previewPath(kind, ref);
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
          if (!["pr", "b"].includes(draft)) {
            rmSync(join(target, entry, draft), { recursive: true, force: true });
          }
        }
      } else rmSync(join(target, entry), { recursive: true, force: true });
    }
    cpSync(incoming, target, { recursive: true });
  } else {
    const destination = join(target, path);
    const marker = ".preview-branch";
    if (kind === "b") {
      if (mode === "remove" && !existsSync(join(destination, marker))) return;
      if (mode === "preview") {
        // A deleted branch may previously have occupied a parent of this path.
        let parent = join(target, "taslak", "b");
        for (const part of ref.split("/").slice(0, -1)) {
          parent = join(parent, part);
          if (existsSync(join(parent, marker))) rmSync(parent, { recursive: true, force: true });
        }
      }
    }
    rmSync(destination, { recursive: true, force: true });
    if (mode === "preview") {
      cpSync(incoming, destination, { recursive: true });
      if (kind === "b") writeFileSync(join(destination, marker), "");
    }
  }
}

if (process.argv[1]?.endsWith("/merge-pages.mjs")) {
  mergePages(...process.argv.slice(2));
}

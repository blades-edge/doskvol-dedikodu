export function remarkDialogue() {
  return (tree, file) => {
    if (!file.path?.replaceAll("\\", "/").includes("/src/content/bolum/"))
      return;

    let position = 0;
    for (const node of tree.children) {
      const text = node.children?.every(child => child.type === "text")
        ? node.children.map(child => child.value).join("")
        : "";
      if (node.type !== "paragraph" || !/^“[^“”]+”$/u.test(text)) {
        position = 0;
        continue;
      }
      position += 1;
      node.data ??= {};
      node.data.hProperties ??= {};
      node.data.hProperties.className = [
        ...(node.data.hProperties.className ?? []),
        "dialogue",
        ...(position % 2 === 0 ? ["dialogue-even"] : []),
      ];
    }
  };
}

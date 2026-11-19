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
    wrapQuotes(tree);
  };
}

function wrapQuotes(node) {
  if (!node.children || node.data?.hProperties?.className?.includes("dialogue"))
    return;

  node.children.forEach(wrapQuotes);
  const children = [];
  let quote;
  for (const child of node.children) {
    const parts =
      child.type === "text"
        ? child.value
            .split(/([“”])/u)
            .filter(Boolean)
            .map(value => ({ type: "text", value }))
        : [child];
    for (const part of parts) {
      if (part.type === "text" && part.value === "“" && !quote) {
        quote = [part];
      } else if (part.type === "text" && part.value === "”" && quote) {
        quote.push(part);
        children.push({
          type: "inlineQuote",
          data: { hName: "q" },
          children: quote,
        });
        quote = undefined;
      } else {
        (quote ?? children).push(part);
      }
    }
  }
  // Unclosed quotation marks remain ordinary text.
  children.push(...(quote ?? []));
  node.children = children;
}

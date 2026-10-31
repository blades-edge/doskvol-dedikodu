// Match the original asset path before Astro generates optimized image URLs.
export function imageKey(src) {
  return decodeURI(src).split("assets/images/")[1];
}

export function remarkEngravings({ images = [] } = {}) {
  const selected = new Set(images.map(imageKey).filter(Boolean));
  return tree => {
    function visit(node) {
      if (node.type === "image" && selected.has(imageKey(node.url))) {
        node.data ??= {};
        node.data.hProperties ??= {};
        node.data.hProperties.className = [
          ...(node.data.hProperties.className ?? []),
          "engraving-dark",
        ];
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

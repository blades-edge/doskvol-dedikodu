// Match the original asset path before Astro generates optimized image URLs.
export function imageKey(src) {
  return decodeURI(src).split("assets/images/")[1];
}

export function remarkEngravings({ exceptions = [] } = {}) {
  const excluded = new Set(exceptions.map(imageKey).filter(Boolean));
  return tree => {
    function visit(node) {
      const key = node.type === "image" ? imageKey(node.url) : undefined;
      if (key && !excluded.has(key)) {
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

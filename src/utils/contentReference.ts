// Pages CMS reference fields store filenames; Astro collections use filename stems.
export function contentReferenceId(value: unknown) {
  if (value === "" || value === null) return undefined;
  return typeof value === "string" ? value.replace(/\.(json|md)$/i, "") : value;
}

export function emptyToUndefined(value: unknown) {
  return value === "" || value === null ? undefined : value;
}

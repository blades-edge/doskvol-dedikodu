interface ReadingPathEntry {
  id: string;
  data: { series?: { id: string }; episode?: number };
}
export function issuePath(number: number, preview = false) {
  const id = String(number).padStart(3, "0");
  return `${preview ? "onizleme/" : ""}sayi/${id}/`;
}
export function articlePath(entry: ReadingPathEntry, previewNumber?: number) {
  const path = entry.data.series
    ? `tefrika/${entry.data.series.id}/${entry.data.episode}/`
    : `makale/${entry.id}/`;
  return previewNumber === undefined
    ? path
    : `${issuePath(previewNumber, true)}${path}`;
}

interface ReadingPathEntry {
  id: string;
  data: { series?: { id: string }; episode?: number };
}

export function issuePath(number: number) {
  return `sayi/${String(number).padStart(3, "0")}/`;
}
export function articlePath(entry: ReadingPathEntry) {
  return entry.data.series
    ? `tefrika/${entry.data.series.id}/${entry.data.episode}/`
    : `makale/${entry.id}/`;
}

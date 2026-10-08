export type FilterEntity = "meeting" | "action";

export function getFilterEmptyMessage(
  entity: FilterEntity,
  totalCount: number,
  visibleCount: number
) {
  if (visibleCount > 0) return null;
  if (entity === "meeting") {
    return totalCount === 0
      ? "Belum ada rapat tersimpan. Mulai dari rekam rapat atau tambah rapat baru."
      : "Tidak ada rapat yang cocok dengan filter saat ini. Coba ubah kata kunci atau reset filter.";
  }
  return totalCount === 0
    ? "Belum ada action item. Action item akan dibuat dari keputusan dan tindak lanjut rapat."
    : "Tidak ada action item yang cocok dengan filter saat ini. Coba ubah pencarian atau filter.";
}

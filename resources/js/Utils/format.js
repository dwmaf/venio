export function formatTanggalSlash(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  const day = d.padStart(2, '0');
  const month = m.padStart(2, '0');
  return `${day}/${month}/${y}`;
}

export function formatJamMenit(jam) {
  if (!jam) return '';
  return jam.slice(0, 5);
}
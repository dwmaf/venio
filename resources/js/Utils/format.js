// resources/js/utils/format.js

export function formatTanggalSlash(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${parseInt(d)}/${parseInt(m)}/${y}`;
}

export function formatJamMenit(jam) {
  if (!jam) return '';
  return jam.slice(0, 5);
}
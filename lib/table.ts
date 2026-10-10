export type Cell = string;
export type TableData = { title: string; headers: string[]; rows: Cell[][] };

/** Parses CSV while preserving commas and escaped quotes inside quoted cells. */
export function parseDelimited(text: string, delimiter = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') { if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; } else quoted = !quoted; continue; }
    if (!quoted && char === delimiter) { row.push(cell.trim()); cell = ""; continue; }
    if (!quoted && (char === "\n" || char === "\r")) { if (char === "\r" && text[index + 1] === "\n") index += 1; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; continue; }
    cell += char;
  }
  if (cell || row.length) { row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); }
  return rows;
}
export function toCsv(data: TableData): string { return [data.headers, ...data.rows].map(row => row.map(cell => /[",\n]/.test(cell) ? `"${cell.replaceAll('"','""')}"` : cell).join(",")).join("\n"); }
export function normalizeTable(rows: string[][]): TableData { const width = Math.max(1, ...rows.map(row => row.length)); const padded = rows.map(row => [...row, ...Array(width - row.length).fill("")]); return { title: "未命名資料表", headers: padded[0] ?? Array.from({length: width}, (_, i) => `欄位 ${i + 1}`), rows: padded.slice(1) }; }
export function removeLastColumn(data: TableData): TableData { if (data.headers.length <= 1) return data; return { ...data, headers: data.headers.slice(0, -1), rows: data.rows.map(row => row.slice(0, -1)) }; }
export function removeLastRow(data: TableData): TableData { if (data.rows.length <= 1) return data; return { ...data, rows: data.rows.slice(0, -1) }; }

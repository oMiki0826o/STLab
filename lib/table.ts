export type Cell = string;
export type TableData = { title: string; headers: string[]; rows: Cell[][] };
export function parseDelimited(text: string, delimiter = ","): string[][] { return text.trim().split(/\r?\n/).filter(Boolean).map(line => line.split(delimiter).map(cell => cell.trim().replace(/^"|"$/g, ""))); }
export function toCsv(data: TableData): string { return [data.headers, ...data.rows].map(row => row.map(cell => /[",\n]/.test(cell) ? `"${cell.replaceAll('"','""')}"` : cell).join(",")).join("\n"); }
export function normalizeTable(rows: string[][]): TableData { const width = Math.max(1, ...rows.map(row => row.length)); const padded = rows.map(row => [...row, ...Array(width - row.length).fill("")]); return { title: "未命名資料表", headers: padded[0] ?? Array.from({length: width}, (_, i) => `欄位 ${i + 1}`), rows: padded.slice(1) }; }

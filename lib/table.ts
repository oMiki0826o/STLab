/** Delimited text and table model helpers. */
export type Cell = string;
export type TableData = { title: string; headers: string[]; rows: Cell[][] };
export function parseDelimited(text: string, delimiter = ","): string[][] {
  if (delimiter.length !== 1 || delimiter === '"' || delimiter === "\n" || delimiter === "\r") throw new Error("無效的分隔字元");
  const rows: string[][] = []; let row: string[] = [], cell = "", quoted = false, endedQuote = false, started = false;
  const pushRow = () => { row.push(cell); rows.push(row); row = []; cell = ""; endedQuote = false; started = false; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') { quoted = false; endedQuote = true; } else cell += c; continue; }
    if (c === '"' && !started && !cell) { quoted = true; started = true; continue; }
    if (c === delimiter) { row.push(cell); cell = ""; started = false; endedQuote = false; continue; }
    if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; pushRow(); continue; }
    if (endedQuote || c === '"') throw new Error("CSV 引號格式錯誤");
    cell += c; started = true;
  }
  if (quoted) throw new Error("CSV 引號未關閉");
  if (started || cell || row.length || endedQuote) pushRow();
  return rows;
}
export function toCsv(data: TableData): string {
  const escape = (value: string) => {
    // Prevent formula execution when opening exported CSV in spreadsheet programs.
    const safe = /^[\t\r\n ]*[=+@-]/.test(value) ? `'${value}` : value;
    return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
  };
  return [data.headers, ...data.rows].map(row => row.map(escape).join(",")).join("\n");
}
export function normalizeTable(rows: string[][]): TableData {
  if (rows.length > 10001) throw new Error("CSV 超過 10,000 筆資料列");
  const width = rows.reduce((max, row) => Math.max(max, row.length), 1);
  if (width > 200) throw new Error("CSV 超過 200 個欄位");
  const padded = rows.map(row => [...row, ...Array(width - row.length).fill("")]);
  return { title: "未命名資料表", headers: padded[0] ?? Array.from({ length: width }, (_, i) => `欄位 ${i + 1}`), rows: padded.slice(1) };
}
export function parseTableProject(value: unknown): TableData {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("資料表必須是物件");
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.headers) || !data.headers.length || data.headers.length > 200 || !data.headers.every(x => typeof x === "string")) throw new Error("欄位名稱格式錯誤");
  if (!Array.isArray(data.rows) || data.rows.length > 10000 || !data.rows.every(row => Array.isArray(row) && row.length === (data.headers as unknown[]).length && row.every((cell: unknown) => typeof cell === "string"))) throw new Error("資料列格式錯誤");
  if (data.title !== undefined && typeof data.title !== "string") throw new Error("資料表名稱格式錯誤");
  return { title: typeof data.title === "string" ? data.title : "未命名資料表", headers: data.headers, rows: data.rows } as TableData;
}
export function removeLastColumn(data: TableData): TableData { if (data.headers.length <= 1) return data; return { ...data, headers: data.headers.slice(0, -1), rows: data.rows.map(row => row.slice(0, -1)) }; }
export function removeLastRow(data: TableData): TableData { if (data.rows.length <= 1) return data; return { ...data, rows: data.rows.slice(0, -1) }; }

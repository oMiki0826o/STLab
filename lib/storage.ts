/** Safe local storage and browser file downloads. */
export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = window.localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw) as T; }
  catch { return fallback; }
}
export function save<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (error) { console.warn(`STLab 無法儲存 ${key}`, error); return false; }
}
export function download(name: string, content: string | Blob, type = "text/plain") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name;
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

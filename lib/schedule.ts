/** Schedule import and A/B week migration. */
export type SchedulePlan = Record<string, string>;
const DAYS = ["一", "二", "三", "四", "五"];
const PERIODS = ["第一節", "第二節", "第三節", "第四節", "午休", "第五節", "第六節", "第七節", "第八節", "早上", "上午"];
const KEYS = PERIODS.flatMap(period => DAYS.map(day => `${period}-${day}`));
const VALID = new Set(KEYS.flatMap(key => [key, `A-${key}`, `B-${key}`]));
export function parseSchedule(text: string, fallback: SchedulePlan): SchedulePlan {
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
    const source = value as Record<string, unknown>;
    const result: SchedulePlan = { ...fallback };
    for (const key of Object.keys(source)) if (VALID.has(key) && typeof source[key] === "string") result[key] = source[key] as string;
    return result;
  } catch { return fallback; }
}
export function tryParseScheduleProject(text: string): { ok: true; title?: string; plan: SchedulePlan } | { ok: false; error: string } {
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, error: "課表 JSON 必須是物件。" };
    const obj = value as Record<string, unknown>;
    const raw = "plan" in obj ? obj.plan : obj;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { ok: false, error: "課表內容格式錯誤。" };
    const source = raw as Record<string, unknown>;
    const entries = Object.entries(source).filter(([key]) => VALID.has(key));
    if (!entries.length || entries.some(([, cell]) => typeof cell !== "string")) return { ok: false, error: "課表沒有有效的課程欄位，或欄位內容不是文字。" };
    const plan: SchedulePlan = {};
    for (const [key, cell] of entries) plan[key] = cell as string;
    return { ok: true, title: typeof obj.title === "string" ? obj.title : undefined, plan };
  } catch { return { ok: false, error: "JSON 語法錯誤，原有課表未變更。" }; }
}
export function parseScheduleProject(text: string, fallback: SchedulePlan): { title?: string; plan: SchedulePlan } {
  const result = tryParseScheduleProject(text);
  return result.ok ? { title: result.title, plan: { ...fallback, ...result.plan } } : { plan: fallback };
}
export function swapScheduleCells(plan: SchedulePlan, first: string, second: string): SchedulePlan {
  const next = { ...plan }; const old = next[first] ?? ""; next[first] = next[second] ?? ""; next[second] = old; return next;
}

export type SchedulePlan = Record<string, string>;
export function parseSchedule(text: string, fallback: SchedulePlan): SchedulePlan { try { const value = JSON.parse(text); return value && typeof value === "object" ? Object.fromEntries(Object.keys(fallback).map(key => [key, typeof value[key] === "string" ? value[key] : ""])) : fallback; } catch { return fallback; } }

export function parseScheduleProject(text: string, fallback: SchedulePlan): { title?: string; plan: SchedulePlan } {
  try {
    const value = JSON.parse(text) as { title?: unknown; plan?: unknown };
    if (value && typeof value === "object" && value.plan && typeof value.plan === "object") {
      return { title: typeof value.title === "string" ? value.title : undefined, plan: parseSchedule(JSON.stringify(value.plan), fallback) };
    }
  } catch { /* handled by fallback */ }
  return { plan: parseSchedule(text, fallback) };
}

export function swapScheduleCells(plan: SchedulePlan, first: string, second: string): SchedulePlan {
  const next = { ...plan };
  const firstValue = next[first] ?? "";
  next[first] = next[second] ?? "";
  next[second] = firstValue;
  return next;
}

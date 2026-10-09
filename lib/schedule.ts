export type SchedulePlan = Record<string, string>;
export function parseSchedule(text: string, fallback: SchedulePlan): SchedulePlan { try { const value = JSON.parse(text); return value && typeof value === "object" ? Object.fromEntries(Object.keys(fallback).map(key => [key, typeof value[key] === "string" ? value[key] : ""])) : fallback; } catch { return fallback; } }

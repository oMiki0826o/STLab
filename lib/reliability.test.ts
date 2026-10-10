import { describe, expect, it } from "vitest";
import { tryParseScheduleProject } from "./schedule";
import { normalizeTable, parseDelimited, parseTableProject, toCsv } from "./table";

describe("reliability regressions", () => {
  it("preserves A/B week data", () => {
    const result = tryParseScheduleProject(JSON.stringify({ title: "Test", plan: { "A-第一節-一": "物理", "B-第一節-一": "化學" } }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.plan).toMatchObject({ "A-第一節-一": "物理", "B-第一節-一": "化學" });
  });
  it("rejects corrupt imports instead of overwriting", () => {
    expect(tryParseScheduleProject("{" ).ok).toBe(false);
    expect(tryParseScheduleProject("{}" ).ok).toBe(false);
  });
  it("rejects malformed table rows", () => {
    expect(() => parseTableProject({ headers: ["A"], rows: [null] })).toThrow();
  });
  it("preserves quoted CSV whitespace and escaped quotes", () => {
    expect(parseDelimited('"  a  ","b""c"\r\n')).toEqual([["  a  ", 'b"c']]);
    expect(() => parseDelimited('"unclosed')).toThrow();
  });
  it("normalizes empty CSV", () => {
    expect(normalizeTable([]).headers).toEqual(["欄位 1"]);
  });
  it("escapes CSV spreadsheet formulas", () => {
    expect(toCsv({ title: "T", headers: ["Name"], rows: [["=1+1"]] })).toContain("'=1+1");
  });
});

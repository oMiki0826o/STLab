import { describe, expect, it } from "vitest";
import { defaultChart } from "./chart";
import { validateChart, validateTable } from "./validation";

describe("input validation", () => {
  it("finds blank table headers", () => expect(validateTable({ title: "x", headers: [""], rows: [["a"]] })).toContain("欄位名稱不能留白。"));
  it("accepts the default chart", () => expect(validateChart(defaultChart)).toEqual([]));
  it("rejects points outside chart bounds", () => expect(validateChart({ ...defaultChart, points: [{ x: 99, y: 0 }] })).toContain("資料點必須落在目前設定的座標範圍內。"));
});

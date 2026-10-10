import { describe, expect, it } from "vitest";
import { removeLastColumn, removeLastRow, TableData } from "./table";

const sample: TableData = { title: "測試", headers: ["A", "B"], rows: [["1", "2"], ["3", "4"]] };

describe("table editing operations", () => {
  it("removes the last column from headers and rows", () => {
    expect(removeLastColumn(sample)).toEqual({ title: "測試", headers: ["A"], rows: [["1"], ["3"]] });
  });
  it("keeps at least one row and column", () => {
    const one: TableData = { title: "", headers: ["A"], rows: [["1"]] };
    expect(removeLastColumn(one)).toEqual(one);
    expect(removeLastRow(one)).toEqual(one);
  });
  it("removes only the final row", () => {
    expect(removeLastRow(sample)).toEqual({ title: "測試", headers: ["A", "B"], rows: [["1", "2"]] });
  });
});

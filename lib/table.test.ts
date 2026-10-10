import { describe, expect, it } from "vitest"; import { normalizeTable, parseDelimited, toCsv } from "./table";
describe("table helpers",()=>{it("parses and normalizes rows",()=>expect(normalizeTable(parseDelimited("a,b\n1,2"))).toEqual({title:"未命名資料表",headers:["a","b"],rows:[["1","2"]]}));it("quotes commas in CSV",()=>expect(toCsv({title:"x",headers:["a","b"],rows:[["hello, world","ok"]]})).toBe("a,b\n\"hello, world\",ok"))});
it("parses quoted commas and escaped quotes",()=>expect(parseDelimited('name,note\n"A, B","say ""hello"""')).toEqual([["name","note"],["A, B",'say "hello"']]));

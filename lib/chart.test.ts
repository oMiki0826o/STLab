import { describe, expect, it } from "vitest"; import { parsePoints, pointsText } from "./chart";
describe("chart helpers",()=>{it("parses coordinate rows",()=>expect(parsePoints("0, 0\n10 20\ninvalid")).toEqual([{x:0,y:0},{x:10,y:20}]));it("serializes points",()=>expect(pointsText([{x:1,y:2}])).toBe("1, 2"));});

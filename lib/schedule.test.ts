import { describe, expect, it } from "vitest"; import { parseSchedule } from "./schedule";
describe("schedule helpers",()=>{it("keeps known cells when importing",()=>expect(parseSchedule('{"早上-一":"物理","unknown":"x"}',{"早上-一":"","上午-一":""})).toEqual({"早上-一":"物理","上午-一":""}));it("falls back on invalid JSON",()=>expect(parseSchedule("bad",{"早上-一":""})).toEqual({"早上-一":""}));});

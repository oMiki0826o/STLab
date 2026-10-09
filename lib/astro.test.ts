import { describe, expect, it } from "vitest"; import { visibleCatalog } from "./astro";
describe("astro catalog",()=>{it("filters by type and query",()=>expect(visibleCatalog("木星","行星").map(x=>x.id)).toEqual(["jupiter"]));});

import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../content/astro/common.md", import.meta.url), "utf8");
const entries = source.split(/^## /m).slice(1).map((block) => {
  const lines = block.trim().split(/\r?\n/);
  const name = lines.shift().trim();
  const values = Object.fromEntries(lines.filter((line) => line.includes(":")).map((line) => {
    const index = line.indexOf(":");
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
  return {
    id: values.id,
    name,
    aliases: values.aliases.split(", "),
    type: values.type,
    constellation: values.constellation,
    ra: values.ra,
    dec: values.dec,
    angularSize: values.angularSize,
    distance: values.distance,
    magnitude: Number(values.magnitude),
    note: values.note,
    nearbyStars: values.nearbyStars.split(", "),
    searchGuide: values.searchGuide,
    source: "content/astro/common.md",
  };
});

const output = `// Generated from content/astro/common.md. Do not edit by hand.\nexport const markdownCatalog = ${JSON.stringify(entries, null, 2)} as const;\n`;
writeFileSync(new URL("../lib/astro-markdown.generated.ts", import.meta.url), output);

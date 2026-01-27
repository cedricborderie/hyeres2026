/**
 * Exporte les propositions (titres et textes) pour édition manuelle.
 * Usage: npx tsx scripts/export-propositions.ts
 * Génère: exports/propositions-export.json et exports/propositions-export.csv
 */

import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { proposals } from "../lib/data";

const projectRoot = join(__dirname, "..");
const outDir = join(projectRoot, "exports");

mkdirSync(outDir, { recursive: true });

// JSON
const jsonPath = join(outDir, "propositions-export.json");
writeFileSync(jsonPath, JSON.stringify(proposals, null, 2), "utf-8");
console.log("Écrit:", jsonPath);

// CSV (séparateur ;, UTF-8 BOM pour Excel)
function csvEscape(str: string): string {
  if (!str) return "";
  const s = String(str);
  if (s.includes(";") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}
const csvHeader = "id;categoryId;title;summary;details;external_link";
const csvRows = proposals.map((p) =>
  [p.id, p.categoryId, p.title, p.summary, p.details, p.external_link ?? ""]
    .map(csvEscape)
    .join(";")
);
const csvPath = join(outDir, "propositions-export.csv");
writeFileSync(csvPath, "\uFEFF" + csvHeader + "\n" + csvRows.join("\n"), "utf-8");
console.log("Écrit:", csvPath);
console.log("Total:", proposals.length, "propositions");

/**
 * Réimporte les propositions depuis exports/propositions-export.json dans lib/data.ts.
 * Usage: node scripts/import-propositions.cjs
 * Prérequis: exporter puis éditer propositions-export.json avant de lancer.
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const jsonPath = path.join(projectRoot, "exports", "propositions-export.json");
const dataPath = path.join(projectRoot, "lib", "data.ts");

if (!fs.existsSync(jsonPath)) {
  console.error("Fichier introuvable:", jsonPath);
  console.error("Lancez d'abord: node scripts/export-propositions.cjs");
  process.exit(1);
}

const proposals = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

function esc(s) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function block(p) {
  const lines = [
    "  {",
    `    id: "${p.id}",`,
    `    categoryId: "${p.categoryId}",`,
    `    title: "${esc(p.title)}",`,
    `    summary: "${esc(p.summary)}",`,
    `    details: "${esc(p.details)}",`,
  ];
  if (p.external_link) {
    lines.push(`    external_link: "${esc(p.external_link)}",`);
  }
  lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, "");
  lines.push("  },");
  return lines.join("\n");
}

const newArrayBody = proposals.map(block).join("\n\n");
const newArray = "export const proposals: Proposal[] = [\n" + newArrayBody.slice(0, -1) + "\n];";

const dataContent = fs.readFileSync(dataPath, "utf-8");
const startMarker = "export const proposals: Proposal[] = [";
const endMarker = "];";

const startIdx = dataContent.indexOf(startMarker);
if (startIdx === -1) {
  console.error("Impossible de trouver le tableau proposals dans lib/data.ts");
  process.exit(1);
}
let depth = 1;
let endIdx = startIdx + startMarker.length; // juste après le "["
while (endIdx < dataContent.length && depth > 0) {
  const c = dataContent[endIdx];
  if (c === "[") depth++;
  else if (c === "]") depth--;
  endIdx++;
}
if (depth !== 0) {
  console.error("Tableau proposals mal fermé dans lib/data.ts");
  process.exit(1);
}

const before = dataContent.slice(0, startIdx);
const after = dataContent.slice(endIdx);
const newContent = before + newArray + after;

fs.writeFileSync(dataPath, newContent, "utf-8");
console.log("lib/data.ts mis à jour avec", proposals.length, "propositions.");

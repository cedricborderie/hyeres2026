/**
 * Exporte les propositions (titres et textes) pour édition manuelle.
 * Usage: node scripts/export-propositions.cjs
 * Génère: exports/propositions-export.json et exports/propositions-export.csv
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const dataPath = path.join(projectRoot, "lib", "data.ts");
const content = fs.readFileSync(dataPath, "utf-8");

const block = content.match(/export const proposals: Proposal\[\] = \[([\s\S]*)\];/);
if (!block) {
  console.error("Impossible de trouver le tableau proposals.");
  process.exit(1);
}
const inner = block[1];

// Extraire chaque objet { ... }, (y compris les retours à la ligne)
const proposals = [];
let pos = 0;
while (pos < inner.length) {
  const start = inner.indexOf("{", pos);
  if (start === -1) break;
  let depth = 1;
  let end = start + 1;
  while (depth > 0 && end < inner.length) {
    const c = inner[end];
    if (c === '"') {
      end++;
      while (end < inner.length && (inner[end] !== '"' || inner[end - 1] === '\\')) end++;
      end++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") depth--;
    end++;
  }
  const objStr = inner.slice(start, end);
  // Extraire id, categoryId, title, summary, details, external_link
  const id = objStr.match(/id:\s*"([^"]*)"/)?.[1] ?? "";
  const categoryId = objStr.match(/categoryId:\s*"([^"]*)"/)?.[1] ?? "";
  const title = (objStr.match(/title:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "").replace(/\\"/g, '"');
  const summary = (objStr.match(/summary:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "").replace(/\\"/g, '"');
  const details = (objStr.match(/details:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "").replace(/\\"/g, '"');
  const ext = objStr.match(/external_link:\s*"([^"]*)"/)?.[1];
  if (id && categoryId) {
    proposals.push({ id, categoryId, title, summary, details, external_link: ext ?? "" });
  }
  pos = end;
}

if (proposals.length < 10) {
  console.error("Trop peu de propositions extraites:", proposals.length);
  process.exit(1);
}

const outDir = path.join(projectRoot, "exports");
fs.mkdirSync(outDir, { recursive: true });

// JSON
const jsonPath = path.join(outDir, "propositions-export.json");
fs.writeFileSync(jsonPath, JSON.stringify(proposals, null, 2), "utf-8");
console.log("Écrit:", jsonPath);

// CSV (; séparateur, BOM UTF-8 pour Excel)
function csvEscape(str) {
  if (!str) return "";
  const s = String(str);
  if (s.includes(";") || s.includes('"') || s.includes("\n")) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}
const csvHeader = "id;categoryId;title;summary;details;external_link";
const csvRows = proposals.map((p) =>
  [p.id, p.categoryId, p.title, p.summary, p.details, p.external_link || ""]
    .map(csvEscape)
    .join(";")
);
const csvPath = path.join(outDir, "propositions-export.csv");
fs.writeFileSync(csvPath, "\uFEFF" + csvHeader + "\n" + csvRows.join("\n"), "utf-8");
console.log("Écrit:", csvPath);
console.log("Total:", proposals.length, "propositions");

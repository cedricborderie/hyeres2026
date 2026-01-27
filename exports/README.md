# Export des propositions

## Fichiers générés

- **propositions-export.json** — Titres et textes au format JSON (éditable dans un éditeur de texte).
- **propositions-export.csv** — Même contenu en CSV, séparateur `;`, encodage UTF-8 avec BOM (ouvrable dans Excel/LibreOffice).

Colonnes : `id` ; `categoryId` ; `title` ; `summary` ; `details` ; `external_link`.

## Régénérer l’export

Depuis la racine du projet :

```bash
node scripts/export-propositions.cjs
```

## Modifier puis réimporter

1. Modifier **propositions-export.json** (ou le CSV) à la main.
2. Lancer la réimportation :
   ```bash
   node scripts/import-propositions.cjs
   ```
   Ce script lit `exports/propositions-export.json` et met à jour `lib/data.ts`.
3. Vérifier le rendu en local avec `npm run dev`.

**Attention :** ne pas changer les `id` des propositions (h1, h2, m1, a1, etc.) pour garder la compatibilité avec les votes existants.

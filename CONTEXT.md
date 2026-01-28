# Contexte du projet & état du développement

Document de référence pour les assistants IA (ex. Gemini) : état actuel du site, architecture et conventions.

---

## 1. Vue d’ensemble

* **Objectif :** Plateforme citoyenne pour les habitants d’Hyères : voter pour des propositions dans 3 axes (Habitat, Mobilités, Agriculture) afin d’éclairer le débat et d’engager les candidats aux municipales.
* **Stack :** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, canvas-confetti, Lucide React, Supabase (PostgreSQL), Cloudflare Turnstile, jose (JWT).
* **Règles importantes :**
  * Pas de compte utilisateur : vote anonyme via `session_id` (cookie HttpOnly).
  * Mobile-first, design accessible.
  * TypeScript strict, Tailwind uniquement (pas de CSS-in-JS).
  * Réponses et commentaires en **français**.

---

## 2. État actuel du développement

### Ce qui est en place et fonctionne

* **Pages :**
  * `/` — Accueil (Hero, « Notre démarche », 3 axes, bandeau jaune avec compteur + CTA « Commencer à voter »).
  * `/propositions` — Vote par onglets (Habitat, Mobilités, Agriculture) ; cartes avec résumé, détail en modal, vote avec Turnstile.
  * `/bilan` — Récap des votes de la session + partage (WhatsApp, Facebook).
  * `/resultats` — Résultats publics (totaux votes, nombre de votants uniques, détail par proposition).
  * `/partage` — Page de partage avec métadonnées OG dédiées.
  * `/mentions-legales` — Mentions légales.
  * `/debug` — Page de diagnostic (env, DB, Turnstile) pour le dev / staging.

* **Fonctionnalités :**
  * Vote : un vote par `session_id` + `proposal_id` ; session gérée par cookie HttpOnly (middleware).
  * Cloudflare Turnstile sur la page propositions (anti-bot).
  * Server Actions : vote (`vote.ts`), résultats (`results.ts`), newsletter (`newsletter.ts`), sécurité (`security.ts`).
  * Stats en temps réel : total de votes et **nombre de votants uniques** (fonction SQL `count_distinct_voters()`).
  * Newsletter : inscription email (table `newsletter`, Supabase).
  * Données : **56 propositions** dans `lib/data.ts` (20 Habitat h1–h20, 14 Mobilités m1–m14, 22 Agriculture a1–a22) ; 3 catégories avec `manifestoUrl` (liens Google Drive).

* **Données & contenu :**
  * Source de vérité côté app : `lib/data.ts` (tableau `proposals` + `categories`).
  * Export / import : `node scripts/export-propositions.cjs` → `exports/propositions-export.json` (et CSV) ; `node scripts/import-propositions.cjs` pour réinjecter dans `lib/data.ts`. Voir `exports/README.md`.

* **Base de données :**
  * Supabase : tables `proposals`, `votes`, `newsletter` ; RLS ; triggers pour `vote_count` ; clé `service_role` utilisée côté serveur pour les votes et les résultats.
  * Migrations : de `001_initial_schema.sql` à `023_add_count_distinct_voters_function.sql` (incl. mise à jour titre H10, fonction comptage votants distincts).

* **Déploiement :**
  * **Production :** branche `main` → Vercel → domaine prod (ex. `www.hyeres2026.org`).
  * **Préprod :** branche `staging` → Vercel Preview → domaine type `staging.hyeres2026.org` ou URL Vercel `*-git-staging-*.vercel.app`.
  * Variables d’environnement : Production vs Preview (staging) ; **ne pas mélanger** les clés Supabase prod / préprod. Voir `docs/SEPARATION_PROD_STAGING.md`, `docs/GUIDE_DEPLOIEMENT_STAGING.md`, `docs/QUE_FAIRE_SI_CA_NE_DEPLOIE_PAS.md`.

### Ce qui reste optionnel / non fait

* Limitation par IP (documentée dans `docs/IP_LIMITATION.md`, non implémentée).
* Subscriptions temps réel Supabase pour les stats (aujourd’hui : revalidation + lecture à la demande).
* Tests automatisés (e2e, unitaires).

---

## 3. Architecture & fichiers principaux

```
app/
  page.tsx                    # Accueil
  layout.tsx                  # Layout global + Header
  globals.css
  error.tsx
  propositions/page.tsx      # Page de vote
  bilan/page.tsx              # Récap session + partage
  resultats/page.tsx          # Résultats publics
  partage/page.tsx            # Page partage (OG)
  mentions-legales/page.tsx
  debug/page.tsx              # Diagnostic
  actions/
    vote.ts                   # submitVote, hasVotedForProposal
    results.ts                # totaux + votants uniques
    newsletter.ts             # inscription newsletter
    security.ts               # JWT / cookies
    check-db.ts, test-vote.ts, debug-env.ts

components/
  Header.tsx
  Footer.tsx
  LiveStats.tsx               # Compteur votes / votants
  ProposalCard.tsx            # Carte + modal détail + vote
  VoteGatekeeper.tsx          # Wrapper Turnstile + envoi vote

lib/
  data.ts                     # categories, proposals (56), getProposalsByCategory
  utils.ts
  colors.ts
  supabase/
    server.ts                 # Client serveur
    admin.ts                  # Service role si besoin

middleware.ts                 # Cookie session_id, chemins protégés

supabase/migrations/          # 001 à 023 (schéma, RLS, triggers, count_distinct_voters)

scripts/
  export-propositions.cjs     # → exports/propositions-export.json + CSV
  import-propositions.cjs     # JSON → lib/data.ts

exports/
  propositions-export.json   # Source pour import
  propositions-export.csv
  README.md
```

* **Décisions importantes :**
  * IDs de propositions : chaînes type `h1`, `m1`, `a1` (alignés avec la base).
  * Session : cookie HttpOnly généré par le middleware ; lecture uniquement côté serveur.
  * Votes : Server Actions + Supabase avec `SUPABASE_SERVICE_ROLE_KEY` pour contourner RLS côté serveur.
  * Préprod et prod : deux projets Supabase distincts ; variables Vercel « Production » vs « Preview ».

---

## 4. Déploiement & environnements

| Environnement | Branche Git | Domaine type        | Supabase          |
|---------------|-------------|---------------------|-------------------|
| Production    | `main`      | www.hyeres2026.org  | Projet production |
| Préprod       | `staging`   | staging.hyeres2026.org ou *-git-staging-*.vercel.app | Projet préprod (ex. qxvnbkknudogisxtumfw) |

* Déploiement : push sur `main` ou `staging` → Vercel déclenche un build. Si rien ne part : voir `docs/QUE_FAIRE_SI_CA_NE_DEPLOIE_PAS.md` (Redeploy manuel, commit vide, config Git Vercel).
* Migrations : à exécuter manuellement dans le bon projet Supabase (prod vs préprod). Voir `docs/EXECUTER_MIGRATIONS_STAGING.md`, `docs/GUIDE_DEPLOIEMENT_PRODUCTION.md`.

---

## 5. Données & contenu

* **Catégories :** `habitat`, `mobilites`, `agriculture` — titre, description, couleur, `manifestoUrl`.
* **Propositions :** 56 au total ; champs `id`, `categoryId`, `title`, `summary`, `details`, `external_link` (optionnel).
* **Modifications récentes (ex.) :** H3 (moratoire Rougières), H9 (PPRI compétence État), H10 (retrait trait de côte), H12 (îlots de chaleur urbains), H16 (promoteurs privés). Pour mettre à jour en masse : éditer `exports/propositions-export.json`, puis `node scripts/import-propositions.cjs`.

---

## 6. Sécurité & anti-abus

* **Turnstile :** clés dans Vercel (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) ; domaine staging à autoriser dans le dashboard Cloudflare si besoin.
* **Session :** cookie HttpOnly, sécurisé en production (`secure`, `sameSite`).
* **JWT :** `JWT_SECRET_KEY` en env pour la signature des cookies si utilisée.
* **RLS Supabase :** activé sur `votes` ; l’app utilise `service_role` côté serveur pour insérer et lire les agrégats.

---

## 7. Prochaines étapes possibles (backlog)

* [ ] Exécuter les migrations sur l’instance Supabase cible si nouvelle env.
* [ ] Limitation par IP (Edge Functions Supabase) si besoin.
* [ ] Subscriptions temps réel pour les stats (optionnel).
* [ ] Tests e2e / unitaires.
* [ ] Optimisation images (logos, OG).

---

## 8. Journal des changements (résumé récent)

* Import des propositions mises à jour (h3 moratoire, h9 PPRI, h12 îlots urbains, h16 promoteurs) + scripts export/import.
* Comptage votants uniques en base (migration 023, `count_distinct_voters()`).
* Titre H10 : « Anticiper le retrait du trait de côte » (migration 022).
* Guides : déploiement staging, préprod, « que faire si ça ne déploie pas », Turnstile staging.
* Correctifs RLS et permissions Supabase (migrations 011–018), liens manifestes (021).

---

## 9. Notes pour les assistants IA (Gemini, etc.)

* **Langue :** Répondre et commenter en **français**.
* **Conventions :** camelCase en JS/TS ; snake_case en base ; IDs propositions en minuscules (h1, m1, a1).
* **Sécurité :** Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` ou `TURNSTILE_SECRET_KEY` côté client. Session ID lu uniquement côté serveur.
* **Tailwind :** Pas de CSS-in-JS ; utiliser les classes Tailwind et `tailwind-merge` / `clsx` si besoin.
* **Données :** La source de vérité des textes des propositions est `lib/data.ts`. Pour des changements en lot, utiliser le flux export JSON → édition → import.
* **Docs :** Beaucoup de procédures (déploiement, Turnstile, migrations, RLS) sont dans `docs/` ; s’y référer avant de proposer des changements d’infra ou de déploiement.

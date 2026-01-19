# Checklist Pré-Déploiement

## ✅ Vérifications Avant de Commiter

### 1. Fichiers à NE PAS commiter
- [ ] `.env.local` (déjà dans .gitignore)
- [ ] `.env` (déjà dans .gitignore)
- [ ] `node_modules/` (déjà dans .gitignore)
- [ ] `.next/` (déjà dans .gitignore)

### 2. Fichiers à Commiter

#### Code Source
- [x] `.eslintrc.json` - Configuration ESLint
- [x] `app/actions/` - Server Actions (vote, newsletter, results, check-db)
- [x] `app/resultats/` - Page Résultats
- [x] `components/Footer.tsx` - Footer avec logos, newsletter, partage
- [x] `components/Header.tsx` - Header avec navigation
- [x] `components/ProposalCard.tsx` - Carte avec vote/retrait
- [x] `app/layout.tsx` - Layout avec Footer
- [x] `app/page.tsx` - Page d'accueil (logos retirés)
- [x] `app/bilan/page.tsx` - Page Mes Priorités
- [x] `app/propositions/page.tsx` - Page Propositions avec blocs info

#### Migrations SQL
- [x] `supabase/migrations/001_initial_schema.sql`
- [x] `supabase/migrations/002_modify_proposal_ids_to_string.sql`
- [x] `supabase/migrations/003_insert_proposals.sql`
- [x] `supabase/migrations/004_create_newsletter_table.sql`
- [x] `supabase/migrations/005_test_vote_triggers.sql` (optionnel, script de test)

#### Assets
- [x] `public/logos/` - Logos des associations (5 fichiers PNG)
- [x] `public/drapeau.svg` - Drapeau (renommé)

#### Documentation
- [x] `docs/DEPLOYMENT.md` - Guide de déploiement
- [x] `docs/CONFIGURATION_LOCALE.md` - Configuration locale
- [x] `docs/DIAGNOSTIC_LOCAL.md` - Diagnostic local
- [x] `docs/TROUBLESHOOTING.md` - Dépannage général
- [x] `docs/VERIFICATION_VOTES.md` - Vérification votes
- [x] `CONTEXT.md` - Contexte du projet

### 3. Vérifications Finales

- [ ] Le build fonctionne : `npm run build`
- [ ] Pas d'erreurs TypeScript : `npx tsc --noEmit`
- [ ] Pas d'erreurs ESLint : `npm run lint`
- [ ] Les fichiers sensibles ne sont pas commités

### 4. Commit et Push

```bash
# Vérifier ce qui sera commité
git status

# Commiter tous les changements
git add .
git commit -m "Préparation déploiement production

- Ajout page Résultats
- Ajout Footer avec logos, newsletter et partage
- Correction vote/retrait vote (Soutenue)
- Ajout migrations SQL (001-004)
- Documentation déploiement et diagnostic"

# Pousser vers le dépôt
git push origin main
```

### 5. Après le Push

1. **Vercel** (ou autre hébergeur) va automatiquement :
   - Détecter le push
   - Builder l'application
   - Déployer

2. **Configurer les variables d'environnement** dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Exécuter les migrations SQL** dans Supabase de production

4. **Tester** le site en production

# Commit pour Debug Production

## Fichiers à commiter

Les fichiers suivants ont été ajoutés/modifiés pour le debug :

### Modifications
- `app/actions/vote.ts` - Logs de debug améliorés avec `=== VOTE DEBUG ===`
- `app/layout.tsx` - Ajout VoteGatekeeper
- `components/ProposalCard.tsx` - Utilisation VoteGatekeeper
- `package.json` / `package-lock.json` - Nouvelles dépendances

### Nouveaux fichiers
- `app/actions/debug-env.ts` - Action pour debug variables d'environnement
- `app/debug/page.tsx` - Page de debug accessible sur `/debug`
- `app/actions/security.ts` - Vérification humaine (Turnstile)
- `components/VoteGatekeeper.tsx` - Composant de sécurité
- `lib/supabase/admin.ts` - Client Supabase admin

## Commandes pour commiter

```bash
# Ajouter les fichiers de debug
git add app/actions/vote.ts app/actions/debug-env.ts app/debug/ app/actions/security.ts components/VoteGatekeeper.tsx lib/supabase/admin.ts

# Ajouter les autres fichiers nécessaires
git add app/layout.tsx components/ProposalCard.tsx package.json package-lock.json

# Commiter
git commit -m "Debug: Ajout logs détaillés et page de debug pour diagnostiquer erreur 42501

- Ajout logs détaillés avec === VOTE DEBUG === dans vote.ts
- Ajout page /debug pour vérifier variables d'environnement
- Ajout VoteGatekeeper et sécurité Turnstile
- Ajout client Supabase admin pour bypass RLS"

# Pousser
git push origin main
```

## Après le push

1. Attendre que Vercel déploie
2. Aller sur `https://www.hyeres2026.org/debug` pour vérifier les variables
3. Tester un vote et vérifier les logs Vercel avec `=== VOTE DEBUG ===`

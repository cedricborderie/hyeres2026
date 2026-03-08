# Vérification avant mise en production

**Date** : 2025-03-07  
**Branche** : staging → main (production)

## Impact sur les données, votants et sessions

### 1. Données en base
- **Aucune migration ne supprime ni ne modifie des lignes** (votes, proposals, categories, newsletter).
- La migration `024_enable_rls_all_tables.sql` active uniquement RLS et ajuste les politiques (DROP/CREATE policies, REVOKE/GRANT). Aucun `DELETE` ni `UPDATE` sur les données existantes.
- Les actions (`vote.ts`, `results.ts`) utilisent le **client admin** (service_role) pour lire/écrire la table `votes`, comme prévu après activation de la RLS. Même schéma, même logique métier.

### 2. Nombre de votants
- **Inchangé** : les totaux viennent toujours de `proposals.vote_count` (triggers) et de la RPC `count_distinct_voters`, désormais appelée via le client admin (obligatoire une fois RLS activé sur `votes`).
- Aucune modification des triggers ni des vues utilisées pour les comptages.

### 3. Sessions / cookies
- **Le middleware n’est pas modifié** entre main et staging : le cookie `voter_session` est toujours posé et lu de la même façon (nom, options, path).
- Les actions continuent de lire `session_id` depuis le cookie `voter_session` (côté serveur). Aucun nouveau cookie lié au vote n’est introduit.
- La lightbox (LightboxHome) n’utilise **aucun** cookie ni `sessionStorage` pour les votes.

## Prérequis production

1. **Variable d’environnement**  
   `SUPABASE_SERVICE_ROLE_KEY` doit être définie en production. Sans elle, le client admin est absent : les votes par session ne s’affichent pas correctement et le décompte des votants peut rester en fallback (totalVoters: 0).

2. **Migration 024**  
   La migration `024_enable_rls_all_tables.sql` doit être **appliquée en production** (si ce n’est pas déjà fait), pour que RLS soit cohérent avec le code (accès à `votes` uniquement via service_role).

## Fichiers modifiés (staging vs main)

- Engagements : routes par thème, meta images OG, layout.
- Home : lightbox, intégration LightboxHome.
- Composants : Footer, Header, NotationTable, PodiumCard.
- Actions : `vote.ts`, `results.ts` (passage au client admin pour la table `votes`).
- Données : `lib/engagement-data.ts`, `lib/notation-data.ts`.
- Migration : `024_enable_rls_all_tables.sql`.
- Pas de modification : `middleware.ts`, cookies, schéma des tables de votes.

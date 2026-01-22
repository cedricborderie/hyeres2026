# Comment vider la base de données

## 📍 Où exécuter le code SQL

### Étape 1 : Accéder au SQL Editor de Supabase

1. Aller sur https://supabase.com/dashboard
2. Sélectionner votre projet (celui avec l'URL `hvynvggcxxpbavrarbcb.supabase.co`)
3. Dans le menu de gauche, cliquer sur **"SQL Editor"** (icône avec `</>`)

### Étape 2 : Coller et exécuter le code

1. Cliquer sur **"New query"** (ou utiliser l'éditeur existant)
2. Coller ce code :

```sql
-- ⚠️ ATTENTION : Ceci supprime TOUS les votes
DELETE FROM votes;

-- Réinitialiser les compteurs de votes à 0
UPDATE proposals SET vote_count = 0;
```

3. Cliquer sur **"Run"** (ou appuyer sur `Ctrl+Enter` / `Cmd+Enter`)

### Étape 3 : Vérifier

Après exécution, vérifier que c'est bien fait :

```sql
-- Vérifier qu'il n'y a plus de votes
SELECT COUNT(*) FROM votes;
-- Devrait retourner 0

-- Vérifier que tous les compteurs sont à 0
SELECT id, title, vote_count FROM proposals;
-- Tous les vote_count devraient être à 0
```

## ⚠️ Attention

- Cette opération est **irréversible**
- Tous les votes seront **définitivement supprimés**
- Les compteurs seront remis à zéro

## Alternative : Vider seulement les votes de test

Si vous voulez garder les votes réels et supprimer seulement les tests :

```sql
-- Supprimer seulement les votes de test (exemple)
DELETE FROM votes WHERE session_id LIKE 'test-%';

-- Ou supprimer les votes récents (dernières 24h)
DELETE FROM votes WHERE created_at > NOW() - INTERVAL '24 hours';
```

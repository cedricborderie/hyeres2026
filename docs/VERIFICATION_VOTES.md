# Vérification des Votes en Base de Données

## Comment vérifier que les votes s'incrémentent et se décrémentent correctement

### 1. Vérification dans Supabase

#### Vérifier les triggers
Les triggers PostgreSQL mettent automatiquement à jour `vote_count` dans la table `proposals` :

```sql
-- Vérifier que les triggers existent
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'votes';

-- Devrait retourner :
-- trigger_update_vote_count_after_insert (INSERT)
-- trigger_update_vote_count_after_delete (DELETE)
```

#### Vérifier le vote_count d'une proposition
```sql
-- Vérifier le vote_count d'une proposition spécifique
SELECT id, title, vote_count 
FROM proposals 
WHERE id = 'h1';

-- Compter manuellement les votes pour cette proposition
SELECT COUNT(*) as vote_count_manual
FROM votes 
WHERE proposal_id = 'h1';

-- Les deux valeurs doivent être identiques
```

#### Test d'incrémentation
```sql
-- 1. Noter le vote_count initial
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';

-- 2. Insérer un vote (via l'application ou manuellement)
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', 'test-session-id-123');

-- 3. Vérifier que vote_count a été incrémenté automatiquement
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';
-- Le vote_count devrait avoir augmenté de 1
```

#### Test de décrémentation
```sql
-- 1. Noter le vote_count actuel
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';

-- 2. Supprimer un vote
DELETE FROM votes 
WHERE proposal_id = 'h1' AND session_id = 'test-session-id-123';

-- 3. Vérifier que vote_count a été décrémenté automatiquement
SELECT id, title, vote_count FROM proposals WHERE id = 'h1';
-- Le vote_count devrait avoir diminué de 1
```

### 2. Vérification via l'Application

#### Test manuel
1. Aller sur `/propositions`
2. Voter pour une proposition (ex: h1)
3. Vérifier dans Supabase que :
   - Un enregistrement existe dans `votes` avec `proposal_id = 'h1'`
   - Le `vote_count` de la proposition h1 a augmenté de 1
4. Recliquer sur "Soutenue" pour retirer le vote
5. Vérifier dans Supabase que :
   - L'enregistrement dans `votes` a été supprimé
   - Le `vote_count` de la proposition h1 a diminué de 1

#### Vérifier via la page Résultats
- Aller sur `/resultats`
- Le nombre de votes affiché doit correspondre au `vote_count` en base

### 3. Problèmes Potentiels

#### Si vote_count ne s'incrémente pas
1. Vérifier que les triggers existent (voir requête SQL ci-dessus)
2. Vérifier que les triggers sont activés :
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%vote_count%';
```

#### Si vote_count ne se décrémente pas
1. Vérifier que le trigger `trigger_update_vote_count_after_delete` existe
2. Vérifier les logs Supabase pour des erreurs

#### Si les valeurs ne correspondent pas
```sql
-- Script de synchronisation manuelle (à exécuter si nécessaire)
UPDATE proposals p
SET vote_count = (
  SELECT COUNT(*) 
  FROM votes v 
  WHERE v.proposal_id = p.id
);
```

### 4. Logs et Debugging

Dans les Server Actions (`app/actions/vote.ts`), les erreurs sont loggées dans la console serveur :
- Vérifier les logs Next.js pour des erreurs Supabase
- Vérifier les logs Supabase Dashboard pour des erreurs de triggers

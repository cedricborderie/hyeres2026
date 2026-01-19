-- Migration: Test script to verify vote triggers work correctly
-- Created: 2025-01-19
-- Description: Script de test pour vérifier que les triggers incrémentent/décrémentent vote_count
-- ⚠️ Ce fichier est un script de test, ne pas l'exécuter en production sans précaution

-- ============================================
-- TEST 1: Vérifier que les triggers existent
-- ============================================
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'votes'
ORDER BY trigger_name;

-- Devrait retourner 2 triggers :
-- 1. trigger_update_vote_count_after_insert (INSERT)
-- 2. trigger_update_vote_count_after_delete (DELETE)

-- ============================================
-- TEST 2: Vérifier l'état initial d'une proposition
-- ============================================
-- Remplacer 'h1' par l'ID d'une proposition de test
SELECT 
  id, 
  title, 
  vote_count as vote_count_initial,
  (SELECT COUNT(*) FROM votes WHERE proposal_id = 'h1') as vote_count_manual
FROM proposals 
WHERE id = 'h1';

-- Les deux valeurs doivent être identiques

-- ============================================
-- TEST 3: Test d'incrémentation
-- ============================================
-- Insérer un vote de test
-- ⚠️ Utiliser un session_id unique pour le test (UUID)
INSERT INTO votes (proposal_id, session_id) 
VALUES ('h1', gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Vérifier que vote_count a été incrémenté automatiquement
SELECT 
  id, 
  title, 
  vote_count as vote_count_apres_insert,
  (SELECT COUNT(*) FROM votes WHERE proposal_id = 'h1') as vote_count_manual
FROM proposals 
WHERE id = 'h1';

-- vote_count_apres_insert doit être égal à vote_count_manual

-- ============================================
-- TEST 4: Test de décrémentation
-- ============================================
-- Supprimer le vote de test (un seul)
-- Note: PostgreSQL ne supporte pas LIMIT dans DELETE, on utilise une sous-requête
-- Supprimer le dernier vote de test inséré pour h1
DELETE FROM votes 
WHERE id = (
  SELECT id FROM votes 
  WHERE proposal_id = 'h1'
  ORDER BY created_at DESC
  LIMIT 1
);

-- Vérifier que vote_count a été décrémenté automatiquement
SELECT 
  id, 
  title, 
  vote_count as vote_count_apres_delete,
  (SELECT COUNT(*) FROM votes WHERE proposal_id = 'h1') as vote_count_manual
FROM proposals 
WHERE id = 'h1';

-- vote_count_apres_delete doit être égal à vote_count_manual
-- et inférieur à vote_count_apres_insert

-- ============================================
-- TEST 5: Synchronisation manuelle (si nécessaire)
-- ============================================
-- Si les triggers ne fonctionnent pas, exécuter cette requête
-- pour synchroniser manuellement tous les vote_count
/*
UPDATE proposals p
SET vote_count = (
  SELECT COUNT(*) 
  FROM votes v 
  WHERE v.proposal_id = p.id
);
*/

-- ============================================
-- VÉRIFICATION FINALE
-- ============================================
-- Comparer vote_count avec le nombre réel de votes pour toutes les propositions
SELECT 
  p.id,
  p.title,
  p.vote_count as vote_count_table,
  COUNT(v.id) as vote_count_reel,
  CASE 
    WHEN p.vote_count = COUNT(v.id) THEN '✓ OK'
    ELSE '✗ ERREUR'
  END as statut
FROM proposals p
LEFT JOIN votes v ON v.proposal_id = p.id
GROUP BY p.id, p.title, p.vote_count
ORDER BY p.id;

-- Toutes les lignes doivent afficher '✓ OK'

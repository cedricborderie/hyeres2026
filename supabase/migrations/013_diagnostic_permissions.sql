-- Migration: Diagnostic des permissions sur la table votes
-- Created: 2024
-- Description: Script de diagnostic pour vérifier les permissions après migration 011

-- 1. Vérifier les permissions actuelles
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role', 'postgres')
ORDER BY grantee, privilege_type;

-- 2. Vérifier si la table existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_name = 'votes';

-- 3. Vérifier les contraintes
SELECT 
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'votes'::regclass;

-- 4. Vérifier les triggers
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'votes';

-- 5. Test d'insertion avec service_role (à exécuter manuellement avec service_role)
-- Cette requête devrait fonctionner si vous êtes connecté avec service_role
-- INSERT INTO votes (proposal_id, session_id) 
-- VALUES ('h1', 'test-session-diagnostic-' || gen_random_uuid()::text)
-- ON CONFLICT DO NOTHING;

-- 6. Nettoyer le test si nécessaire
-- DELETE FROM votes WHERE session_id LIKE 'test-session-diagnostic-%';

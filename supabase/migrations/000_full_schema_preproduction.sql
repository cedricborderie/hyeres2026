-- ============================================================================
-- FULL SCHEMA: Préproduction Environment
-- ============================================================================
-- Description: Script complet pour créer un nouvel environnement de préproduction
-- Usage: Exécuter ce script dans Supabase SQL Editor pour un nouveau projet
-- Date: 2025-01-20
-- ============================================================================

-- ============================================================================
-- PARTIE 1: EXTENSIONS
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PARTIE 2: TABLES
-- ============================================================================

-- Table: categories
-- Stores the three main categories: Habitat, Mobilité, Agriculture
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  color_theme VARCHAR(7) NOT NULL, -- Hex color code (e.g., #0ea5e9)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: proposals
-- Stores political proposals with their details
-- Note: id is VARCHAR(50) to match lib/data.ts string IDs (h1, m1, etc.)
CREATE TABLE IF NOT EXISTS proposals (
  id VARCHAR(50) PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL, -- Short description for cards
  content_text TEXT NOT NULL, -- Long detailed content
  external_link VARCHAR(500), -- Optional external link
  vote_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: votes
-- Stores anonymous votes using session_id (from cookies)
-- Constraint: A session_id can only vote once per proposal_id
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id VARCHAR(50) NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  session_id UUID NOT NULL, -- Anonymous user identifier from cookies
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(proposal_id, session_id) -- Ensures one vote per session per proposal
);

-- Table: newsletter_subscriptions
-- Stores email addresses for newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PARTIE 3: INDEXES
-- ============================================================================

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_category_id ON proposals(category_id);
CREATE INDEX IF NOT EXISTS idx_proposals_vote_count ON proposals(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_votes_session_id ON votes(session_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

-- ============================================================================
-- PARTIE 4: FUNCTIONS
-- ============================================================================

-- Function to update vote_count when a vote is added
CREATE OR REPLACE FUNCTION update_proposal_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE proposals
  SET vote_count = (
    SELECT COUNT(*) FROM votes WHERE proposal_id = NEW.proposal_id
  ),
  updated_at = NOW()
  WHERE id = NEW.proposal_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update vote_count when a vote is removed
CREATE OR REPLACE FUNCTION update_proposal_vote_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE proposals
  SET vote_count = (
    SELECT COUNT(*) FROM votes WHERE proposal_id = OLD.proposal_id
  ),
  updated_at = NOW()
  WHERE id = OLD.proposal_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTIE 5: TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist (to allow re-running the script)
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_insert ON votes;
DROP TRIGGER IF EXISTS trigger_update_vote_count_after_delete ON votes;
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS trigger_proposals_updated_at ON proposals;
DROP TRIGGER IF EXISTS trigger_newsletter_updated_at ON newsletter_subscriptions;

-- Triggers to automatically update vote_count
CREATE TRIGGER trigger_update_vote_count_after_insert
AFTER INSERT ON votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count();

CREATE TRIGGER trigger_update_vote_count_after_delete
AFTER DELETE ON votes
FOR EACH ROW
EXECUTE FUNCTION update_proposal_vote_count_on_delete();

-- Triggers for updated_at on categories, proposals, and newsletter
CREATE TRIGGER trigger_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_proposals_updated_at
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_newsletter_updated_at
BEFORE UPDATE ON newsletter_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PARTIE 6: DATA - CATEGORIES
-- ============================================================================

-- Insert initial categories
INSERT INTO categories (id, name, slug, color_theme) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Habitat', 'habitat', '#0ea5e9'),
  ('00000000-0000-0000-0000-000000000002', 'Mobilité', 'mobilite', '#22c55e'),
  ('00000000-0000-0000-0000-000000000003', 'Agriculture', 'agriculture', '#eab308')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PARTIE 7: DATA - PROPOSALS
-- ============================================================================

-- Insert all proposals (5 Habitat, 15 Mobilités, 1 Agriculture)
INSERT INTO proposals (id, category_id, title, description, content_text, external_link) VALUES

-- --- HABITAT (5 Recommandations) ---
('h1', '00000000-0000-0000-0000-000000000001', '1. Réviser un PLU trop permissif', 
 'Diminuer la constructibilité et maîtriser les densités.',
 'Nous proposons de réduire les zones constructibles (Zones U) et d''appliquer la loi Le Meur pour interdire toute construction supplémentaire de résidences secondaires. Il faut rendre obligatoire une notice urbanistique opposable valorisant la mixité et les espaces communs, et redonner une vocation agricole à la zone des Rougières.',
 NULL),

('h2', '00000000-0000-0000-0000-000000000001', '2. Protéger et valoriser le littoral',
 'Appliquer strictement la loi Littoral et sauvegarder les espaces sensibles.',
 'Le littoral est une réserve de biodiversité et une valeur paysagère forte. Nous demandons l''application stricte de la loi Littoral, la sauvegarde des espaces sensibles (MGEN, Gapeau, La Badine) et le déplacement de l''embarcadère de la Tour Fondue vers le port.',
 NULL),

('h3', '00000000-0000-0000-0000-000000000001', '3. Anticiper les risques d''inondation',
 'Délimiter des zones inconstructibles strictes face à la submersion.',
 'Face aux épisodes pluvieux intenses et au recul du trait de côte, la révision du PPRI est une priorité. Les règles d''urbanisme doivent interdire toute nouvelle construction dans les zones à risque et définir des projets pilotes de relocalisation (logique solidaire et responsable).',
 NULL),

('h4', '00000000-0000-0000-0000-000000000001', '4. Faire face aux canicules',
 'Végétalisation massive et rénovation thermique des bâtiments.',
 'Pour réduire les îlots de chaleur, nous proposons une végétalisation massive de l''espace public (50 à 150€/m2) et la rénovation des bâtiments publics inadaptés (isolation, protections solaires, free cooling). Les Plans Climat Air Energie (PCAET) doivent être respectés.',
 NULL),

('h5', '00000000-0000-0000-0000-000000000001', '5. Favoriser un habitat mixte et accessible',
 'Mobiliser les logements vacants et créer une Coopérative Foncière.',
 'Il y a 2600 logements vacants à Hyères ! Appliquons la Taxe sur les Logements Vacants (TLV) pour financer leur rénovation via l''ANAH. Nous proposons aussi de passer la taxe sur les résidences secondaires à 20% et de créer un Organisme Foncier Solidaire (OFS) pour des logements durablement abordables (Bail Réel Solidaire).',
 NULL),

-- --- MOBILITÉS (15 Propositions) ---
('m1', '00000000-0000-0000-0000-000000000002', '1. Créer un poste de Responsable Vélo',
 'Un pilotage réactif dédié à la mairie et à la métropole.',
 'Recrutement d''un chargé de mission pour coordonner infrastructures et communication. Création de synergies avec la métropole TPM pour fluidifier les projets. Coût estimé : 1,31 €/habitant.',
 NULL),

('m2', '00000000-0000-0000-0000-000000000002', '2. Partager les compétences (Police & Admin)',
 'Essaimer la ''Culture Vélo'' dans les services.',
 'Former un référent à chaque échelon administratif et former 5% de la Police Municipale (6 agents) à la mobilité cycliste (Brevet FUB) pour assurer une sécurité de proximité.',
 NULL),

('m3', '00000000-0000-0000-0000-000000000002', '3. Raccourcir les circuits de décision',
 'Créer un Comité de Pilotage participatif (COPIL).',
 'Associer les usagers et associations à chaque étape pour des aménagements utiles. Publier un bilan de performance public deux fois par an.',
 NULL),

('m4', '00000000-0000-0000-0000-000000000002', '4. Location de vélos au Pôle Gare',
 'Transformer 5 places de parking en espace de location.',
 'Création d''un espace de 100m² au cœur du pôle multimodal en partenariat avec des loueurs privés, sans subvention publique nécessaire.',
 NULL),

('m5', '00000000-0000-0000-0000-000000000002', '5. Label ''Employeur Pro-Vélo'' (Niveau Or)',
 'La Mairie doit devenir exemplaire.',
 'Engagement immédiat de la municipalité dans la démarche pour faire de la collectivité un modèle de mobilité durable.',
 NULL),

('m6', '00000000-0000-0000-0000-000000000002', '6. Promotion dynamique',
 'Communication et événements (Fête du vélo).',
 'Intégrer les mobilités actives dans toutes les communications municipales et organiser des événements réguliers ambitieux.',
 NULL),

('m7', '00000000-0000-0000-0000-000000000002', '7. Priorité à nos enfants (13 écoles)',
 'Réduire drastiquement le transit devant les écoles.',
 'Transformation en zones de rencontre ou mise en sens unique devant les 13 écoles identifiées pour libérer de l''espace de vie et sécuriser les entrées/sorties.',
 NULL),

('m8', '00000000-0000-0000-0000-000000000002', '8. Le Double Sens Cyclable',
 'Généralisation pour la fluidité et la visibilité.',
 'Maillage du centre-ville avec signalisation systématique des doubles sens (interventions légères : marquage/panneaux) pour éviter les détours inutiles.',
 NULL),

('m9', '00000000-0000-0000-0000-000000000002', '9. Extension du Cœur de Ville',
 'Zones piétonnes et zones de rencontre.',
 'Redonner de l''espace à la vie et au commerce de proximité tout en maintenant une accessibilité pour les résidents et livraisons.',
 NULL),

('m10', '00000000-0000-0000-0000-000000000002', '10. Visibilité aux passages piétons (Loi LOM)',
 'Suppression du stationnement 5m en amont.',
 'Mise en conformité légale : neutralisation du stationnement masquant la visibilité piétonne, remplacé par des arceaux vélos ou de la végétalisation.',
 NULL),

('m11', '00000000-0000-0000-0000-000000000002', '11. Cohabitation pacifiée',
 'Sensibilisation et pédagogie.',
 'Actions pour expliquer les nouveaux aménagements (sas vélo, voie verte, etc.) et inciter à la vigilance envers les usagers vulnérables.',
 NULL),

('m12', '00000000-0000-0000-0000-000000000002', '12. Maillage Territorial 2032',
 'Relier les 9 mairies annexes et le centre.',
 'Créer des itinéraires sécurisés et directs. Déployer des aménagements de transition dès le début du mandat sur les carrefours critiques.',
 NULL),

('m13', '00000000-0000-0000-0000-000000000002', '13. Activer le ''Réflexe Vélo''',
 'Signalétique unifiée et jalonnement.',
 'Déployer un jalonnement systématique vers les points d''intérêt (temps de trajet vélo) et une signalisation incitant les voitures à la prudence.',
 NULL),

('m14', '00000000-0000-0000-0000-000000000002', '14. Combattre l''enclavement',
 'Servitudes de passage et Loi LAURE.',
 'Préempter des passages clés pour éviter les détours. Appliquer la Loi LAURE : chaque rénovation de voirie doit intégrer un aménagement cyclable.',
 NULL),

('m15', '00000000-0000-0000-0000-000000000002', '15. Intelligence Collective',
 'Co-construction avec les associations.',
 'Mobiliser l''expertise des usagers locaux (gratuite) pour dessiner les tracés les plus efficaces et optimiser les deniers publics.',
 NULL),

-- --- AGRICULTURE (1 Proposition) ---
('a1', '00000000-0000-0000-0000-000000000003', 'Consultation : Terres Agricoles',
 'Ce volet est en cours de construction.',
 'La préservation de la plaine agricole et l''alimentation locale sont des enjeux majeurs. Nous finalisons nos propositions. Vous avez une idée ou une expertise ? Écrivez-nous pour participer.',
 'mailto:contact@changerdere.org')

ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PARTIE 8: PERMISSIONS & SECURITY
-- ============================================================================

-- Disable RLS on votes table (we use service_role for inserts)
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow public inserts on votes" ON votes;
DROP POLICY IF EXISTS "Allow public selects on votes" ON votes;
DROP POLICY IF EXISTS "Allow public deletes on votes" ON votes;
DROP POLICY IF EXISTS "service_role_can_insert_votes" ON votes;

-- Grant ALL permissions to service_role (for server-side inserts)
GRANT ALL PRIVILEGES ON TABLE votes TO service_role;
GRANT ALL PRIVILEGES ON TABLE proposals TO service_role;
GRANT ALL PRIVILEGES ON TABLE categories TO service_role;
GRANT ALL PRIVILEGES ON TABLE newsletter_subscriptions TO service_role;

-- Revoke INSERT from anon and authenticated (security - only service_role can insert votes)
REVOKE INSERT ON TABLE votes FROM anon;
REVOKE INSERT ON TABLE votes FROM authenticated;

-- Grant SELECT and DELETE to anon and authenticated (for reads and vote deletion)
GRANT SELECT ON TABLE votes TO anon, authenticated;
GRANT DELETE ON TABLE votes TO anon, authenticated;

-- Grant SELECT on other tables for public access
GRANT SELECT ON TABLE proposals TO anon, authenticated;
GRANT SELECT ON TABLE categories TO anon, authenticated;
GRANT INSERT ON TABLE newsletter_subscriptions TO anon, authenticated;

-- ============================================================================
-- PARTIE 9: COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE categories IS 'Main categories for proposals: Habitat, Mobilité, Agriculture';
COMMENT ON TABLE proposals IS 'Political proposals that citizens can vote on';
COMMENT ON TABLE votes IS 'Anonymous votes from users identified by session_id (from cookies). Only service_role can insert votes.';
COMMENT ON TABLE newsletter_subscriptions IS 'Email addresses subscribed to the newsletter';
COMMENT ON COLUMN votes.session_id IS 'UUID stored in cookies to identify anonymous users. One vote per session_id per proposal.';
COMMENT ON COLUMN proposals.id IS 'String ID matching lib/data.ts (e.g., h1, m1, a1)';
COMMENT ON CONSTRAINT votes_proposal_id_session_id_key ON votes IS 'Ensures a session_id can only vote once per proposal';

-- ============================================================================
-- PARTIE 10: VERIFICATION
-- ============================================================================

-- Verify categories
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories;

-- Verify proposals
SELECT 'Proposals' as table_name, COUNT(*) as count FROM proposals;
SELECT category_id, COUNT(*) as count FROM proposals GROUP BY category_id;

-- Verify permissions on votes table
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'votes'
  AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, privilege_type;

-- Verify RLS is disabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'votes';

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
-- Le schéma est maintenant prêt pour la préproduction.
-- Vérifiez que :
-- - 3 catégories ont été créées
-- - 21 propositions ont été créées (5 Habitat, 15 Mobilités, 1 Agriculture)
-- - service_role a INSERT sur votes
-- - anon et authenticated n'ont PAS INSERT sur votes
-- - RLS est désactivé sur votes
-- ============================================================================

-- Migration: Update Mobilités & Vélo proposals (14 proposals, down from 15)
-- Created: 2024
-- Description: Replaces all existing mobilites proposals (m1 to m15) with 14 updated proposals (m1 to m14)
-- Important: Removes m15 (Intelligence Collective) and updates all other proposals

-- Category UUID mapping:
-- mobilites -> '00000000-0000-0000-0000-000000000002'

-- Step 1: Delete all existing mobilites proposals (including m15)
DELETE FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000002';

-- Step 2: Insert all 14 updated Mobilités & Vélo proposals
INSERT INTO proposals (id, category_id, title, description, content_text, external_link) VALUES

-- Thème 1 : Organisation Agile
('m1', '00000000-0000-0000-0000-000000000002', 'M1. Responsable Vélo',
 'Un pilotage réactif à la mairie et métropole.',
 'Recrutement d''un chargé de mission pour coordonner infrastructures et communication. Création de synergies avec la métropole pour accélérer les projets.',
 NULL),

('m2', '00000000-0000-0000-0000-000000000002', 'M2. Partager les compétences',
 'Formation des agents et Police Municipale.',
 'Former un référent à chaque échelon et former 5% de la Police Municipale (6 agents) à la mobilité cycliste (Brevet FUB) pour une sécurité de proximité.',
 NULL),

('m3', '00000000-0000-0000-0000-000000000002', 'M3. Intelligence Collective',
 'Un Comité de Pilotage participatif (COPIL).',
 'Associer les usagers et associations à chaque étape via un COPIL et publier un bilan de performance public deux fois par an pour ajuster la politique.',
 NULL),

('m4', '00000000-0000-0000-0000-000000000002', 'M4. Location Vélo Gare',
 'Transformer 5 places de parking.',
 'Créer un espace de location de 50 à 100m² au sein du futur pôle multimodal en partenariat avec des loueurs privés, sans subvention publique (Coût 0€).',
 NULL),

('m5', '00000000-0000-0000-0000-000000000002', 'M5. Employeur Pro-Vélo',
 'Viser le niveau Or pour la Mairie.',
 'Engagement immédiat de la municipalité dans la démarche ''Employeur Pro-Vélo'' pour faire de la collectivité un modèle de mobilité durable.',
 NULL),

('m6', '00000000-0000-0000-0000-000000000002', 'M6. Promotion dynamique',
 'Communication et Fête du vélo.',
 'Promouvoir les mobilités actives dans toutes les communications municipales et organiser des événements réguliers et ambitieux.',
 NULL),

-- Thème 2 : Apaiser nos rues
('m7', '00000000-0000-0000-0000-000000000002', 'M7. Priorité enfants (13 écoles)',
 'Réduire drastiquement la vitesse et le transit.',
 'Transformer les abords des 13 écoles retenues en zones de rencontre ou sens uniques pour libérer de l''espace de vie sans bloquer la desserte locale.',
 NULL),

('m8', '00000000-0000-0000-0000-000000000002', 'M8. Double Sens Cyclable',
 'Fluidité et visibilité en centre-ville.',
 'Généraliser la signalisation des doubles sens (interventions légères : marquage, panneaux) pour éviter les détours inutiles aux cyclistes.',
 NULL),

('m9', '00000000-0000-0000-0000-000000000002', 'M9. Extension Cœur de Ville',
 'Zones piétonnes et de rencontre.',
 'Redonner de l''espace à la vie et au commerce de proximité (priorité piétonne) tout en préservant l''accessibilité pour les résidents et les livraisons.',
 NULL),

('m10', '00000000-0000-0000-0000-000000000002', 'M10. Visibilité Passages Piétons',
 'Mise en conformité Loi LOM.',
 'Neutraliser systématiquement le stationnement 5 mètres en amont des passages piétons (arceaux vélos, végétalisation) pour la sécurité des plus vulnérables.',
 NULL),

('m11', '00000000-0000-0000-0000-000000000002', 'M11. Cohabitation Pacifiée',
 'Sensibilisation et pédagogie.',
 'Sensibiliser les automobilistes et expliquer les nouveaux aménagements (sas vélo, voie verte, etc.) pour inciter à la vigilance et à la modération.',
 NULL),

-- Thème 3 : Connecter le territoire
('m12', '00000000-0000-0000-0000-000000000002', 'M12. Maillage Territorial',
 'Relier 8 mairies sur 10.',
 'Créer des itinéraires efficaces entre les centres-villes. Déployer des aménagements de transition immédiats sur les carrefours critiques avant pérennisation.',
 NULL),

('m13', '00000000-0000-0000-0000-000000000002', 'M13. Activer le Réflexe Vélo',
 'Signalétique unifiée et jalonnement.',
 'Déployer un jalonnement dense vers les points d''intérêt et une signalisation incitant naturellement au partage de la route.',
 NULL),

('m14', '00000000-0000-0000-0000-000000000002', 'M14. Combattre l''enclavement',
 'Chemins de proximité et Loi LAURE.',
 'Préempter des passages clés pour restaurer les continuités et appliquer strictement la Loi LAURE : chaque rénovation de voirie doit intégrer un aménagement cyclable.',
 NULL)

ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content_text = EXCLUDED.content_text,
  external_link = EXCLUDED.external_link,
  updated_at = NOW();

-- Step 3: Delete any votes associated with the removed proposal (m15)
-- This ensures data consistency
DELETE FROM votes WHERE proposal_id = 'm15';

-- Verify the insertion
SELECT COUNT(*) as total_mobilites_proposals FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000002';
SELECT id, title FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000002' ORDER BY id;

-- Verify m15 is removed
SELECT COUNT(*) as m15_count FROM proposals WHERE id = 'm15';

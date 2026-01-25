-- Migration: Update Habitat proposals with 20 new proposals
-- Created: 2024
-- Description: Replace the 5 old habitat proposals with 20 new numbered proposals

-- Category UUID mapping:
-- habitat -> '00000000-0000-0000-0000-000000000001'
-- mobilites -> '00000000-0000-0000-0000-000000000002'
-- agriculture -> '00000000-0000-0000-0000-000000000003'

-- Step 1: Delete old habitat proposals (h1 to h5)
DELETE FROM proposals WHERE id IN ('h1', 'h2', 'h3', 'h4', 'h5') AND category_id = '00000000-0000-0000-0000-000000000001';

-- Step 2: Insert the 20 new habitat proposals
INSERT INTO proposals (id, category_id, title, description, content_text, external_link) VALUES

-- --- AXE 1 : RÉVISER UN PLU TROP PERMISSIF (Points 1 à 4) ---
('h1', '00000000-0000-0000-0000-000000000001', '1. Diminuer la constructibilité', 
 'Réduire les zones U et stopper les résidences secondaires.',
 'Réduire les zones constructibles (Zones U) et appliquer la loi Le Meur pour interdire toute construction supplémentaire de résidences secondaires.',
 NULL),

('h2', '00000000-0000-0000-0000-000000000001', '2. Maîtriser les densités',
 'Stopper l''étalement urbain et l''habitat diffus.',
 'Encadrer strictement les lotissements périphériques. Rendre obligatoire une notice urbanistique opposable valorisant la mixité et les espaces communs.',
 NULL),

('h3', '00000000-0000-0000-0000-000000000001', '3. Préserver les espaces agricoles',
 'Protéger les Rougières et appliquer la Loi Climat.',
 'Créer des zones agricoles protégées (ZAP), appliquer l''objectif Zéro Artificialisation et redonner une vocation agricole à la zone des Rougières.',
 NULL),

('h4', '00000000-0000-0000-0000-000000000001', '4. Préserver le patrimoine bâti',
 'Protéger le petit patrimoine avec les habitants.',
 'Inventorier le patrimoine non classé et travailler avec l''Architecte des Bâtiments de France pour imposer des règles strictes aux promoteurs.',
 NULL),

-- --- AXE 2 : PROTÉGER LE LITTORAL (Points 5 à 7) ---
('h5', '00000000-0000-0000-0000-000000000001', '5. Appliquer la Loi Littoral',
 'Limiter strictement les extensions en bord de mer.',
 'Zéro dérogation : limiter les nouvelles constructions et les extensions pour préserver la valeur paysagère et la biodiversité.',
 NULL),

('h6', '00000000-0000-0000-0000-000000000001', '6. Sauvegarder les espaces sensibles',
 'Protection absolue (MGEN, Gapeau, La Badine).',
 'Ces sites emblématiques doivent être totalement préservés. Nous tendrons vers des densités plus faibles et des zones inconstructibles.',
 NULL),

('h7', '00000000-0000-0000-0000-000000000001', '7. Déplacer l''embarcadère',
 'Désengorger la Tour Fondue vers le Port.',
 'Déplacer les flux vers le port d''Hyères et envisager à terme la fermeture de la route du Sel à la circulation automobile.',
 NULL),

-- --- AXE 3 : RISQUES INONDATION (Points 8 à 11) ---
('h8', '00000000-0000-0000-0000-000000000001', '8. Zéro construction en zone à risque',
 'Interdiction totale, même en surélevant.',
 'Délimiter des zones rouges strictes où toute nouvelle construction est interdite face à l''aggravation des risques d''inondation.',
 NULL),

('h9', '00000000-0000-0000-0000-000000000001', '9. Révision du PPRI',
 'Une priorité absolue du mandat.',
 'Mettre à jour le Plan de Prévention des Risques d''Inondation pour tenir compte de l''imperméabilisation des sols.',
 NULL),

('h10', '00000000-0000-0000-0000-000000000001', '10. Anticiper le retrait du trait de côte',
 'Définir des zones d''études prospectives.',
 'Identifier dans le PLU les zones menacées par la montée des eaux pour geler les projets à risque.',
 NULL),

('h11', '00000000-0000-0000-0000-000000000001', '11. Projets pilotes de relocalisation',
 'Une logique de solidarité face aux risques.',
 'Expérimenter des solutions de relocalisation ou d''adaptation pour les habitants menacés par les risques littoraux.',
 NULL),

-- --- AXE 4 : CANICULES (Points 12 à 13) ---
('h12', '00000000-0000-0000-0000-000000000001', '12. Réduire les îlots de chaleur',
 'Végétalisation massive (50-150€/m²).',
 'Remplacer les matériaux inadaptés et créer des îlots de fraîcheur sur l''espace public.',
 NULL),

('h13', '00000000-0000-0000-0000-000000000001', '13. Rénover les bâtiments publics',
 'Isolation et ''Free Cooling''.',
 'Investir (200-500€/m²) pour adapter écoles et mairies aux fortes chaleurs (protections solaires, surventilation).',
 NULL),

-- --- AXE 5 : HABITAT MIXTE (Points 14 à 20) ---
('h14', '00000000-0000-0000-0000-000000000001', '14. Taxe Logements Vacants (TLV)',
 'Mobiliser les 2600 logements vides.',
 'Appliquer la TLV (17% puis 34%) pour inciter à la location et reverser les recettes à l''ANAH.',
 NULL),

('h15', '00000000-0000-0000-0000-000000000001', '15. Opération Réhabilitation',
 'Aider les propriétaires (MaPrimeRénov).',
 'Lancer une campagne massive pour remettre les logements vacants sur le marché (Coût pour la ville : 0€).',
 NULL),

('h16', '00000000-0000-0000-0000-000000000001', '16. Réinvestir les amendes SRU',
 'Acheter dans le centre-ville.',
 'Utiliser les 318 000€ d''amendes annuelles pour préempter et rénover des immeubles anciens.',
 NULL),

('h17', '00000000-0000-0000-0000-000000000001', '17. Hausse Taxe Résidences Secondaires',
 'Passer de 12% à 20% (Zone Tendue).',
 'Générer 1,5M€ de recettes supplémentaires par an pour financer le logement abordable.',
 NULL),

('h18', '00000000-0000-0000-0000-000000000001', '18. Coopérative Foncière (BRS)',
 'Logements abordables à vie.',
 'Créer un Organisme Foncier Solidaire : la ville garde le terrain, l''habitant achète les murs 30% moins cher.',
 NULL),

('h19', '00000000-0000-0000-0000-000000000001', '19. Renouvellement Val des Rougières',
 'Plan ANRU sur 15 ans.',
 'Requalifier totalement le quartier pour améliorer la vie des habitants (Investissement : 24€/habitant/an).',
 NULL),

('h20', '00000000-0000-0000-0000-000000000001', '20. Hébergement Saisonniers & Jeunes',
 'Auberges de jeunesse et Tiers-lieux.',
 'Créer des solutions d''hébergement dignes et hybrides pour les travailleurs et les jeunes.',
 NULL)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content_text = EXCLUDED.content_text,
  external_link = EXCLUDED.external_link,
  updated_at = NOW();

-- Verify the insertion
SELECT COUNT(*) as total_habitat_proposals FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000001';
SELECT id, title FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000001' ORDER BY id;

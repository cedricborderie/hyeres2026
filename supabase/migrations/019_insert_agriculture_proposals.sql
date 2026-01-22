-- Migration: Insert Agriculture & Alimentation proposals (22 proposals)
-- Created: 2024
-- Description: Replaces the placeholder agriculture proposal (a1) with 22 final proposals (a1 to a22)

-- Category UUID mapping:
-- agriculture -> '00000000-0000-0000-0000-000000000003'

-- Step 1: Delete the old placeholder proposal (a1)
DELETE FROM proposals WHERE id = 'a1';

-- Step 2: Insert all 22 Agriculture & Alimentation proposals
INSERT INTO proposals (id, category_id, title, description, content_text, external_link) VALUES

-- Thème 1 : Gouvernance & Actions Conjointes
('a1', '00000000-0000-0000-0000-000000000003', 'A1. Nommer un élu dédié',
 'Un engagement réel sans cumul de mandats.',
 'Nommer un(e) élu(e) Agriculture et Alimentation durable qui ne pourra pas cumuler plus de 2 délégations afin de garantir un engagement réel et total dédié à ces deux thèmes.',
 NULL),

('a2', '00000000-0000-0000-0000-000000000003', 'A2. Commission Citoyenne Agricole',
 'Responsabiliser élus, pros et citoyens.',
 'Créer une commission ''multi-acteurs'' pilotée par la mairie incluant élus, associations, citoyens, professionnels, équipes éducatives, parents et agriculteurs.',
 NULL),

-- Thème 2 : Agriculture Durable (Pour les Agriculteurs)
('a3', '00000000-0000-0000-0000-000000000003', 'A3. Sauvegarder les terres (ZAP)',
 'Zéro Artificialisation Nette et Zones Protégées.',
 'Appliquer l''objectif Zéro Artificialisation Nette (ZAN) et mettre en place des Zones Agricoles Protégées (ZAP) sur la commune pour empêcher le bétonnage des terres fertiles.',
 NULL),

('a4', '00000000-0000-0000-0000-000000000003', 'A4. Mobiliser les terres privées',
 'Inciter les propriétaires à louer ou cultiver.',
 'Encourager la mise en culture des terres privées inexploitées via des incitations fiscales ou des taxes, et faciliter les contrats de fermage pour lutter contre la spéculation immobilière.',
 NULL),

('a5', '00000000-0000-0000-0000-000000000003', 'A5. Espaces-test agricoles',
 'Aider les jeunes agriculteurs à se lancer.',
 'Mettre à disposition des terres communales pour créer des espaces-tests permettant à de nouveaux agriculteurs de vérifier la viabilité de leur projet dans un cadre sécurisé.',
 NULL),

('a6', '00000000-0000-0000-0000-000000000003', 'A6. Foncière Agricole (SCIC)',
 'La ville achète, l''agriculteur cultive.',
 'Créer une coopérative (SCIC ou SCOP) pour acquérir du foncier, réaliser les aménagements nécessaires (serres, irrigation) et louer à des exploitants locaux sans spéculation.',
 NULL),

('a7', '00000000-0000-0000-0000-000000000003', 'A7. Habitat léger agricole',
 'Loger les agriculteurs sur place.',
 'Autoriser et encadrer l''installation d''habitats légers pour les maraîchers afin de contourner la pression immobilière et leur permettre de vivre dignement sur leur lieu de production.',
 NULL),

-- Thème 3 : Agriculture Durable (Pour les Habitants)
('a8', '00000000-0000-0000-0000-000000000003', 'A8. Jardins et vergers urbains',
 'Des espaces verts comestibles pour tous.',
 'Transformer les espaces verts en massifs nourriciers et créer des jardins partagés animés par des agents communaux, accessibles aux habitants via une carte membre.',
 NULL),

('a9', '00000000-0000-0000-0000-000000000003', 'A9. Ferme Municipale Pédagogique',
 'Produire pour les cantines et éduquer.',
 'Créer une ferme gérée par des agents municipaux : production agro-écologique pour la restauration collective et lieu pédagogique pour sensibiliser les écoles et le public.',
 NULL),

-- Thème 4 : Alimentation Durable & Social
('a10', '00000000-0000-0000-0000-000000000003', 'A10. Sécurité Sociale de l''Alimentation',
 'Un droit à bien manger pour tous.',
 'Soutenir l''expérimentation d''une Sécurité Sociale de l''Alimentation (SSA) pour garantir un revenu décent aux paysans et l''accès à une alimentation saine pour tous les foyers.',
 NULL),

('a11', '00000000-0000-0000-0000-000000000003', 'A11. Maison de l''Alimentation',
 'Un tiers-lieu de partage et de vente.',
 'Créer un lieu ressource ouvert à tous : vente de produits locaux, distribution solidaire, éducation populaire et espace pour les associations.',
 NULL),

('a12', '00000000-0000-0000-0000-000000000003', 'A12. Programme Pédagogique',
 'Éduquer au goût et au zéro-déchet.',
 'Lancer un programme municipal de sensibilisation (écoles, affichage) sur l''alimentation durable, la lutte contre le gaspillage et la valorisation des déchets organiques.',
 NULL),

('a13', '00000000-0000-0000-0000-000000000003', 'A13. Marché Paysan Festif',
 'Un rendez-vous hebdomadaire convivial.',
 'Créer un marché (nocturne ou week-end) avec producteurs locaux sous charte stricte, food-trucks et animations culturelles pour recréer du lien social.',
 NULL),

-- Thème 5 : Restauration Collective (Cantines)
('a14', '00000000-0000-0000-0000-000000000003', 'A14. Audit Participatif Cantines',
 'Évaluer la satisfaction et améliorer.',
 'Lancer une enquête ''multi-acteurs'' pilotée par la mairie pour diagnostiquer la restauration collective et établir un cahier des charges plus ambitieux que la loi EGalim.',
 NULL),

('a15', '00000000-0000-0000-0000-000000000003', 'A15. Contrats Producteurs Locaux',
 'Sécuriser les débouchés de nos agriculteurs.',
 'Développer des contrats directs entre la commune et les producteurs locaux pour fournir les cantines, afin de soutenir l''économie du territoire.',
 NULL),

('a16', '00000000-0000-0000-0000-000000000003', 'A16. Plus de menus végétariens',
 'Santé et écologie dans l''assiette.',
 'Favoriser la cuisine végétale : respecter a minima l''obligation hebdomadaire et instaurer une alternative végétarienne quotidienne (choix) pour tous.',
 NULL),

('a17', '00000000-0000-0000-0000-000000000003', 'A17. Formation Cuisine Durable',
 'Valoriser le savoir-faire des agents.',
 'Mettre en œuvre un programme de formation obligatoire pour le personnel des cantines (cuisine végétale, produits frais) via des conventions mutualisées.',
 NULL),

('a18', '00000000-0000-0000-0000-000000000003', 'A18. Stop Ultra-transformé',
 'Priorité au fait-maison et produits bruts.',
 'Éliminer progressivement les produits industriels ultra-transformés (additifs, texturants) des menus au profit de produits bruts, frais et de saison.',
 NULL),

('a19', '00000000-0000-0000-0000-000000000003', 'A19. Stop Plastique (Cantines)',
 'Protéger la santé des enfants.',
 'Supprimer définitivement les contenants et ustensiles à usage unique et en plastique pour éviter la migration de perturbateurs endocriniens.',
 NULL),

('a20', '00000000-0000-0000-0000-000000000003', 'A20. Portions sur-mesure',
 'Réduire le gâchis dans les assiettes.',
 'Mettre en place un système de portions adaptées à l''appétit réel des enfants et des séniors pour lutter efficacement contre le gaspillage alimentaire.',
 NULL),

('a21', '00000000-0000-0000-0000-000000000003', 'A21. Compostage Systématique',
 'Valoriser les restes en engrais local.',
 'Organiser la collecte et le compostage des déchets organiques de la restauration collective pour amender les terres agricoles locales.',
 NULL),

('a22', '00000000-0000-0000-0000-000000000003', 'A22. Projet Alimentaire Territorial',
 'Collaborer avec la Métropole.',
 'Travailler en synergie avec la métropole TPM pour appliquer concrètement les actions du Projet Alimentaire Territorial (PAT) sur la commune de Hyères.',
 NULL)

ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  content_text = EXCLUDED.content_text,
  external_link = EXCLUDED.external_link,
  updated_at = NOW();

-- Verify the insertion
SELECT COUNT(*) as total_proposals FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000003';
SELECT id, title FROM proposals WHERE category_id = '00000000-0000-0000-0000-000000000003' ORDER BY id;

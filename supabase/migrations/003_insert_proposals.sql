-- Migration: Insert all proposals from lib/data.ts into Supabase
-- Created: 2024
-- Description: Inserts all 21 proposals (5 Habitat, 15 Mobilités, 1 Agriculture) into the proposals table

-- Category UUID mapping:
-- habitat -> '00000000-0000-0000-0000-000000000001'
-- mobilites -> '00000000-0000-0000-0000-000000000002'
-- agriculture -> '00000000-0000-0000-0000-000000000003'

-- Insert all proposals
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

-- Verify the insertion
SELECT COUNT(*) as total_proposals FROM proposals;
SELECT category_id, COUNT(*) as count FROM proposals GROUP BY category_id;

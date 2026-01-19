-- Migration: Reset votes and update proposals with final validated content
-- Created: 2024
-- Description: Clean reset of votes and update all proposals with final validated texts

-- Step 1: Delete all votes (clean reset)
DELETE FROM votes;

-- Step 2: Reset vote_count for all proposals
UPDATE proposals SET vote_count = 0;

-- Step 3: Update all proposals with new titles and content
-- Category UUID mapping:
-- habitat -> '00000000-0000-0000-0000-000000000001'
-- mobilites -> '00000000-0000-0000-0000-000000000002'
-- agriculture -> '00000000-0000-0000-0000-000000000003'

-- Update HABITAT proposals (H1-H20)
UPDATE proposals SET 
  title = 'H1. Diminuer la constructibilité',
  description = 'Réduire les zones U et limiter les résidences secondaires.',
  content_text = 'Réduire les zones constructibles (Zones U) et appliquer la loi Le Meur pour interdire toute construction supplémentaire de résidences secondaires.',
  updated_at = NOW()
WHERE id = 'h1' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H2. Maîtriser les densités',
  description = 'Stopper l''étalement urbain et l''habitat diffus.',
  content_text = 'Encadrer strictement l''habitat diffus et les lotissements périphériques. Rendre obligatoire une notice urbanistique opposable valorisant la mixité, les jardins et les espaces communs.',
  updated_at = NOW()
WHERE id = 'h2' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H3. Préserver les espaces agricoles',
  description = 'Protéger les Rougières et appliquer la Loi Climat.',
  content_text = 'Créer des zones agricoles protégées (ZAP), appliquer l''objectif de réduction de consommation d''espaces (Loi Climat) et redonner une vocation agricole à la zone des Rougières.',
  updated_at = NOW()
WHERE id = 'h3' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H4. Préserver le patrimoine bâti',
  description = 'Protéger le petit patrimoine avec les habitants.',
  content_text = 'Inventorier le ''petit patrimoine'' non classé avec l''aide des citoyens et travailler avec l''Architecte des Bâtiments de France pour imposer des règles de protection cohérentes aux promoteurs.',
  updated_at = NOW()
WHERE id = 'h4' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H5. Appliquer la Loi Littoral',
  description = 'Limiter strictement les extensions en bord de mer.',
  content_text = 'Zéro dérogation : limiter drastiquement les nouvelles constructions et les extensions en bord de mer pour préserver la valeur paysagère et la biodiversité.',
  updated_at = NOW()
WHERE id = 'h5' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H6. Sauvegarder les espaces sensibles',
  description = 'Protection absolue (MGEN, Gapeau, La Badine).',
  content_text = 'Ces sites emblématiques (MGEN, Gapeau, La Badine) doivent être totalement préservés. Nous tendrons vers des densités plus faibles et des zones inconstructibles.',
  updated_at = NOW()
WHERE id = 'h6' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H7. Limiter le trafic vers la presqu''île',
  description = 'Désengorger la Tour Fondue et Giens.',
  content_text = 'Déplacer les flux de l''embarcadère de la Tour Fondue vers le port d''Hyères en affrétant plus de navettes au départ du port et envisager à terme la fermeture de la route du Sel à la circulation automobile.',
  updated_at = NOW()
WHERE id = 'h7' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H8. Zéro construction en zone à risque',
  description = 'Interdiction totale, même en surélevant.',
  content_text = 'Délimiter des zones rouges strictes où toute nouvelle construction est interdite (même surélevée) face à l''aggravation des risques d''inondation.',
  updated_at = NOW()
WHERE id = 'h8' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H9. Révision du PPRI',
  description = 'Une priorité absolue du mandat.',
  content_text = 'Mettre à jour en priorité le Plan de Prévention des Risques d''Inondation (PPRI) pour tenir compte de l''imperméabilisation des sols et des épisodes pluvieux intenses.',
  updated_at = NOW()
WHERE id = 'h9' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H10. Anticiper le trait de côte',
  description = 'Définir des zones d''études prospectives.',
  content_text = 'Identifier clairement dans le PLU les zones menacées par la montée des eaux et le recul du trait de côte pour geler les projets à risque.',
  updated_at = NOW()
WHERE id = 'h10' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H11. Projets pilotes de relocalisation',
  description = 'Une logique de solidarité face aux risques.',
  content_text = 'Lancer des projets pilotes d''adaptation ou de relocalisation pour les habitants menacés par les risques littoraux, dans une logique solidaire et responsable.',
  updated_at = NOW()
WHERE id = 'h11' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H12. Réduire les îlots de chaleur',
  description = 'Végétalisation massive (50-150€/m²).',
  content_text = 'Remplacer les matériaux urbains inadaptés et créer des îlots de fraîcheur sur l''espace public par une végétalisation massive.',
  updated_at = NOW()
WHERE id = 'h12' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H13. Rénover les bâtiments publics',
  description = 'Isolation et ''Free Cooling''.',
  content_text = 'Investir (200 à 500€/m²) pour adapter les écoles et bâtiments publics aux fortes chaleurs : isolation renforcée, protections solaires et surventilation nocturne.',
  updated_at = NOW()
WHERE id = 'h13' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H14. Taxe Logements Vacants (TLV)',
  description = 'Mobiliser les 2600 logements vides.',
  content_text = 'Appliquer la Taxe sur les Logements Vacants (TLV) (17% la 1ère année, puis 34%) pour inciter à la mise en location. Les recettes seront reversées à l''ANAH pour financer la rénovation.',
  updated_at = NOW()
WHERE id = 'h14' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H15. Opération Réhabilitation',
  description = 'Aider les propriétaires (MaPrimeRénov).',
  content_text = 'Lancer une campagne massive pour remettre les logements vacants sur le marché via les dispositifs MaPrimeRénov et LocAvantages (Coût pour la ville : 0€).',
  updated_at = NOW()
WHERE id = 'h15' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H16. Réinvestir les amendes SRU',
  description = 'Acheter dans le centre-ville.',
  content_text = 'Utiliser les 318 000€ d''amendes annuelles (loi SRU) pour préempter et rénover des immeubles anciens du centre-ville au lieu de payer des pénalités à l''État.',
  updated_at = NOW()
WHERE id = 'h16' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H17. Hausse Taxe Résidences Secondaires',
  description = 'Passer de 12% à 20% (Zone Tendue).',
  content_text = 'Passer la taxe d''habitation sur les résidences secondaires de 12,02% à 20% pour générer 1,5M€ de recettes supplémentaires par an dédiées au logement abordable.',
  updated_at = NOW()
WHERE id = 'h17' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H18. Coopérative Foncière (BRS)',
  description = 'Logements abordables à vie.',
  content_text = 'Créer un Organisme Foncier Solidaire (OFS) : la collectivité garde le terrain, l''habitant achète les murs avec une décote de 30% à 50% (Bail Réel Solidaire).',
  updated_at = NOW()
WHERE id = 'h18' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H19. Renouvellement Val des Rougières',
  description = 'Plan ANRU sur 15 ans.',
  content_text = 'Engager un plan type ANRU pour requalifier totalement le quartier du Val des Rougières et améliorer la qualité de vie (Investissement estimé : 24€/habitant/an pendant 15 ans).',
  updated_at = NOW()
WHERE id = 'h19' AND category_id = '00000000-0000-0000-0000-000000000001';

UPDATE proposals SET 
  title = 'H20. Hébergement Saisonniers & Jeunes',
  description = 'Auberges de jeunesse et Tiers-lieux.',
  content_text = 'Soutenir le développement de solutions d''hébergement dignes et hybrides (auberges adossées à des tiers-lieux) pour les travailleurs saisonniers et les jeunes.',
  updated_at = NOW()
WHERE id = 'h20' AND category_id = '00000000-0000-0000-0000-000000000001';

-- Update MOBILITÉS proposals (M1-M15)
UPDATE proposals SET 
  title = 'M1. Créer un poste de Responsable Vélo',
  description = 'Un pilotage réactif dédié à la mairie et à la métropole.',
  content_text = 'Recrutement d''un chargé de mission pour coordonner infrastructures et communication. Création de synergies avec la métropole TPM pour fluidifier les projets.',
  updated_at = NOW()
WHERE id = 'm1' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M2. Partager les compétences',
  description = 'Essaimer la ''Culture Vélo'' dans les services.',
  content_text = 'Former un référent à chaque échelon administratif et former 5% de la Police Municipale (6 agents) à la mobilité cycliste (Brevet FUB) pour assurer une sécurité de proximité.',
  updated_at = NOW()
WHERE id = 'm2' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M3. Raccourcir les circuits de décision',
  description = 'Créer un Comité de Pilotage participatif (COPIL).',
  content_text = 'Associer les usagers et associations à chaque étape pour des aménagements utiles. Publier un bilan de performance public deux fois par an.',
  updated_at = NOW()
WHERE id = 'm3' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M4. Location de vélos au Pôle Gare',
  description = 'Transformer 5 places de parking en espace de location.',
  content_text = 'Création d''un espace de 100m² au cœur du pôle multimodal en partenariat avec des loueurs privés, sans subvention publique nécessaire.',
  updated_at = NOW()
WHERE id = 'm4' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M5. Label ''Employeur Pro-Vélo''',
  description = 'Faire de la Mairie un employeur pro-vélo exemplaire (Niveau Or).',
  content_text = 'Engagement immédiat de la municipalité dans la démarche pour faire de la collectivité un modèle de mobilité durable pour ses propres agents.',
  updated_at = NOW()
WHERE id = 'm5' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M6. Promotion dynamique',
  description = 'Communication et événements (Fête du vélo).',
  content_text = 'Intégrer les mobilités actives dans toutes les communications municipales et organiser des événements réguliers ambitieux.',
  updated_at = NOW()
WHERE id = 'm6' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M7. Priorité à nos enfants (13 écoles)',
  description = 'Réduire drastiquement le transit devant les écoles.',
  content_text = 'Transformation en zones de rencontre ou mise en sens unique devant les 13 écoles identifiées pour libérer de l''espace de vie et sécuriser les entrées/sorties.',
  updated_at = NOW()
WHERE id = 'm7' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M8. Le Double Sens Cyclable',
  description = 'Généralisation conformément à la loi sur les voies sens uniques à 30km/h.',
  content_text = 'Maillage du centre-ville avec signalisation systématique des doubles sens (interventions légères : marquage/panneaux) pour éviter les détours inutiles aux cyclistes.',
  updated_at = NOW()
WHERE id = 'm8' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M9. Extension du Cœur de Ville',
  description = 'Zones piétonnes et zones de rencontre.',
  content_text = 'Redonner de l''espace à la vie et au commerce de proximité tout en maintenant une accessibilité pour les résidents et livraisons.',
  updated_at = NOW()
WHERE id = 'm9' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M10. Visibilité aux passages piétons',
  description = 'Suppression du stationnement 5m en amont (Loi LOM).',
  content_text = 'Mise en conformité légale : neutralisation du stationnement masquant la visibilité piétonne, remplacé par des arceaux vélos ou de la végétalisation.',
  updated_at = NOW()
WHERE id = 'm10' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M11. Cohabitation pacifiée',
  description = 'Sensibilisation et pédagogie.',
  content_text = 'Actions pour expliquer les nouveaux aménagements (sas vélo, voie verte, etc.) et inciter à la vigilance envers les usagers vulnérables.',
  updated_at = NOW()
WHERE id = 'm11' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M12. Maillage Territorial 2032',
  description = 'Relier les 9 mairies annexes et le centre.',
  content_text = 'Créer des itinéraires sécurisés et directs. Déployer des aménagements de transition dès le début du mandat sur les carrefours critiques pour un bénéfice immédiat.',
  updated_at = NOW()
WHERE id = 'm12' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M13. Activer le ''Réflexe Vélo''',
  description = 'Signalétique unifiée et jalonnement.',
  content_text = 'Déployer un jalonnement systématique vers les points d''intérêt (indiquant le temps de trajet vélo) et une signalisation incitant les voitures à la prudence.',
  updated_at = NOW()
WHERE id = 'm13' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M14. Combattre l''enclavement',
  description = 'Servitudes de passage et Loi LAURE.',
  content_text = 'Préempter des passages clés pour éviter les détours. Appliquer la Loi LAURE : chaque rénovation de voirie doit obligatoirement intégrer un aménagement cyclable.',
  updated_at = NOW()
WHERE id = 'm14' AND category_id = '00000000-0000-0000-0000-000000000002';

UPDATE proposals SET 
  title = 'M15. Intelligence Collective',
  description = 'Co-construction avec les associations.',
  content_text = 'Mobiliser l''expertise gratuite des usagers locaux pour dessiner les tracés les plus efficaces et optimiser l''utilisation des deniers publics.',
  updated_at = NOW()
WHERE id = 'm15' AND category_id = '00000000-0000-0000-0000-000000000002';

-- Update AGRICULTURE proposal (A1)
UPDATE proposals SET 
  title = 'A1. Consultation : Terres Agricoles',
  description = 'Ce volet est en cours de construction.',
  content_text = 'La préservation de la plaine agricole et l''alimentation locale sont des enjeux majeurs. Nous finalisons nos propositions. Vous avez une idée ou une expertise ? Écrivez-nous pour participer.',
  external_link = 'mailto:contact@changerdere.org',
  updated_at = NOW()
WHERE id = 'a1' AND category_id = '00000000-0000-0000-0000-000000000003';

-- Verify the updates
SELECT 
  category_id,
  COUNT(*) as count,
  STRING_AGG(id, ', ' ORDER BY id) as proposal_ids
FROM proposals
GROUP BY category_id
ORDER BY category_id;

SELECT COUNT(*) as total_votes FROM votes;

import Link from 'next/link';

export const metadata = {
  title: 'Mentions Légales - Hyères 2026',
  description: "Conditions Générales d'Utilisation et Mentions Légales.",
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium mb-8 transition-colors">
          ← Retour à l'accueil
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Conditions Générales d'Utilisation (CGU)</h1>

        <div className="space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">1. Mentions Légales</h2>
            <p className="mb-2">Le présent site est édité par l'association <strong>Changer d'Ère</strong>, association régie par la loi du 1er juillet 1901, déclarée en préfecture du Var.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Siège social :</strong> 10 Rue de la Tour, 83400 Hyères.</li>
              <li><strong>Responsable de la publication :</strong> Le Président de l'association, Benoît Guérin.</li>
              <li><strong>Hébergeur :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">2. Objet du site</h2>
            <p>Le site a pour vocation d'informer les citoyens dans le cadre des élections municipales. Il présente un ensemble de propositions rédigées par diverses associations partenaires afin d'éclairer le débat public et d'encourager la participation électorale.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">3. Responsabilité quant aux contenus</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Propriété des propositions :</strong> Les propositions publiées sur le site sont le fruit du travail collectif de plusieurs associations. Bien que l'association Changer d'Ère assure la publication technique du site, les idées et revendications exprimées restent sous la responsabilité intellectuelle de leurs auteurs respectifs.</li>
              <li><strong>Exactitude des informations :</strong> L'association s'efforce de diffuser des informations précises, mais ne saurait être tenue pour responsable d'éventuelles erreurs, omissions ou d'une mauvaise interprétation des textes présentés.</li>
              <li><strong>Absence de caractère officiel :</strong> Ce site n'est pas un site gouvernemental. Il s'agit d'une initiative associative citoyenne indépendante de toute administration publique.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">4. Propriété intellectuelle</h2>
            <p>L'ensemble des contenus (textes, logos, graphismes) présents sur le site est protégé par le droit d'auteur. Toute reproduction ou diffusion, totale ou partielle, à des fins commerciales est interdite sans l'accord préalable de l'association Changer d'Ere. Une utilisation à des fins d'information citoyenne est autorisée sous réserve de citer la source.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">5. Protection des données personnelles (RGPD)</h2>
            <p className="mb-2">L'association Changer d'Ere s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD).</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Les données collectées ne sont jamais transmises à des tiers sans votre consentement.</li>
              <li>Conformément à la loi « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à : <a href="mailto:changerdere83@gmail.com" className="text-teal-600 hover:underline">changerdere83@gmail.com</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">6. Liens Hypertextes</h2>
            <p>Le site peut contenir des liens vers d'autres sites web (sites de candidats, autres associations, presse). L'association Changer d'Ere n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques de confidentialité.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-teal-700 mb-3">7. Droit applicable</h2>
            <p>Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de solution amiable, les tribunaux compétents seront ceux du ressort de la préfecture du Var.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

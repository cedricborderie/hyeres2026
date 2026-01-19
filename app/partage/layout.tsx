import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Découvrez mes priorités pour Hyères 2026 | Plateforme Citoyenne",
  description: "Un citoyen a partagé ses priorités pour l'avenir d'Hyères. Découvrez les propositions qu'il soutient et faites entendre votre voix à votre tour !",
  openGraph: {
    title: "Découvrez mes priorités pour Hyères 2026",
    description: "Un citoyen a partagé ses priorités pour l'avenir d'Hyères. Découvrez les propositions qu'il soutient et faites entendre votre voix à votre tour !",
    url: "https://hyeres2026.org/partage",
    siteName: "Plateforme Citoyenne Hyèroise",
  },
  twitter: {
    card: "summary_large_image",
    title: "Découvrez mes priorités pour Hyères 2026",
    description: "Un citoyen a partagé ses priorités pour l'avenir d'Hyères.",
  },
};

export default function PartageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

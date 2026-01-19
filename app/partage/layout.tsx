import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Découvrez mes priorités pour Hyères 2026 | Plateforme Citoyenne",
  description: "Voici mes priorités pour l'avenir d'Hyères. Découvrez les propositions de la plate-forme citoyenne que je soutiens et faites entendre votre voix à votre tour !",
  openGraph: {
    title: "Découvrez mes priorités pour Hyères 2026",
    description: "Voici mes priorités pour l'avenir d'Hyères. Découvrez les propositions de la plate-forme citoyenne que je soutiens et faites entendre votre voix à votre tour !",
    url: "https://hyeres2026.org/partage",
    siteName: "Plateforme Citoyenne Hyèroise",
    images: [
      {
        url: "https://hyeres2026.org/partage/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Plateforme Citoyenne Hyèroise - Mes priorités",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Découvrez mes priorités pour Hyères 2026",
    description: "Voici mes priorités pour l'avenir d'Hyères. Découvrez les propositions de la plate-forme citoyenne que je soutiens.",
    images: ["https://hyeres2026.org/partage/opengraph-image.png"],
  },
};

export default function PartageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

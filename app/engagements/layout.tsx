import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hyeres2026.org";

export const metadata: Metadata = {
  title: "Évaluation des engagements des candidats | Plateforme Citoyenne",
  description:
    "Découvrez le classement des listes candidates selon leur alignement avec nos recommandations par thématique : Habitat & Urbanisme, Mobilités, Agriculture & Alimentation.",
  openGraph: {
    title: "Podium de l'engagement — Habitat & Urbanisme | Plateforme Citoyenne",
    description:
      "Découvrez le classement des candidats sur l'urbanisme et l'habitat à Hyères.",
    url: `${baseUrl}/engagements`,
    siteName: "Plateforme Citoyenne Hyèroise",
    images: [
      {
        url: `${baseUrl}/og-engagements-habitat.png`,
        width: 1200,
        height: 630,
        alt: "Podium de l'engagement — Habitat & Urbanisme",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podium de l'engagement — Habitat & Urbanisme",
    description: "Découvrez le classement des candidats sur l'urbanisme et l'habitat à Hyères.",
    images: [`${baseUrl}/og-engagements-habitat.png`],
  },
};

export default function EngagementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

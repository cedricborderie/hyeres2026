import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EngagementsContent from "../EngagementsContent";

const themeIds = ["habitat", "mobilites", "agriculture"] as const;
type ThemeId = (typeof themeIds)[number];

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hyeres2026.org";

const themeMeta: Record<
  ThemeId,
  { title: string; description: string; image: string; alt: string }
> = {
  habitat: {
    title: "Habitat & Urbanisme",
    description:
      "Découvrez le classement des candidats sur l'urbanisme et l'habitat à Hyères.",
    image: "/og-engagements-habitat.png",
    alt: "Podium de l'engagement — Habitat & Urbanisme",
  },
  mobilites: {
    title: "Mobilités & Vélo",
    description:
      "Découvrez le classement des candidats sur les mobilités douces et le vélo à Hyères.",
    image: "/og-engagements-mobilites.png",
    alt: "Podium de l'engagement — Mobilités & Vélo",
  },
  agriculture: {
    title: "Agriculture & Alimentation",
    description:
      "Découvrez le classement des candidats sur l'agriculture et l'alimentation à Hyères.",
    image: "/og-engagements-agriculture.png",
    alt: "Podium de l'engagement — Agriculture & Alimentation",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme } = await params;
  const themeId = themeIds.includes(theme as ThemeId) ? (theme as ThemeId) : null;
  if (!themeId) {
    return { title: "Engagements | Plateforme Citoyenne" };
  }
  const meta = themeMeta[themeId];
  const url = `${baseUrl}${meta.image}`;
  return {
    title: `Podium de l'engagement — ${meta.title} | Plateforme Citoyenne`,
    description: meta.description,
    openGraph: {
      title: `Podium de l'engagement — ${meta.title}`,
      description: meta.description,
      url: `${baseUrl}/engagements/${themeId}`,
      siteName: "Plateforme Citoyenne Hyèroise",
      images: [
        { url, width: 1200, height: 630, alt: meta.alt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Podium de l'engagement — ${meta.title}`,
      description: meta.description,
      images: [url],
    },
  };
}

export default async function EngagementsThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const themeId = themeIds.includes(theme as ThemeId) ? (theme as ThemeId) : null;
  if (!themeId) notFound();
  return <EngagementsContent initialTheme={themeId} />;
}

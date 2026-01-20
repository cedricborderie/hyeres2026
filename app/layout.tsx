import type { Metadata, Viewport } from "next";
import { Questrial } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VoteGatekeeper from "@/components/VoteGatekeeper";

const questrial = Questrial({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-questrial',
});

export const metadata: Metadata = {
  title: "Plateforme Citoyenne Hyèroise",
  description: "Participez aux élections locales d'Hyères en votant pour les propositions qui vous concernent",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="overflow-x-hidden">
      <body className={`${questrial.className} flex flex-col min-h-screen overflow-x-hidden max-w-full`}>
        <VoteGatekeeper>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </VoteGatekeeper>
      </body>
    </html>
  );
}

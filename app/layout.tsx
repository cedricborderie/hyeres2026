import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
    <html lang="fr" className={`${questrial.variable} overflow-x-hidden`}>
      <body className={`${questrial.className} flex flex-col min-h-screen overflow-x-hidden max-w-full`}>
        <VoteGatekeeper>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </VoteGatekeeper>
        {/* Plausible Analytics – statistiques respectueuses de la vie privée */}
        <Script
          src="https://plausible.io/js/pa-ZfKvTU8hH79U4TrmVchcq.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}
        </Script>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

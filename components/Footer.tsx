"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { Mail, Facebook, MessageCircle, CheckCircle2, Linkedin, Newspaper, Megaphone } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [shareUrl, setShareUrl] = useState("https://hyeres2026.org");

  useEffect(() => {
    // Use window.location.origin in browser, fallback to production URL
    if (typeof window !== "undefined") {
      setShareUrl(window.location.origin);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setEmail("");
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const shareMessage = `Découvrez la Plateforme Citoyenne Hyèroise et votez pour les propositions qui vous concernent ! 🗳️\n\n${shareUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Logos Section - Full Width */}
        <div className="mb-12">
          <p className="font-medium text-gray-700 text-center mb-8" style={{ fontSize: '21px' }}>
            À l'initiative d'associations Hyèroises indépendantes
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 items-center justify-items-center">
            <a
              href="https://www.changerdere.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[200px] aspect-square hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logos/changer-d-ere.png"
                alt="Changer d'Ère"
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://www.facebook.com/ecolieuduplandupont"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[200px] aspect-square hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logos/ecolieu-plan-du-pont.png"
                alt="Écolieu du Plan du Pont"
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://maltae.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[200px] aspect-square hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logos/maltae.png"
                alt="Maltae - Paysages de l'entre terre & mer"
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </a>
            <a
              href="https://www.cildesrougieres.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[200px] aspect-square hover:opacity-80 transition-opacity"
            >
              <Image
                src="/logos/cil-des-rougieres.png"
                alt="CIL des Rougières"
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </a>
            <div className="w-full max-w-[200px] aspect-square">
              <Image
                src="/logos/mobilites-presquile-giens.png"
                alt="Mobilités Presqu'île de Giens"
                width={200}
                height={200}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Newsletter and Share Section - Two Columns */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Newsletter
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Inscrivez-vous à la newsletter pour être informé des résultats
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPending ? (
                    "Envoi..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      S'inscrire
                    </>
                  )}
                </button>
              </div>
              {message && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    message.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4">⚠</span>
                  )}
                  <span>{message.text}</span>
                </div>
              )}
            </form>
            
            {/* Contactez-nous Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contactez-nous
              </h3>
              <p className="text-gray-600 text-sm">
                Une idée, une remarque, écrivez-nous à{" "}
                <a 
                  href="mailto:contact@hyeres2026.org" 
                  className="underline hover:text-primary-600"
                >
                  contact@hyeres2026.org
                </a>
              </p>
            </div>
          </div>

          {/* Share Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Partage
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Aidez-nous à faire connaître la plate-forme
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Partager sur WhatsApp
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                Partager sur Facebook
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                Partager sur LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

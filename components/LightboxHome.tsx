"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function LightboxHome() {
  const [visible, setVisible] = useState(true);

  const close = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="lb-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lb-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-gray-900/55 z-[9999] flex items-center justify-center p-6"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border-2 border-gray-200 max-w-[460px] w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-7 pt-8 pb-6">
              <button
                type="button"
                onClick={close}
                className="absolute top-3.5 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 text-lg leading-none"
                aria-label="Fermer"
              >
                ✕
              </button>

              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2.5">
                Municipales Hyères 2026
              </p>
              <h2 id="lb-title" className="text-xl text-gray-900 leading-snug pr-6 mb-3">
                Découvrez l&apos;évaluation de l&apos;engagement
                <br />
                des <span className="text-[#008179]">candidats</span>.
              </h2>
              <p className="text-[13.5px] text-gray-500 leading-relaxed mb-5">
                Nous avons évalué chaque liste sur 55 mesures concrètes réparties en 3 thématiques. Les podiums vous attendent.
              </p>

              <div className="flex flex-col gap-2 mb-6">
                {/* Urbanisme et Habitat → /engagements/habitat */}
                <div className="flex items-center gap-3 py-2.5 px-3.5 pl-3.5 rounded-xl border-[1.5px] bg-teal-50/80 border-teal-200">
                  <div className="w-[22px] h-[22px] shrink-0 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="3" width="7" height="18" rx="1" />
                      <rect x="14" y="8" width="7" height="13" rx="1" />
                      <line x1="3" y1="21" x2="21" y2="21" />
                      <line x1="6" y1="7" x2="7" y2="7" />
                      <line x1="6" y1="11" x2="7" y2="11" />
                      <line x1="6" y1="15" x2="7" y2="15" />
                      <line x1="17" y1="12" x2="18" y2="12" />
                      <line x1="17" y1="16" x2="18" y2="16" />
                    </svg>
                  </div>
                  <span className="text-[13.5px] text-gray-800 flex-1">Urbanisme et Habitat</span>
                  <Link
                    href="/engagements/habitat"
                    className="text-[11.5px] font-medium rounded-md py-1.5 px-2.5 bg-teal-100 text-teal-800 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
                  >
                    Voir le Podium
                  </Link>
                </div>

                {/* Vélo et Mobilités → /engagements/mobilites */}
                <div className="flex items-center gap-3 py-2.5 px-3.5 pl-3.5 rounded-xl border-[1.5px] bg-pink-50/80 border-pink-200">
                  <div className="w-[22px] h-[22px] shrink-0 flex items-center justify-center">
                    <svg width="22" height="16" viewBox="0 0 28 18" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="5" cy="13" r="4" />
                      <circle cx="23" cy="13" r="4" />
                      <polyline points="9,13 11,6 17,6" />
                      <polyline points="11,6 14,13 19,9" />
                      <circle cx="17" cy="4" r="1.5" fill="#EC4899" stroke="none" />
                    </svg>
                  </div>
                  <span className="text-[13.5px] text-gray-800 flex-1">Vélo et Mobilités</span>
                  <Link
                    href="/engagements/mobilites"
                    className="text-[11.5px] font-medium rounded-md py-1.5 px-2.5 bg-pink-100 text-pink-800 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
                  >
                    Voir le Podium
                  </Link>
                </div>

                {/* Agriculture & Alimentation → /engagements/agriculture */}
                <div className="flex items-center gap-3 py-2.5 px-3.5 pl-3.5 rounded-xl border-[1.5px] bg-amber-50/80 border-amber-200">
                  <div className="w-[22px] h-[22px] shrink-0 flex items-center justify-center">
                    <svg width="18" height="20" viewBox="0 0 20 24" fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="10" y1="23" x2="10" y2="10" />
                      <path d="M10 18 C10 18 4 16 4 9 C4 9 9 8 12 12" />
                      <path d="M10 14 C10 14 15 11 16 5 C16 5 11 4 8 9" />
                    </svg>
                  </div>
                  <span className="text-[13.5px] text-gray-800 flex-1">Agriculture & Alimentation</span>
                  <Link
                    href="/engagements/agriculture"
                    className="text-[11.5px] font-medium rounded-md py-1.5 px-2.5 bg-amber-100 text-amber-900 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
                  >
                    Voir le Podium
                  </Link>
                </div>
              </div>

              <hr className="border-t border-gray-100 my-5" />

              <Link
                href="/engagements/habitat"
                className="block w-full bg-[#008179] hover:bg-[#006d66] text-white text-center rounded-xl py-3 px-5 text-sm font-medium transition-colors mb-2"
              >
                Découvrir tous les résultats
              </Link>
              <button
                type="button"
                onClick={close}
                className="block w-full bg-transparent border-none text-[12.5px] text-gray-400 hover:text-gray-600 py-2 transition-colors"
              >
                Continuer sans voir les résultats
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

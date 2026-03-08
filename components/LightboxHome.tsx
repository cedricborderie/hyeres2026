"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Bike, Sprout } from "lucide-react";
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
                  <Building2 className="w-5 h-5 shrink-0" style={{ color: "#14B8A6" }} aria-hidden />
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
                  <Bike className="w-5 h-5 shrink-0" style={{ color: "#EC4899" }} aria-hidden />
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
                  <Sprout className="w-5 h-5 shrink-0" style={{ color: "#C4A035" }} aria-hidden />
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

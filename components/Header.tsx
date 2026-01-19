"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 relative">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Plateforme Citoyenne Hyèroise"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">
              Plateforme Citoyenne Hyèroise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {!isHome && (
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Accueil
              </Link>
            )}
            <Link
              href="/propositions"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/propositions"
                  ? "bg-primary-600 text-white"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              Propositions
            </Link>
            <Link
              href="/resultats"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/resultats"
                  ? "bg-primary-600 text-white"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              Résultats
            </Link>
            <Link
              href="/bilan"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === "/bilan"
                  ? "bg-primary-600 text-white"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              Mes Priorités
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-2">
              {!isHome && (
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Accueil
                </Link>
              )}
              <Link
                href="/propositions"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === "/propositions"
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                Propositions
              </Link>
              <Link
                href="/resultats"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === "/resultats"
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                Résultats
              </Link>
              <Link
                href="/bilan"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === "/bilan"
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                Mes Priorités
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

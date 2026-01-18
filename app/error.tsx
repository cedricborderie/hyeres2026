"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Une erreur s'est produite
        </h2>
        <p className="text-gray-600 mb-6">{error.message || "Une erreur inattendue s'est produite"}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

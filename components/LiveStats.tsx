"use client";

import { useEffect, useState } from "react";
import { getAllVoteResults } from "@/app/actions/results";

export default function LiveStats() {
  const [voterCount, setVoterCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real voter count from Supabase
    const updateVoterCount = async () => {
      try {
        const results = await getAllVoteResults();
        setVoterCount(results.totalVoters);
      } catch (error) {
        console.error("Error fetching voter count:", error);
      } finally {
        setLoading(false);
      }
    };

    updateVoterCount();
    // Update every 5 seconds to keep stats fresh
    const interval = setInterval(updateVoterCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg py-[13px] px-4 text-center w-full">
      <p className="text-base font-medium text-gray-700 align-middle">
        {loading ? (
          <span className="text-gray-500">Chargement...</span>
        ) : (
          <>
            <span className="font-bold text-primary-700">{voterCount}</span>{" "}
            {voterCount <= 1 ? "votant" : "votants"} jusqu'à présent
          </>
        )}
      </p>
    </div>
  );
}

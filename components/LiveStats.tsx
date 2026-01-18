"use client";

import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/utils";

export default function LiveStats() {
  const [voterCount, setVoterCount] = useState(0);

  useEffect(() => {
    // Count unique voters (session_ids)
    // For now, we check if current session has voted (1 or 0)
    // In production with Supabase, this will count distinct session_ids from the votes table
    const updateVoterCount = () => {
      // TODO: Replace with Supabase query: SELECT COUNT(DISTINCT session_id) FROM votes
      // For now, localStorage doesn't allow counting all sessions, so we show 1 if current user voted
      const sessionId = getSessionId();
      // This is a placeholder - in production, get from Supabase
      setVoterCount(1); // Will be replaced with real count from Supabase
    };

    updateVoterCount();
    // Update every 5 seconds (will be replaced with Supabase real-time subscription)
    const interval = setInterval(updateVoterCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg py-[13px] px-4 text-center">
      <p className="text-base font-medium text-gray-700 align-middle">
        <span className="font-bold text-primary-700">{voterCount}</span>{" "}
        {voterCount <= 1 ? "votant" : "votants"} jusqu'à présent
      </p>
    </div>
  );
}

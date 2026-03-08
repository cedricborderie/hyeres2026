"use client";

import type { PodiumCandidate, PodiumPoint } from "@/lib/engagement-data";

const RING_R = 28;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

const STEP_PX = 40; // Écart entre le haut du bloc 1er et 2e, et entre 2e et 3e.

const rankStyles = {
  1: {
    label: "1er",
    badge: "bg-green-50 text-green-800 border-green-200",
    pillar: "bg-green-50 border-green-200 min-h-[424px]",
    /** Espace au-dessus du ring pour aligner les % (1er le plus haut → plus d'espace). */
    spaceAboveRingPx: 120,
    ringBg: "#e2e8f0",
    ringFg: "#4ade80",
  },
  2: {
    label: "2ème",
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    pillar: "bg-slate-50 border-slate-200 min-h-[384px]",
    spaceAboveRingPx: 80,
    ringBg: "#e2e8f0",
    ringFg: "#94a3b8",
  },
  3: {
    label: "3ème",
    badge: "bg-slate-100 text-slate-600 border-slate-300",
    pillar: "bg-slate-100 border-slate-300 min-h-[344px]",
    spaceAboveRingPx: 40,
    ringBg: "#cbd5e1",
    ringFg: "#64748b",
  },
} as const;

const PADDING_BOTTOM_PX = 40;

/** Espace au-dessus des propositions : 32px pour tous → pourcentages et propositions alignés. La hauteur de l’encadré vient du min-height du pilier (1er > 2e > 3e) et du vide en bas. */

type PodiumCardProps = {
  candidate: PodiumCandidate;
  /** Couleur d'accent pour le souligné des points (hex) */
  accentColor: string;
  /** Ordre visuel: "2nd" | "1st" | "3rd" pour la grille */
  gridOrder: "2nd" | "1st" | "3rd";
  /** Espace supplémentaire au-dessus du pourcentage (pour aligner le ring à la même hauteur que les autres) */
  extraSpaceAboveRing?: number;
};

function ProgressRing({
  percentage,
  ringBg,
  ringFg,
}: {
  percentage: number;
  ringBg: string;
  ringFg: string;
}) {
  const offset = RING_CIRCUMFERENCE * (1 - percentage / 100);
  return (
    <div className="relative w-[70px] h-[70px] flex-shrink-0">
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        className="rotate-[-90deg]"
        aria-hidden
      >
        <circle
          cx="35"
          cy="35"
          r={RING_R}
          fill="none"
          stroke={ringBg}
          strokeWidth="6"
        />
        <circle
          cx="35"
          cy="35"
          r={RING_R}
          fill="none"
          stroke={ringFg}
          strokeWidth="6"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[19px] font-medium text-gray-900">
        {percentage}%
      </div>
    </div>
  );
}

function PointItem({
  point,
  accentColor,
}: {
  point: PodiumPoint;
  accentColor: string;
}) {
  return (
    <li className="flex gap-2 items-start break-words">
      <div
        className="w-1.5 h-1.5 rounded-full bg-primary-600 flex-shrink-0 mt-1.5"
        aria-hidden
      />
      <p className="text-[14px] leading-[1.5] text-gray-700 break-words min-w-0 flex-1">
        <span
          className="font-normal underline text-gray-900"
          style={{ textDecorationColor: accentColor, textUnderlineOffset: "2px" }}
        >
          {point.title}
        </span>
        {" — "}
        {point.description}
      </p>
    </li>
  );
}

export default function PodiumCard({
  candidate,
  accentColor,
  gridOrder,
  extraSpaceAboveRing = 0,
}: PodiumCardProps) {
  const style = rankStyles[candidate.rank];
  // Mobile: 1er en premier, 2e en deuxième, 3e en troisième. Desktop (md+): 2e | 1er | 3e (podium).
  const orderClass =
    gridOrder === "1st"
      ? "order-1 md:order-2"
      : gridOrder === "2nd"
        ? "order-2 md:order-1"
        : "order-3 md:order-3";

  return (
    <div className={`flex min-w-0 flex-col items-stretch ${orderClass}`}>
      <div
        className={`rounded-[10px] border-2 bg-white px-3.5 pt-[11px] pb-2 text-center mb-2.5 shadow-sm ${candidate.rank === 1 ? "border-green-200" : "border-gray-200"}`}
      >
        <span
          className={`inline-block text-[10px] tracking-widest uppercase rounded-full border px-2.5 py-0.5 mb-1.5 ${style.badge}`}
        >
          {style.label}
        </span>
        <div className="text-[16px] text-gray-900 leading-snug mb-0.5">
          {candidate.listName}
        </div>
        <div className="text-[13px] text-gray-500">{candidate.personName}</div>
      </div>
      <div
        className={`rounded-xl border-2 px-4 pt-5 flex min-h-0 flex-col items-center box-border ${style.pillar}`}
        style={{ paddingBottom: PADDING_BOTTOM_PX }}
      >
        {/* Espace au-dessus du ring (variable par rang) → pourcentages alignés. Ring fixe, points en dessous (hauteur variable OK). */}
        <div
          className="w-full flex-shrink-0"
          style={{ height: style.spaceAboveRingPx + extraSpaceAboveRing }}
          aria-hidden
        />
        <div className="flex w-full flex-shrink-0 flex-col items-center">
          <ProgressRing
            percentage={candidate.percentage}
            ringBg={style.ringBg}
            ringFg={style.ringFg}
          />
        </div>
        <ul className="mt-3.5 w-full flex-shrink-0 flex flex-col gap-2 list-none p-0 m-0">
          {candidate.points.map((point, i) => (
            <PointItem key={i} point={point} accentColor={accentColor} />
          ))}
        </ul>
      </div>
    </div>
  );
}

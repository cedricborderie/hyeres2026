"use client";

import type { NotationTheme, NotationCandidate, NotationRow } from "@/lib/notation-data";
import { cellColor, notationColors, legendItems } from "@/lib/notation-data";

type NotationTableProps = {
  theme: NotationTheme;
  /** Couleur d'accent pour le titre (hex) */
  accentColor: string;
};

export default function NotationTable({ theme, accentColor }: NotationTableProps) {
  const { title, candidates, rows } = theme;

  return (
    <section className="mb-10">
      <h2 className="text-[20px] font-normal text-gray-900 mb-5">
        Découvrez les engagements des candidats en{" "}
        <span style={{ color: accentColor }}>{title}</span>
        , mesure par mesure.
      </h2>
      <div className="w-full rounded-[10px] overflow-hidden border-2 border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[700px]">
            <thead>
              <tr className="bg-white border-b-2 border-gray-200">
                <th className="w-[40%] text-left py-3.5 px-4 text-[11px] text-gray-500 uppercase tracking-wider font-normal align-bottom border-r-2 border-gray-200">
                  Mesure
                </th>
                {candidates.map((c: NotationCandidate) => (
                  <th
                    key={c.key}
                    className="border-r border-gray-200 p-0 align-bottom font-normal last:border-r-0"
                  >
                    <div className="h-[160px] relative overflow-visible flex items-center justify-center">
                      <span
                        className="absolute whitespace-nowrap text-gray-900 leading-none top-1/2 left-1/2"
                        style={{
                          fontSize: "15.6px",
                          transformOrigin: "50% 50%",
                          transform: "translate(-50%, -50%) rotate(-45deg)",
                        }}
                      >
                        {c.label}
                      </span>
                      <div
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-px h-3.5 bg-gray-200"
                        aria-hidden
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: NotationRow, rowIndex: number) => (
                <tr
                  key={row.mesure}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <td
                    className={`text-left py-0 px-4 pl-[18px] text-gray-900 h-[42px] leading-[42px] border-r-2 border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                      rowIndex % 2 === 1 ? "bg-[#f8f9fa]" : "bg-white"
                    }`}
                    style={{ fontSize: "15.6px" }}
                  >
                    {row.mesure}
                  </td>
                  {candidates.map((c) => {
                    const color = cellColor(row[c.key], c.key, row.mesure);
                    return (
                      <td
                        key={c.key}
                        className="py-1.5 px-1 h-[42px] align-middle text-center border-r border-white/40 last:border-r-0"
                      >
                        <div
                          className="w-full h-8 rounded-[5px]"
                          style={{ background: color }}
                          aria-hidden
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-200 rounded-[10px] py-6 px-7 mt-10 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <h3 className="text-lg font-normal text-gray-900 mb-4">Légende</h3>
        <div className="flex flex-col gap-2.5">
          {legendItems.map((item) => (
            <div key={item.color} className="flex items-center gap-3.5">
              <div
                className="w-9 h-9 rounded-md flex-shrink-0"
                style={{ background: notationColors[item.color] }}
                aria-hidden
              />
              <p className="text-[13px] text-gray-700 leading-snug">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

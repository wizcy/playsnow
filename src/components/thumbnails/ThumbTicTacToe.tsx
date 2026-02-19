"use client";
export default function ThumbTicTacToe() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#1e293b" }}>
      {/* Grid lines */}
      <line x1="33" y1="10" x2="33" y2="90" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="67" y1="10" x2="67" y2="90" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="33" x2="90" y2="33" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="10" y1="67" x2="90" y2="67" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      {/* X top-left */}
      <line x1="14" y1="14" x2="28" y2="28" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="14" x2="14" y2="28" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      {/* O top-center */}
      <circle cx="50" cy="21" r="9" fill="none" stroke="#60a5fa" strokeWidth="4" />
      {/* X top-right */}
      <line x1="72" y1="14" x2="86" y2="28" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      <line x1="86" y1="14" x2="72" y2="28" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      {/* O mid-left */}
      <circle cx="17" cy="50" r="9" fill="none" stroke="#60a5fa" strokeWidth="4" />
      {/* X center */}
      <line x1="41" y1="41" x2="59" y2="59" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      <line x1="59" y1="41" x2="41" y2="59" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
      {/* O mid-right */}
      <circle cx="83" cy="50" r="9" fill="none" stroke="#60a5fa" strokeWidth="4" />
      {/* O bottom-left */}
      <circle cx="17" cy="79" r="9" fill="none" stroke="#60a5fa" strokeWidth="4" />
      {/* Winning line through X diagonal */}
      <line x1="14" y1="14" x2="86" y2="86" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

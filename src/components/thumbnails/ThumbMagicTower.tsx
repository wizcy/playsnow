"use client";
export default function ThumbMagicTower() {
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#1a1a2e" }}>
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
        <rect x="25" y="10" width="50" height="80" rx="3" fill="#2d2d5e" stroke="#8b5cf6" strokeWidth="2"/>
        <rect x="30" y="15" width="40" height="12" rx="1" fill="#4c1d95" opacity="0.6"/>
        <rect x="30" y="30" width="40" height="12" rx="1" fill="#4c1d95" opacity="0.5"/>
        <rect x="30" y="45" width="40" height="12" rx="1" fill="#4c1d95" opacity="0.4"/>
        <rect x="30" y="60" width="40" height="12" rx="1" fill="#4c1d95" opacity="0.3"/>
        <rect x="42" y="75" width="16" height="12" rx="1" fill="#7c3aed"/>
        <circle cx="50" cy="67" r="3" fill="#fbbf24"/>
        <text x="50" y="23" textAnchor="middle" fill="#c4b5fd" fontSize="6" fontWeight="bold">🏰</text>
      </svg>
    </div>
  );
}

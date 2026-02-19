"use client";
export default function ThumbFlappyBird() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Sky */}
      <rect width="100" height="100" fill="#87CEEB" />
      {/* Ground */}
      <rect y="88" width="100" height="12" fill="#8B6914" />
      <rect y="85" width="100" height="5" fill="#5D8A1C" />
      {/* Pipes */}
      <rect x="30" width="14" height="35" fill="#5D8A1C" />
      <rect x="28" y="30" width="18" height="5" fill="#4a7015" rx="1" />
      <rect x="30" y="55" width="14" height="33" fill="#5D8A1C" />
      <rect x="28" y="53" width="18" height="5" fill="#4a7015" rx="1" />
      <rect x="68" width="14" height="28" fill="#5D8A1C" />
      <rect x="66" y="23" width="18" height="5" fill="#4a7015" rx="1" />
      <rect x="68" y="48" width="14" height="40" fill="#5D8A1C" />
      <rect x="66" y="46" width="18" height="5" fill="#4a7015" rx="1" />
      {/* Bird */}
      <ellipse cx="18" cy="44" rx="8" ry="6" fill="#fbbf24" />
      <circle cx="22" cy="41" r="3" fill="white" />
      <circle cx="23" cy="41" r="1.5" fill="#1e293b" />
      <path d="M10 44 L4 42 L10 46 Z" fill="#fb923c" />
      <path d="M14 40 Q18 34 22 38" stroke="#fb923c" strokeWidth="2" fill="none" />
    </svg>
  );
}

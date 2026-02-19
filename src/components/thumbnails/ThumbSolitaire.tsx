"use client";
export default function ThumbSolitaire() {
  const cards = [
    { suit: "♥", val: "A", x: 5, y: 5, red: true },
    { suit: "♠", val: "K", x: 30, y: 5, red: false },
    { suit: "♦", val: "Q", x: 55, y: 5, red: true },
    { suit: "♣", val: "J", x: 5, y: 48, red: false },
    { suit: "♥", val: "10", x: 30, y: 48, red: true },
    { suit: "♠", val: "9", x: 55, y: 48, red: false },
  ];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#166534" }}>
      {cards.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={38} height={42} rx={3} fill="#fff" stroke="#d1d5db" strokeWidth="0.5" />
          <text x={c.x + 4} y={c.y + 12} fontSize="8" fontWeight="bold" fill={c.red ? "#ef4444" : "#111"}>{c.val}</text>
          <text x={c.x + 19} y={c.y + 28} fontSize="16" textAnchor="middle" fill={c.red ? "#ef4444" : "#111"}>{c.suit}</text>
        </g>
      ))}
    </svg>
  );
}

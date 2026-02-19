"use client";
export default function ThumbMemoryMatch() {
  const cards = [
    { x: 5, y: 10, flipped: true, symbol: "★", color: "#a78bfa" },
    { x: 38, y: 10, flipped: false, symbol: "", color: "" },
    { x: 5, y: 55, flipped: false, symbol: "", color: "" },
    { x: 38, y: 55, flipped: true, symbol: "★", color: "#a78bfa" },
    { x: 71, y: 10, flipped: true, symbol: "♦", color: "#f472b6" },
    { x: 71, y: 55, flipped: false, symbol: "", color: "" },
  ];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#0f172a" }}>
      {cards.map((card, i) => (
        <g key={i}>
          <rect x={card.x} y={card.y} width="26" height="36" rx="3"
            fill={card.flipped ? "#1e293b" : "#334155"} stroke={card.flipped ? card.color : "#475569"} strokeWidth="1.5" />
          {card.flipped ? (
            <text x={card.x+13} y={card.y+23} textAnchor="middle" fontSize="16" fill={card.color}>{card.symbol}</text>
          ) : (
            <>
              <line x1={card.x+5} y1={card.y+5} x2={card.x+21} y2={card.y+31} stroke="#475569" strokeWidth="1" />
              <line x1={card.x+21} y1={card.y+5} x2={card.x+5} y2={card.y+31} stroke="#475569" strokeWidth="1" />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

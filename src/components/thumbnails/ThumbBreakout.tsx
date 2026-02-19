"use client";
export default function ThumbBreakout() {
  const rows = [
    { color: "#ef4444", count: 7 },
    { color: "#f97316", count: 7 },
    { color: "#eab308", count: 7 },
    { color: "#22c55e", count: 7 },
  ];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#1e1e2e" }}>
      {rows.map((row, r) =>
        Array.from({ length: row.count }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 14 + 1} y={r * 9 + 5} width={12} height={7} rx={1} fill={row.color} />
        ))
      )}
      <circle cx={50} cy={62} r={3} fill="#fff" />
      <rect x={30} y={88} width={40} height={6} rx={3} fill="#60a5fa" />
    </svg>
  );
}

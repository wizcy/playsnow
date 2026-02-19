"use client";
export default function ThumbWordle() {
  const rows = [
    [["C","#6aaa64"],["R","#6aaa64"],["A","#c9b458"],["N","#787c7e"],["E","#787c7e"]],
    [["C","#6aaa64"],["L","#787c7e"],["O","#787c7e"],["U","#c9b458"],["D","#787c7e"]],
    [["C","#6aaa64"],["O","#787c7e"],["U","#c9b458"],["R","#6aaa64"],["T","#787c7e"]],
    [["C","#6aaa64"],["O","#787c7e"],["U","#c9b458"],["R","#6aaa64"],["S","#6aaa64"]],
  ];
  const size = 18;
  const gap = 2;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#fff" }}>
      {rows.map((row, r) =>
        row.map(([letter, color], c) => (
          <g key={`${r}-${c}`}>
            <rect x={c * (size + gap) + 5} y={r * (size + gap) + 10} width={size} height={size} rx={2} fill={color as string} />
            <text x={c * (size + gap) + 5 + size / 2} y={r * (size + gap) + 10 + size * 0.72}
              textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">{letter}</text>
          </g>
        ))
      )}
    </svg>
  );
}

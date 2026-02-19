"use client";
export default function ThumbMinesweeper() {
  const cells = [
    [" "," ","1","1","1"],
    [" ","1","2","💣","1"],
    [" ","1","💣","3","1"],
    ["1","2","2","2"," "],
    ["💣","1"," ","1"," "],
  ];
  const colors: Record<string, string> = { "1":"#2563eb","2":"#16a34a","3":"#dc2626" };
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#9ca3af" }}>
      {cells.map((row, r) =>
        row.map((val, c) => {
          const x = c * 20, y = r * 20;
          const revealed = val !== " " && val !== "💣";
          const isBomb = val === "💣";
          return (
            <g key={`${r}-${c}`}>
              <rect x={x+0.5} y={y+0.5} width="19" height="19"
                fill={revealed || isBomb ? "#d1d5db" : "#e5e7eb"}
                stroke={revealed || isBomb ? "#9ca3af" : "#fff"}
                strokeWidth="0.5" />
              {revealed && (
                <text x={x+10} y={y+14} textAnchor="middle" fontSize="10" fontWeight="bold" fill={colors[val] || "#374151"}>{val}</text>
              )}
              {isBomb && (
                <circle cx={x+10} cy={y+10} r="5" fill="#1f2937" />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

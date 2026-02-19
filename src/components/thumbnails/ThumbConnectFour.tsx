"use client";
export default function ThumbConnectFour() {
  const grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0],
    [0,0,1,2,2,0,0],
    [0,1,2,1,2,0,0],
    [1,2,1,2,1,2,0],
  ];
  const cell = 100 / 7;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="#1d4ed8" />
      {grid.map((row, r) =>
        row.map((val, c) => (
          <circle key={`${r}-${c}`}
            cx={c * cell + cell / 2} cy={r * cell + cell / 2 + 5}
            r={cell * 0.38}
            fill={val === 0 ? "#1e3a8a" : val === 1 ? "#ef4444" : "#facc15"}
          />
        ))
      )}
    </svg>
  );
}

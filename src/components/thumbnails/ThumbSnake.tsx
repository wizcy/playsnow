"use client";
export default function ThumbSnake() {
  // Snake body path on a 10x10 grid
  const body = [
    [5,2],[5,3],[5,4],[5,5],[5,6],[4,6],[3,6],[3,5],[3,4],[3,3],[4,3],
  ];
  const food = [7, 4];
  const size = 10;
  const cell = 100 / size;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#1a1a2e" }}>
      {/* Grid dots */}
      {Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => (
          <circle key={`${r}-${c}`} cx={c * cell + cell / 2} cy={r * cell + cell / 2} r="0.5" fill="#2a2a4a" />
        ))
      )}
      {/* Snake body */}
      {body.map(([r, c], i) => (
        <rect key={i} x={c * cell + 0.5} y={r * cell + 0.5} width={cell - 1} height={cell - 1}
          rx="1.5" fill={i === 0 ? "#22c55e" : "#4ade80"} opacity={i === 0 ? 1 : 0.85 - i * 0.04} />
      ))}
      {/* Food */}
      <circle cx={food[1] * cell + cell / 2} cy={food[0] * cell + cell / 2} r={cell / 2 - 1} fill="#ef4444" />
    </svg>
  );
}

"use client";
export default function ThumbTetris() {
  // Tetromino pieces as [row, col, color]
  const blocks: [number, number, string][] = [
    // I-piece (cyan)
    [0,0,"#60a5fa"],[0,1,"#60a5fa"],[0,2,"#60a5fa"],[0,3,"#60a5fa"],
    // O-piece (yellow)
    [2,0,"#fbbf24"],[2,1,"#fbbf24"],[3,0,"#fbbf24"],[3,1,"#fbbf24"],
    // T-piece (purple)
    [2,3,"#a78bfa"],[3,2,"#a78bfa"],[3,3,"#a78bfa"],[3,4,"#a78bfa"],
    // S-piece (green)
    [5,1,"#4ade80"],[5,2,"#4ade80"],[6,0,"#4ade80"],[6,1,"#4ade80"],
    // L-piece (orange)
    [5,4,"#fb923c"],[6,4,"#fb923c"],[7,4,"#fb923c"],[7,5,"#fb923c"],
    // bottom rows
    [8,0,"#60a5fa"],[8,1,"#fbbf24"],[8,2,"#a78bfa"],[8,3,"#4ade80"],[8,4,"#fb923c"],[8,5,"#ef4444"],
    [9,0,"#fbbf24"],[9,1,"#60a5fa"],[9,2,"#ef4444"],[9,3,"#a78bfa"],[9,4,"#4ade80"],[9,5,"#fb923c"],
  ];
  const cell = 10;
  return (
    <svg viewBox="0 0 60 100" className="w-full h-full" style={{ background: "#0f172a" }}>
      {blocks.map(([r, c, color], i) => (
        <rect key={i} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1}
          rx="1" fill={color} />
      ))}
    </svg>
  );
}

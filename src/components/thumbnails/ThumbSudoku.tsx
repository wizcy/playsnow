"use client";
export default function ThumbSudoku() {
  const nums = [
    [5,3,0, 0,7,0, 0,0,0],
    [6,0,0, 1,9,5, 0,0,0],
    [0,9,8, 0,0,0, 0,6,0],
    [8,0,0, 0,6,0, 0,0,3],
    [4,0,0, 8,0,3, 0,0,1],
    [7,0,0, 0,2,0, 0,0,6],
    [0,6,0, 0,0,0, 2,8,0],
    [0,0,0, 4,1,9, 0,0,5],
    [0,0,0, 0,8,0, 0,7,9],
  ];
  const cell = 100 / 9;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#fff" }}>
      {nums.map((row, r) =>
        row.map((val, c) => (
          <g key={`${r}-${c}`}>
            <rect x={c*cell} y={r*cell} width={cell} height={cell}
              fill={val ? "#f0f9ff" : "#fff"} stroke="#cbd5e1" strokeWidth="0.3" />
            {val > 0 && (
              <text x={c*cell+cell/2} y={r*cell+cell*0.72} textAnchor="middle"
                fontSize="8" fontWeight="bold" fill="#1e40af">{val}</text>
            )}
          </g>
        ))
      )}
      {/* Bold 3x3 borders */}
      {[0,1,2].map(br => [0,1,2].map(bc => (
        <rect key={`${br}-${bc}`} x={bc*cell*3} y={br*cell*3} width={cell*3} height={cell*3}
          fill="none" stroke="#1e40af" strokeWidth="1.2" />
      )))}
    </svg>
  );
}

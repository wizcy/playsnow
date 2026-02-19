"use client";
export default function ThumbCheckers() {
  const pieces: Record<string, number> = {
    "0-1":2,"0-3":2,"0-5":2,"0-7":2,
    "1-0":2,"1-2":2,"1-4":2,"1-6":2,
    "2-1":2,"2-3":2,"2-5":2,"2-7":2,
    "5-0":1,"5-2":1,"5-4":1,"5-6":1,
    "6-1":1,"6-3":1,"6-5":1,"6-7":1,
    "7-0":1,"7-2":1,"7-4":1,"7-6":1,
  };
  const cell = 100 / 8;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Array.from({ length: 8 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => {
          const dark = (r + c) % 2 === 1;
          const piece = pieces[`${r}-${c}`];
          return (
            <g key={`${r}-${c}`}>
              <rect x={c * cell} y={r * cell} width={cell} height={cell}
                fill={dark ? "#b45309" : "#fef3c7"} />
              {piece && dark && (
                <circle cx={c * cell + cell / 2} cy={r * cell + cell / 2} r={cell * 0.38}
                  fill={piece === 1 ? "#ef4444" : "#1f2937"}
                  stroke={piece === 1 ? "#fca5a5" : "#6b7280"} strokeWidth="0.8" />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

"use client";
export default function ThumbChess() {
  const pieces: Record<string, string> = {
    "0-0":"♜","0-1":"♞","0-2":"♝","0-3":"♛","0-4":"♚","0-5":"♝","0-6":"♞","0-7":"♜",
    "1-0":"♟","1-1":"♟","1-2":"♟","1-3":"♟","1-4":"♟","1-5":"♟","1-6":"♟","1-7":"♟",
    "6-0":"♙","6-1":"♙","6-2":"♙","6-3":"♙","6-4":"♙","6-5":"♙","6-6":"♙","6-7":"♙",
    "7-0":"♖","7-1":"♘","7-2":"♗","7-3":"♕","7-4":"♔","7-5":"♗","7-6":"♘","7-7":"♖",
  };
  const cell = 100 / 8;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Array.from({length:8},(_,r) => Array.from({length:8},(_,c) => (
        <g key={`${r}-${c}`}>
          <rect x={c*cell} y={r*cell} width={cell} height={cell}
            fill={(r+c)%2===0 ? "#f0d9b5" : "#b58863"} />
          {pieces[`${r}-${c}`] && (
            <text x={c*cell+cell/2} y={r*cell+cell*0.78} textAnchor="middle"
              fontSize="9" fill={(r<2)?"#1f2937":"#f9fafb"}>{pieces[`${r}-${c}`]}</text>
          )}
        </g>
      )))}
    </svg>
  );
}

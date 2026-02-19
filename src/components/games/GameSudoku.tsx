"use client";
import { useState, useEffect, useCallback } from "react";

const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

const SOLUTION = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9],
];

type Notes = Record<string, Set<number>>;

function getConflicts(grid: number[][]): Set<string> {
  const conflicts = new Set<string>();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = grid[r][c];
      if (!v) continue;
      for (let i = 0; i < 9; i++) {
        if (i !== c && grid[r][i] === v) { conflicts.add(`${r},${c}`); conflicts.add(`${r},${i}`); }
        if (i !== r && grid[i][c] === v) { conflicts.add(`${r},${c}`); conflicts.add(`${i},${c}`); }
      }
      const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
      for (let dr = 0; dr < 3; dr++) for (let dc = 0; dc < 3; dc++) {
        const nr = br + dr, nc = bc + dc;
        if ((nr !== r || nc !== c) && grid[nr][nc] === v) { conflicts.add(`${r},${c}`); conflicts.add(`${nr},${nc}`); }
      }
    }
  }
  return conflicts;
}

function isComplete(grid: number[][]): boolean {
  return grid.every((row, r) => row.every((v, c) => v === SOLUTION[r][c]));
}

function useTimer(running: boolean) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, reset: () => setSecs(0) };
}

export default function GameSudoku() {
  const [grid, setGrid] = useState(() => PUZZLE.map(r => [...r]));
  const [fixed] = useState(() => PUZZLE.map(r => r.map(v => v !== 0)));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [pencilMode, setPencilMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});
  const [won, setWon] = useState(false);
  const timer = useTimer(!won);

  const conflicts = getConflicts(grid);

  const input = useCallback((n: number) => {
    if (!selected || won) return;
    const [r, c] = selected;
    if (fixed[r][c]) return;
    if (pencilMode && n !== 0) {
      const key = `${r},${c}`;
      setNotes(prev => {
        const next = { ...prev };
        const set = new Set(prev[key] ?? []);
        if (set.has(n)) { set.delete(n); } else { set.add(n); }
        next[key] = set;
        return next;
      });
    } else {
      const g = grid.map(row => [...row]);
      g[r][c] = n;
      // clear notes for this cell
      setNotes(prev => { const next = { ...prev }; delete next[`${r},${c}`]; return next; });
      setGrid(g);
      if (isComplete(g)) setWon(true);
    }
  }, [selected, won, fixed, pencilMode, grid]);

  const reset = () => {
    setGrid(PUZZLE.map(r => [...r]));
    setNotes({});
    setSelected(null);
    setWon(false);
    timer.reset();
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!selected) return;
      const [r, c] = selected;
      if (e.key >= "1" && e.key <= "9") { e.preventDefault(); input(Number(e.key)); }
      else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") { e.preventDefault(); input(0); }
      else if (e.key === "ArrowUp"    && r > 0) { e.preventDefault(); setSelected([r - 1, c]); }
      else if (e.key === "ArrowDown"  && r < 8) { e.preventDefault(); setSelected([r + 1, c]); }
      else if (e.key === "ArrowLeft"  && c > 0) { e.preventDefault(); setSelected([r, c - 1]); }
      else if (e.key === "ArrowRight" && c < 8) { e.preventDefault(); setSelected([r, c + 1]); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selected, input]);

  const selRow = selected?.[0], selCol = selected?.[1];
  const selBox = selected ? `${Math.floor(selected[0] / 3)},${Math.floor(selected[1] / 3)}` : null;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <span className="font-mono text-lg text-white">{timer.display}</span>
        <button
          onClick={() => setPencilMode(p => !p)}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${pencilMode ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
        >
          Pencil {pencilMode ? "ON" : "OFF"}
        </button>
        <button onClick={reset} className="bg-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-600 text-gray-300">Reset</button>
      </div>

      {won && (
        <div className="text-green-400 font-bold text-xl animate-pulse">Puzzle Complete!</div>
      )}

      <div
        className="grid grid-cols-9"
        style={{ border: "2px solid #6b7280" }}
      >
        {grid.flat().map((v, i) => {
          const r = Math.floor(i / 9), c = i % 9;
          const key = `${r},${c}`;
          const isSel = r === selRow && c === selCol;
          const boxKey = `${Math.floor(r / 3)},${Math.floor(c / 3)}`;
          const isHighlighted = !isSel && (r === selRow || c === selCol || boxKey === selBox);
          const isConflict = conflicts.has(key);
          const isFixed = fixed[r][c];
          const cellNotes = notes[key];

          const borderR = c === 2 || c === 5 ? "border-r-2 border-r-gray-400" : c < 8 ? "border-r border-r-gray-700" : "";
          const borderB = r === 2 || r === 5 ? "border-b-2 border-b-gray-400" : r < 8 ? "border-b border-b-gray-700" : "";

          let bg = "bg-gray-900";
          if (isSel) bg = "bg-blue-800";
          else if (isHighlighted) bg = "bg-gray-700";

          const textColor = isConflict ? "text-red-400" : isFixed ? "text-gray-200" : "text-blue-300";

          return (
            <div
              key={i}
              onClick={() => setSelected([r, c])}
              className={`w-10 h-10 flex items-center justify-center cursor-pointer relative ${bg} ${borderR} ${borderB}`}
            >
              {v ? (
                <span className={`text-sm font-bold ${textColor}`}>{v}</span>
              ) : cellNotes?.size ? (
                <div className="grid grid-cols-3 w-full h-full p-px">
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <span key={n} className={`flex items-center justify-center text-[7px] leading-none ${cellNotes.has(n) ? "text-yellow-400" : "text-transparent"}`}>{n}</span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-1">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            onClick={() => input(n)}
            className="w-9 h-9 bg-gray-700 rounded hover:bg-gray-600 text-sm font-semibold text-white transition-colors"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => input(0)}
          className="w-9 h-9 bg-gray-800 rounded hover:bg-gray-700 text-sm text-gray-400 transition-colors"
        >
          Del
        </button>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { saveScore, getScore } from "@/lib/scores";

const ROWS = 20, COLS = 10;
const COLORS = ["#00f0f0","#f0f000","#a000f0","#0000f0","#f0a000","#00f000","#f00000"];

// All 7 tetrominoes with all rotation states
const PIECES: number[][][][] = [
  // I
  [[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
   [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
  // O
  [[[1,1],[1,1]]],
  // T
  [[[0,1,0],[1,1,1],[0,0,0]],[[0,1,0],[0,1,1],[0,1,0]],[[0,0,0],[1,1,1],[0,1,0]],[[0,1,0],[1,1,0],[0,1,0]]],
  // J
  [[[1,0,0],[1,1,1],[0,0,0]],[[0,1,1],[0,1,0],[0,1,0]],[[0,0,0],[1,1,1],[0,0,1]],[[0,1,0],[0,1,0],[1,1,0]]],
  // L
  [[[0,0,1],[1,1,1],[0,0,0]],[[0,1,0],[0,1,0],[0,1,1]],[[0,0,0],[1,1,1],[1,0,0]],[[1,1,0],[0,1,0],[0,1,0]]],
  // S
  [[[0,1,1],[1,1,0],[0,0,0]],[[0,1,0],[0,1,1],[0,0,1]]],
  // Z
  [[[1,1,0],[0,1,1],[0,0,0]],[[0,0,1],[0,1,1],[0,1,0]]],
];

// Wall kick offsets [from_rot][attempt] for non-I pieces
const KICKS: [number,number][][] = [
  [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  [[0,0],[1,0],[1,-1],[0,2],[1,2]],
  [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
];
const KICKS_I: [number,number][][] = [
  [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
  [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
  [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
  [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
];

type Grid = number[][];
type Piece = { type: number; rot: number; x: number; y: number };

function getShape(p: Piece) { return PIECES[p.type][p.rot % PIECES[p.type].length]; }

function valid(grid: Grid, p: Piece): boolean {
  return getShape(p).every((row, r) => row.every((v, c) => {
    if (!v) return true;
    const nr = p.y + r, nc = p.x + c;
    return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !grid[nr][nc];
  }));
}

function spawnPiece(type: number): Piece {
  return { type, rot: 0, x: type === 0 ? 3 : 3, y: type === 0 ? -1 : 0 };
}

function randType() { return Math.floor(Math.random() * 7); }

function getLevel(lines: number) { return Math.floor(lines / 10); }
function getSpeed(lines: number) { return Math.max(100, 500 - getLevel(lines) * 40); }
const LINE_SCORES = [0, 100, 300, 500, 800];

export default function GameTetris() {
  const [grid, setGrid] = useState<Grid>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState<Piece>(() => spawnPiece(randType()));
  const [next, setNext] = useState<number>(() => randType());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getScore("tetris"));
  const [lines, setLines] = useState(0);
  const [over, setOver] = useState(false);
  const [clearing, setClearing] = useState<number[]>([]);

  const gridRef = useRef(grid);
  const pieceRef = useRef(piece);
  const nextRef = useRef(next);
  const linesRef = useRef(lines);
  const overRef = useRef(over);
  const scoreRef = useRef(score);
  gridRef.current = grid;
  pieceRef.current = piece;
  nextRef.current = next;
  linesRef.current = lines;
  overRef.current = over;
  scoreRef.current = score;

  const lock = useCallback((g: Grid, p: Piece) => {
    const ng = g.map(r => [...r]);
    getShape(p).forEach((row, r) => row.forEach((v, c) => {
      if (v) ng[p.y + r][p.x + c] = p.type + 1;
    }));
    const clearRows: number[] = [];
    ng.forEach((row, i) => { if (row.every(v => v)) clearRows.push(i); });

    const doSpawn = (board: Grid) => {
      const np = spawnPiece(nextRef.current);
      const nn = randType();
      setNext(nn);
      if (!valid(board, np)) { setOver(true); setBest(b => { const nb = Math.max(b, scoreRef.current); saveScore("tetris", nb); return nb; }); setGrid(board); }
      else { setGrid(board); setPiece(np); }
    };

    if (clearRows.length) {
      setClearing(clearRows);
      setTimeout(() => {
        setClearing([]);
        const final = ng.filter((_, i) => !clearRows.includes(i));
        while (final.length < ROWS) final.unshift(Array(COLS).fill(0));
        setScore(s => s + LINE_SCORES[clearRows.length]);
        setLines(l => { linesRef.current = l + clearRows.length; return l + clearRows.length; });
        doSpawn(final);
      }, 200);
    } else {
      setScore(s => s + LINE_SCORES[0]);
      doSpawn(ng);
    }
  }, []);

  const tryRotate = useCallback(() => {
    if (overRef.current) return;
    const p = pieceRef.current;
    const g = gridRef.current;
    const newRot = (p.rot + 1) % PIECES[p.type].length;
    const np = { ...p, rot: newRot };
    const kicks = p.type === 0 ? KICKS_I : KICKS;
    const kickSet = kicks[p.rot % 4] ?? kicks[0];
    for (const [dx, dy] of kickSet) {
      const kicked = { ...np, x: np.x + dx, y: np.y - dy };
      if (valid(g, kicked)) { setPiece(kicked); return; }
    }
  }, []);

  const moveP = useCallback((dx: number, dy: number) => {
    if (overRef.current) return;
    const p = pieceRef.current;
    const g = gridRef.current;
    const np = { ...p, x: p.x + dx, y: p.y + dy };
    if (valid(g, np)) setPiece(np);
    else if (dy > 0) lock(g, p);
  }, [lock]);

  const hardDrop = useCallback(() => {
    if (overRef.current) return;
    let p = pieceRef.current;
    const g = gridRef.current;
    while (valid(g, { ...p, y: p.y + 1 })) p = { ...p, y: p.y + 1 };
    lock(g, p);
  }, [lock]);

  useEffect(() => {
    const map: Record<string, () => void> = {
      ArrowLeft: () => moveP(-1, 0), ArrowRight: () => moveP(1, 0),
      ArrowDown: () => moveP(0, 1), ArrowUp: tryRotate,
      " ": hardDrop, z: tryRotate, x: tryRotate,
    };
    const h = (e: KeyboardEvent) => { if (map[e.key]) { e.preventDefault(); map[e.key](); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [moveP, tryRotate, hardDrop]);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => moveP(0, 1), getSpeed(lines));
    return () => clearInterval(t);
  }, [over, lines, moveP]);

  // Touch controls
  const touchStart = useRef<[number, number, number] | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = [e.touches[0].clientX, e.touches[0].clientY, Date.now()];
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const [sx, sy, st] = touchStart.current;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    const dt = Date.now() - st;
    touchStart.current = null;
    if (Math.abs(dx) < 15 && Math.abs(dy) < 15 && dt < 300) { tryRotate(); return; }
    if (Math.abs(dx) > Math.abs(dy)) moveP(dx > 0 ? 1 : -1, 0);
    else if (dy > 0) { if (dy > 60) hardDrop(); else moveP(0, 1); }
  };

  // Ghost piece
  let ghost = pieceRef.current;
  while (valid(grid, { ...ghost, y: ghost.y + 1 })) ghost = { ...ghost, y: ghost.y + 1 };

  const display = grid.map(r => [...r]);
  // Draw ghost
  getShape(ghost).forEach((row, r) => row.forEach((v, c) => {
    if (v && ghost.y + r >= 0 && ghost.y + r !== piece.y + r) {
      const nr = ghost.y + r, nc = ghost.x + c;
      if (!display[nr][nc]) display[nr][nc] = -1;
    }
  }));
  // Draw active piece
  getShape(piece).forEach((row, r) => row.forEach((v, c) => {
    if (v && piece.y + r >= 0) display[piece.y + r][piece.x + c] = piece.type + 1;
  }));

  const reset = () => {
    const t = randType();
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setPiece(spawnPiece(t));
    setNext(randType());
    setScore(0); setLines(0); setOver(false); setClearing([]);
  };

  // Next piece preview (4x4 grid)
  const nextShape = PIECES[next][0];
  const nextDisplay = Array.from({ length: 4 }, (_, r) =>
    Array.from({ length: 4 }, (_, c) => nextShape[r]?.[c] ? next + 1 : 0)
  );

  const level = getLevel(lines);

  return (
    <div className="flex flex-col items-center gap-3 select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex gap-4 items-start">
        {/* Board */}
        <div style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 25px)`, gap: 1, background: "#111", padding: 4, borderRadius: 4, border: "1px solid #333" }}>
            {display.map((row, r) => row.map((v, c) => (
              <div key={`${r}-${c}`} style={{
                width: 25, height: 25,
                backgroundColor: v === -1 ? "rgba(255,255,255,0.08)" : v ? COLORS[v - 1] : "#1a1a2e",
                border: "1px solid #222",
                borderRadius: 2,
                opacity: clearing.includes(r) ? 0.2 : 1,
                transition: clearing.includes(r) ? "opacity 0.15s" : undefined,
                boxShadow: v > 0 ? `inset 0 1px 0 rgba(255,255,255,0.2)` : undefined,
              }} />
            )))}
          </div>
          {over && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
              <div style={{ color: "#f87171", fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>GAME OVER</div>
              <div style={{ color: "#9ca3af", marginBottom: 12 }}>Score: {score}</div>
              <button onClick={reset} style={{ background: "#4f46e5", color: "white", border: "none", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>Play Again</button>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 80 }}>
          <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 4, padding: 8 }}>
            <div style={{ color: "#6b7280", fontSize: 11, marginBottom: 4 }}>NEXT</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 16px)", gap: 1 }}>
              {nextDisplay.flat().map((v, i) => (
                <div key={i} style={{ width: 16, height: 16, backgroundColor: v ? COLORS[v - 1] : "transparent", borderRadius: 2 }} />
              ))}
            </div>
          </div>
          <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 4, padding: 8 }}>
            <div style={{ color: "#6b7280", fontSize: 11 }}>SCORE</div>
            <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{score}</div>
          </div>
          <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 4, padding: 8 }}>
            <div style={{ color: "#6b7280", fontSize: 11 }}>BEST</div>
            <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{best}</div>
          </div>
          <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 4, padding: 8 }}>
            <div style={{ color: "#6b7280", fontSize: 11 }}>LINES</div>
            <div style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>{lines}</div>
          </div>
          <div style={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 4, padding: 8 }}>
            <div style={{ color: "#6b7280", fontSize: 11 }}>LEVEL</div>
            <div style={{ color: "#a78bfa", fontWeight: "bold", fontSize: 14 }}>{level}</div>
          </div>
          {!over && <button onClick={reset} style={{ background: "#374151", color: "#d1d5db", border: "none", padding: "6px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>Reset</button>}
        </div>
      </div>
      <p style={{ color: "#4b5563", fontSize: 12 }}>Arrow keys / WASD · Space = hard drop · Swipe on mobile</p>
    </div>
  );
}

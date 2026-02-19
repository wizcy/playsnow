"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { saveScore } from "@/lib/scores";

type Tile = { id: number; value: number; row: number; col: number; merging?: boolean };

let nextId = 1;
const uid = () => nextId++;

const COLORS: Record<number, [string, string]> = {
  2:    ["#eee4da", "#776e65"],
  4:    ["#ede0c8", "#776e65"],
  8:    ["#f2b179", "#fff"],
  16:   ["#f59563", "#fff"],
  32:   ["#f67c5f", "#fff"],
  64:   ["#f65e3b", "#fff"],
  128:  ["#edcf72", "#fff"],
  256:  ["#edcc61", "#fff"],
  512:  ["#edc850", "#fff"],
  1024: ["#edc53f", "#fff"],
  2048: ["#edc22e", "#fff"],
};

function spawnTile(tiles: Tile[]): Tile | null {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`));
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++)
    if (!occupied.has(`${r},${c}`)) empty.push([r, c]);
  if (!empty.length) return null;
  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  return { id: uid(), value: Math.random() < 0.9 ? 2 : 4, row, col };
}

// Slides a row of 4 tiles leftward, returns new tiles with updated positions
function slideLeft(line: (Tile | null)[], setRow: (t: Tile, i: number) => Tile): { out: (Tile | null)[]; score: number; moved: boolean } {
  const src = line.filter(Boolean) as Tile[];
  const out: (Tile | null)[] = [null, null, null, null];
  let score = 0;
  let pos = 0;
  let moved = false;
  for (let i = 0; i < src.length; i++) {
    if (i + 1 < src.length && src[i].value === src[i + 1].value) {
      const t = setRow(src[i], pos);
      out[pos] = { ...t, value: t.value * 2, merging: true };
      score += out[pos]!.value;
      i++;
      pos++;
    } else {
      out[pos] = setRow(src[i], pos);
      pos++;
    }
  }
  // detect move: any tile not in same logical slot
  for (let i = 0; i < 4; i++) {
    if (out[i]?.id !== line[i]?.id) { moved = true; break; }
  }
  return { out, score, moved };
}

function applyMove(tiles: Tile[], dir: "left" | "right" | "up" | "down"): { tiles: Tile[]; score: number; moved: boolean } {
  const grid: (Tile | null)[][] = Array.from({ length: 4 }, () => [null, null, null, null]);
  tiles.forEach(t => { grid[t.row][t.col] = t; });

  let totalScore = 0;
  let totalMoved = false;
  const result: Tile[] = [];

  if (dir === "left" || dir === "right") {
    for (let r = 0; r < 4; r++) {
      const line = dir === "right" ? [...grid[r]].reverse() : grid[r];
      const { out, score, moved } = slideLeft(line, (t, i) => ({ ...t, row: r, col: dir === "right" ? 3 - i : i }));
      totalScore += score;
      if (moved) totalMoved = true;
      out.forEach(t => t && result.push(t));
    }
  } else {
    for (let c = 0; c < 4; c++) {
      const line: (Tile | null)[] = dir === "down"
        ? [grid[3][c], grid[2][c], grid[1][c], grid[0][c]]
        : [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      const { out, score, moved } = slideLeft(line, (t, i) => ({ ...t, row: dir === "down" ? 3 - i : i, col: c }));
      totalScore += score;
      if (moved) totalMoved = true;
      out.forEach(t => t && result.push(t));
    }
  }

  return { tiles: result, score: totalScore, moved: totalMoved };
}

function hasValidMoves(tiles: Tile[]): boolean {
  if (tiles.length < 16) return true;
  const g: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  tiles.forEach(t => { g[t.row][t.col] = t.value; });
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    if (c + 1 < 4 && g[r][c] === g[r][c + 1]) return true;
    if (r + 1 < 4 && g[r][c] === g[r + 1][c]) return true;
  }
  return false;
}

function initTiles(): Tile[] {
  const t1 = spawnTile([])!;
  const t2 = spawnTile([t1])!;
  return [t1, t2];
}

export default function Game2048() {
  const [tiles, setTiles] = useState<Tile[]>(initTiles);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() =>
    typeof window !== "undefined" ? parseInt(localStorage.getItem("2048-best") || "0") : 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [continued, setContinued] = useState(false);
  const touchStart = useRef<[number, number] | null>(null);
  const moving = useRef(false);

  const handleMove = useCallback((dir: "left" | "right" | "up" | "down") => {
    if (gameOver || moving.current) return;
    setTiles(prev => {
      const { tiles: next, score: gained, moved } = applyMove(prev, dir);
      if (!moved) return prev;
      moving.current = true;

      setScore(s => {
        const ns = s + gained;
        setBest(b => {
          const nb = Math.max(b, ns);
          localStorage.setItem("2048-best", String(nb));
          saveScore("2048", nb);
          return nb;
        });
        return ns;
      });

      if (!continued && next.some(t => t.value === 2048)) setWon(true);

      setTimeout(() => {
        setTiles(t => {
          const clean = t.map(x => ({ ...x, merging: false }));
          const spawned = spawnTile(clean);
          const final = spawned ? [...clean, spawned] : clean;
          if (!hasValidMoves(final)) setGameOver(true);
          moving.current = false;
          return final;
        });
      }, 130);

      return next;
    });
  }, [gameOver, continued]);

  useEffect(() => {
    const map: Record<string, "left" | "right" | "up" | "down"> = {
      ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
    };
    const handler = (e: KeyboardEvent) => { if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleMove]);

  const reset = () => {
    setTiles(initTiles());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setContinued(false);
    moving.current = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = [e.touches[0].clientX, e.touches[0].clientY];
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current[0];
    const dy = e.changedTouches[0].clientY - touchStart.current[1];
    touchStart.current = null;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    handleMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
  };

  const CELL = 80, GAP = 10, BOARD = 4 * CELL + 5 * GAP;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, userSelect: "none" }}>
      <style>{`
        @keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
        @keyframes mrg{0%{transform:scale(1)}40%{transform:scale(1.2)}100%{transform:scale(1)}}
        .tile{position:absolute;display:flex;align-items:center;justify-content:center;
          border-radius:6px;font-weight:bold;transition:top .12s ease,left .12s ease;}
        .tile-new{animation:pop .15s ease;}
        .tile-mrg{animation:mrg .15s ease .1s;}
      `}</style>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {[["SCORE", score], ["BEST", best]].map(([label, val]) => (
          <div key={label as string} style={{ background: "#bbada0", borderRadius: 6, padding: "4px 14px", textAlign: "center", minWidth: 60 }}>
            <div style={{ color: "#eee4da", fontSize: 11, fontWeight: 700 }}>{label}</div>
            <div style={{ color: "#fff", fontWeight: 700 }}>{val}</div>
          </div>
        ))}
        <button onClick={reset} style={{ background: "#8f7a66", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 700, cursor: "pointer" }}>
          New Game
        </button>
      </div>

      <div
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        style={{ position: "relative", width: BOARD, height: BOARD, background: "#bbada0", borderRadius: 8 }}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{
            position: "absolute", width: CELL, height: CELL, borderRadius: 6, background: "#cdc1b4",
            top: GAP + Math.floor(i / 4) * (CELL + GAP),
            left: GAP + (i % 4) * (CELL + GAP),
          }} />
        ))}

        {tiles.map(t => {
          const [bg, fg] = COLORS[t.value] || ["#3c3a32", "#fff"];
          return (
            <div key={t.id} className={`tile${t.merging ? " tile-mrg" : ""}`} style={{
              width: CELL, height: CELL,
              top: GAP + t.row * (CELL + GAP),
              left: GAP + t.col * (CELL + GAP),
              background: bg, color: fg,
              fontSize: t.value >= 1024 ? 20 : t.value >= 128 ? 24 : 28,
              zIndex: t.merging ? 10 : 5,
            }}>
              {t.value}
            </div>
          );
        })}

        {(gameOver || (won && !continued)) && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: 8,
            background: "rgba(238,228,218,0.75)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: won && !gameOver ? "#f59563" : "#776e65" }}>
              {won && !gameOver ? "You Win!" : "Game Over!"}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {won && !gameOver && (
                <button onClick={() => { setContinued(true); setWon(false); }}
                  style={{ background: "#8f7a66", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 700, cursor: "pointer" }}>
                  Continue
                </button>
              )}
              <button onClick={reset}
                style={{ background: "#8f7a66", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 700, cursor: "pointer" }}>
                New Game
              </button>
            </div>
          </div>
        )}
      </div>

      <p style={{ color: "#888", fontSize: 13 }}>Arrow keys or swipe to play</p>
    </div>
  );
}

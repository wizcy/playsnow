"use client";
import { useState, useEffect, useCallback } from "react";
import { getDailyWord, getDailyNumber } from "@/lib/dailyWord";

type TileState = "empty" | "active" | "correct" | "present" | "absent";

interface Tile { letter: string; state: TileState; flip: boolean }

const ROWS = 6;
const COLS = 5;
const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function emptyGrid(): Tile[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ letter: "", state: "empty" as TileState, flip: false }))
  );
}

const tileColors: Record<TileState, string> = {
  empty: "#121213",
  active: "#121213",
  correct: "#538d4e",
  present: "#b59f3b",
  absent: "#3a3a3c",
};

const tileBorder: Record<TileState, string> = {
  empty: "2px solid #3a3a3c",
  active: "2px solid #565758",
  correct: "2px solid #538d4e",
  present: "2px solid #b59f3b",
  absent: "2px solid #3a3a3c",
};

const keyColors: Record<string, string> = {
  correct: "#538d4e",
  present: "#b59f3b",
  absent: "#3a3a3c",
  default: "#818384",
};

export default function GameWordle() {
  const [answer, setAnswer] = useState(() => getDailyWord());
  const [dailyNum] = useState(() => getDailyNumber());
  const [grid, setGrid] = useState<Tile[][]>(emptyGrid);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [keyMap, setKeyMap] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [shake] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flipping, setFlipping] = useState(false);

  const submitGuess = useCallback(() => {
    if (currentCol !== COLS || flipping) return;
    const guess = grid[currentRow].map(t => t.letter).join("");
    if (guess.length !== COLS) return;

    // evaluate
    const result: TileState[] = Array(COLS).fill("absent");
    const ansArr = answer.split("");
    const used = Array(COLS).fill(false);

    // correct pass
    for (let i = 0; i < COLS; i++) {
      if (guess[i] === ansArr[i]) { result[i] = "correct"; used[i] = true; }
    }
    // present pass
    for (let i = 0; i < COLS; i++) {
      if (result[i] === "correct") continue;
      const idx = ansArr.findIndex((c, j) => c === guess[i] && !used[j]);
      if (idx !== -1) { result[i] = "present"; used[idx] = true; }
    }

    setFlipping(true);
    // flip tiles one by one
    result.forEach((state, col) => {
      setTimeout(() => {
        setGrid(g => {
          const ng = g.map(r => r.map(t => ({ ...t })));
          ng[currentRow][col].flip = true;
          return ng;
        });
        setTimeout(() => {
          setGrid(g => {
            const ng = g.map(r => r.map(t => ({ ...t })));
            ng[currentRow][col].state = state;
            ng[currentRow][col].flip = false;
            return ng;
          });
          if (col === COLS - 1) {
            // update key map
            setKeyMap(km => {
              const nkm = { ...km };
              result.forEach((s, i) => {
                const k = guess[i];
                if (s === "correct") nkm[k] = "correct";
                else if (s === "present" && nkm[k] !== "correct") nkm[k] = "present";
                else if (!nkm[k]) nkm[k] = "absent";
              });
              return nkm;
            });
            const won = result.every(s => s === "correct");
            if (won) setStatus("won");
            else if (currentRow === ROWS - 1) setStatus("lost");
            else setCurrentRow(r => r + 1);
            setCurrentCol(0);
            setFlipping(false);
          }
        }, 300);
      }, col * 300);
    });
  }, [currentCol, currentRow, grid, answer, flipping]);

  const handleKey = useCallback((key: string) => {
    if (status !== "playing" || flipping) return;
    if (key === "ENTER") { submitGuess(); return; }
    if (key === "BACKSPACE" || key === "DELETE") {
      if (currentCol === 0) return;
      setGrid(g => {
        const ng = g.map(r => r.map(t => ({ ...t })));
        ng[currentRow][currentCol - 1] = { letter: "", state: "active", flip: false };
        if (currentCol - 1 === 0) ng[currentRow][0].state = "active";
        return ng;
      });
      setCurrentCol(c => c - 1);
      return;
    }
    if (/^[A-Z]$/.test(key) && currentCol < COLS) {
      setGrid(g => {
        const ng = g.map(r => r.map(t => ({ ...t })));
        ng[currentRow][currentCol] = { letter: key, state: "active", flip: false };
        return ng;
      });
      setCurrentCol(c => c + 1);
    }
  }, [status, flipping, currentCol, currentRow, submitGuess]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k === "ENTER" || k === "BACKSPACE" || /^[A-Z]$/.test(k)) handleKey(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey]);

  const reset = () => {
    setAnswer(getDailyWord());
    setGrid(emptyGrid());
    setCurrentRow(0);
    setCurrentCol(0);
    setKeyMap({});
    setStatus("playing");
    setCopied(false);
  };

  const share = () => {
    const emojiMap: Record<TileState, string> = { correct: "🟩", present: "🟨", absent: "⬛", empty: "⬛", active: "⬛" };
    const rows = grid.slice(0, currentRow + (status !== "playing" ? 1 : 0))
      .map(row => row.map(t => emojiMap[t.state]).join("")).join("\n");
    const text = `Wordle ${status === "won" ? currentRow : "X"}/${ROWS}\n\n${rows}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#121213", minHeight: "100vh", color: "#fff", fontFamily: "sans-serif", padding: "16px 8px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, margin: "0 0 4px" }}>WORDLE</h1>
      <div style={{ fontSize: 13, color: "#818384", marginBottom: 8 }}>Daily Wordle #{dailyNum}</div>
      <div style={{ height: 2, width: "100%", maxWidth: 360, background: "#3a3a3c", marginBottom: 16 }} />

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: 5, marginBottom: 16 }}>
        {grid.map((row, r) => (
          <div key={r} style={{ display: "flex", gap: 5, animation: shake && r === currentRow ? "shake 0.4s" : undefined }}>
            {row.map((tile, c) => (
              <div key={c} style={{
                width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, border: tileBorder[tile.state],
                background: tileColors[tile.state], color: "#fff",
                transition: "background 0.1s",
                transform: tile.flip ? "rotateX(90deg)" : "rotateX(0deg)",
                transitionProperty: "transform",
                transitionDuration: "0.3s",
              }}>
                {tile.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Status */}
      {status !== "playing" && (
        <div style={{ marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: status === "won" ? "#538d4e" : "#e74c3c", marginBottom: 4 }}>
            {status === "won" ? `You got it in ${currentRow}!` : `Answer: ${answer}`}
          </div>
          <div style={{ fontSize: 13, color: "#818384" }}>Come back tomorrow for a new word!</div>
        </div>
      )}

      {/* Keyboard */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {KEYS.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 5, justifyContent: "center" }}>
            {ri === 2 && (
              <button onClick={() => handleKey("ENTER")} style={keyStyle("#818384", 65)}>ENTER</button>
            )}
            {row.split("").map(k => (
              <button key={k} onClick={() => handleKey(k)}
                style={keyStyle(keyColors[keyMap[k] ?? "default"])}>
                {k}
              </button>
            ))}
            {ri === 2 && (
              <button onClick={() => handleKey("BACKSPACE")} style={keyStyle("#818384", 50)}>⌫</button>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={reset} style={{ padding: "10px 20px", background: "#538d4e", color: "#fff", border: "none", borderRadius: 4, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          New Game
        </button>
        {status !== "playing" && (
          <button onClick={share} style={{ padding: "10px 20px", background: "#b59f3b", color: "#fff", border: "none", borderRadius: 4, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            {copied ? "Copied!" : "Share"}
          </button>
        )}
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

function keyStyle(bg: string, width = 40): React.CSSProperties {
  return { width, height: 56, background: bg, color: "#fff", border: "none", borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background 0.3s" };
}

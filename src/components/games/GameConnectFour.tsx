"use client";
import { useState, useEffect, useCallback } from "react";

const ROWS = 6, COLS = 7, EMPTY = 0, RED = 1, YELLOW = 2;
type Board = number[][];
type WinCells = [number, number][] | null;

function makeBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

function drop(board: Board, col: number, player: number): Board | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) {
      const b = board.map(row => [...row]);
      b[r][col] = player;
      return b;
    }
  }
  return null;
}

function checkWin(board: Board, player: number): WinCells {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      for (const [dr, dc] of dirs) {
        const cells: [number,number][] = [[r,c]];
        for (let i = 1; i < 4; i++) {
          const nr = r + dr*i, nc = c + dc*i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return cells;
      }
    }
  }
  return null;
}

function isDraw(board: Board): boolean {
  return board[0].every(c => c !== EMPTY);
}

function score(board: Board): number {
  if (checkWin(board, YELLOW)) return 1000000;
  if (checkWin(board, RED)) return -1000000;
  let s = 0;
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of dirs) {
        let y = 0, red = 0, empty = 0;
        for (let i = 0; i < 4; i++) {
          const nr = r + dr*i, nc = c + dc*i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) { empty = -1; break; }
          if (board[nr][nc] === YELLOW) y++;
          else if (board[nr][nc] === RED) red++;
          else empty++;
        }
        if (empty < 0) continue;
        if (y > 0 && red === 0) s += y === 3 ? 50 : y === 2 ? 10 : 1;
        if (red > 0 && y === 0) s -= red === 3 ? 50 : red === 2 ? 10 : 1;
      }
    }
  }
  return s;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  if (checkWin(board, YELLOW)) return 1000000 + depth;
  if (checkWin(board, RED)) return -1000000 - depth;
  if (isDraw(board) || depth === 0) return score(board);
  if (maximizing) {
    let best = -Infinity;
    for (let c = 0; c < COLS; c++) {
      const b = drop(board, c, YELLOW);
      if (!b) continue;
      best = Math.max(best, minimax(b, depth - 1, alpha, beta, false));
      alpha = Math.max(alpha, best);
      if (alpha >= beta) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let c = 0; c < COLS; c++) {
      const b = drop(board, c, RED);
      if (!b) continue;
      best = Math.min(best, minimax(b, depth - 1, alpha, beta, true));
      beta = Math.min(beta, best);
      if (alpha >= beta) break;
    }
    return best;
  }
}

function bestMove(board: Board): number {
  let best = -Infinity, col = 3;
  for (let c = 0; c < COLS; c++) {
    const b = drop(board, c, YELLOW);
    if (!b) continue;
    const v = minimax(b, 5, -Infinity, Infinity, false);
    if (v > best) { best = v; col = c; }
  }
  return col;
}

export default function GameConnectFour() {
  const [board, setBoard] = useState<Board>(makeBoard);
  const [turn, setTurn] = useState<number>(RED);
  const [winCells, setWinCells] = useState<WinCells>(null);
  const [draw, setDraw] = useState(false);
  const [dropping, setDropping] = useState<{col: number, row: number} | null>(null);

  const isWinCell = (r: number, c: number) =>
    winCells?.some(([wr, wc]) => wr === r && wc === c) ?? false;

  const reset = useCallback(() => {
    setBoard(makeBoard());
    setTurn(RED);
    setWinCells(null);
    setDraw(false);
    setDropping(null);
  }, []);

  const handleCol = useCallback((col: number) => {
    if (turn !== RED || winCells || draw) return;
    const newBoard = drop(board, col, RED);
    if (!newBoard) return;
    // find row
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === EMPTY) { row = r; break; }
    }
    setDropping({ col, row });
    setBoard(newBoard);
    const w = checkWin(newBoard, RED);
    if (w) { setWinCells(w); setTurn(EMPTY); return; }
    if (isDraw(newBoard)) { setDraw(true); setTurn(EMPTY); return; }
    setTurn(YELLOW);
  }, [board, turn, winCells, draw]);

  useEffect(() => {
    if (turn !== YELLOW || winCells || draw) return;
    const t = setTimeout(() => {
      const col = bestMove(board);
      const newBoard = drop(board, col, YELLOW);
      if (!newBoard) return;
      let row = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === EMPTY) { row = r; break; }
      }
      setDropping({ col, row });
      setBoard(newBoard);
      const w = checkWin(newBoard, YELLOW);
      if (w) { setWinCells(w); setTurn(EMPTY); return; }
      if (isDraw(newBoard)) { setDraw(true); setTurn(EMPTY); return; }
      setTurn(RED);
    }, 300);
    return () => clearTimeout(t);
  }, [turn, board, winCells, draw]);

  const status = winCells
    ? (turn === EMPTY && checkWin(board, RED) ? "You win!" : "AI wins!")
    : draw ? "Draw!"
    : turn === RED ? "Your turn (Red)" : "AI thinking...";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:24, background:"#0f172a", minHeight:"100vh", color:"#e2e8f0", fontFamily:"sans-serif" }}>
      <h2 style={{ margin:0, fontSize:24, fontWeight:700 }}>Connect Four</h2>
      <div style={{ fontSize:16, color: winCells ? "#fbbf24" : draw ? "#94a3b8" : turn === RED ? "#ef4444" : "#facc15" }}>
        {status}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${COLS}, 56px)`, gap:6, background:"#1e3a8a", padding:12, borderRadius:12 }}>
        {Array.from({ length: COLS }, (_, c) => (
          <div
            key={c}
            onClick={() => handleCol(c)}
            style={{ cursor: turn === RED && !winCells && !draw ? "pointer" : "default", display:"contents" }}
          >
            {Array.from({ length: ROWS }, (_, r) => {
              const cell = board[r][c];
              const win = isWinCell(r, c);
              const isNew = dropping?.col === c && dropping?.row === r;
              return (
                <div
                  key={r}
                  onClick={() => handleCol(c)}
                  style={{
                    width:56, height:56, borderRadius:"50%",
                    background: cell === RED ? "#ef4444" : cell === YELLOW ? "#facc15" : "#0f172a",
                    border: win ? "3px solid #fff" : "3px solid transparent",
                    boxShadow: win ? "0 0 12px #fff" : "none",
                    transition: "background 0.15s",
                    animation: isNew ? "dropIn 0.2s ease-out" : "none",
                    cursor: turn === RED && !winCells && !draw ? "pointer" : "default",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <button
        onClick={reset}
        style={{ marginTop:8, padding:"10px 28px", background:"#3b82f6", color:"#fff", border:"none", borderRadius:8, fontSize:15, cursor:"pointer", fontWeight:600 }}
      >
        Reset
      </button>
      <style>{`@keyframes dropIn { from { transform: translateY(-40px); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>
    </div>
  );
}

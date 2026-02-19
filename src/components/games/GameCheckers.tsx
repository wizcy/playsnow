"use client";
import { useState, useCallback, useEffect } from "react";

type Player = "red" | "black";
type Piece = { player: Player; king: boolean } | null;
type Board = Piece[][];
type Pos = [number, number];
type Move = { from: Pos; to: Pos; jumps: Pos[] };

function initBoard(): Board {
  return Array.from({ length: 8 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) => {
      if ((r + c) % 2 === 1) {
        if (r < 3) return { player: "black" as Player, king: false };
        if (r > 4) return { player: "red" as Player, king: false };
      }
      return null;
    })
  );
}

function cloneBoard(b: Board): Board {
  return b.map((row) => row.map((p) => (p ? { ...p } : null)));
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getJumps(board: Board, r: number, c: number, piece: NonNullable<Piece>, visited: Set<string>): Move[] {
  const dirs = piece.king ? [-1, 1] : piece.player === "red" ? [-1] : [1];
  const moves: Move[] = [];
  for (const dr of dirs) {
    for (const dc of [-1, 1]) {
      const mr = r + dr, mc = c + dc;
      const lr = r + 2 * dr, lc = c + 2 * dc;
      if (!inBounds(lr, lc)) continue;
      const mid = board[mr]?.[mc];
      if (mid && mid.player !== piece.player && !board[lr][lc] && !visited.has(`${lr},${lc}`)) {
        moves.push({ from: [r, c], to: [lr, lc], jumps: [[mr, mc]] });
      }
    }
  }
  return moves;
}

function getSimpleMoves(board: Board, r: number, c: number, piece: NonNullable<Piece>): Move[] {
  const dirs = piece.king ? [-1, 1] : piece.player === "red" ? [-1] : [1];
  const moves: Move[] = [];
  for (const dr of dirs)
    for (const dc of [-1, 1]) {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && !board[nr][nc])
        moves.push({ from: [r, c], to: [nr, nc], jumps: [] });
    }
  return moves;
}

function getAllMoves(board: Board, player: Player): Move[] {
  const jumps: Move[] = [];
  const simple: Move[] = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.player !== player) continue;
      const j = getJumps(board, r, c, p, new Set<string>());
      jumps.push(...j);
      if (jumps.length === 0) simple.push(...getSimpleMoves(board, r, c, p));
    }
  return jumps.length > 0 ? jumps : simple;
}

function applyMove(board: Board, move: Move): Board {
  const b = cloneBoard(board);
  const piece = b[move.from[0]][move.from[1]]!;
  b[move.to[0]][move.to[1]] = piece;
  b[move.from[0]][move.from[1]] = null;
  for (const [jr, jc] of move.jumps) b[jr][jc] = null;
  if ((piece.player === "red" && move.to[0] === 0) || (piece.player === "black" && move.to[0] === 7))
    b[move.to[0]][move.to[1]] = { ...piece, king: true };
  return b;
}

function countPieces(board: Board) {
  let red = 0, black = 0;
  for (const row of board) for (const p of row) { if (p?.player === "red") red++; else if (p?.player === "black") black++; }
  return { red, black };
}

function evaluate(board: Board): number {
  let score = 0;
  for (const row of board) for (const p of row) {
    if (!p) continue;
    const v = p.king ? 3 : 1;
    score += p.player === "black" ? v : -v;
  }
  return score;
}

function minimax(board: Board, depth: number, alpha: number, beta: number, maximizing: boolean): number {
  const player: Player = maximizing ? "black" : "red";
  const moves = getAllMoves(board, player);
  if (depth === 0 || moves.length === 0) return evaluate(board);
  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      best = Math.max(best, minimax(applyMove(board, m), depth - 1, alpha, beta, false));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      best = Math.min(best, minimax(applyMove(board, m), depth - 1, alpha, beta, true));
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(board: Board): Move | null {
  const moves = getAllMoves(board, "black");
  if (moves.length === 0) return null;
  let best = -Infinity, bestMove = moves[0];
  for (const m of moves) {
    const score = minimax(applyMove(board, m), 3, -Infinity, Infinity, false);
    if (score > best) { best = score; bestMove = m; }
  }
  return bestMove;
}

export default function GameCheckers() {
  const [board, setBoard] = useState<Board>(initBoard);
  const [selected, setSelected] = useState<Pos | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [turn, setTurn] = useState<Player>("red");
  const [status, setStatus] = useState<string>("");
  const [thinking, setThinking] = useState(false);

  const reset = () => {
    setBoard(initBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn("red");
    setStatus("");
    setThinking(false);
  };

  const allMoves = useCallback((b: Board, p: Player) => getAllMoves(b, p), []);

  useEffect(() => {
    if (turn !== "black" || status) return;
    setThinking(true);
    const timer = setTimeout(() => {
      const move = getBestMove(board);
      if (!move) { setStatus("Red wins!"); setThinking(false); return; }
      const nb = applyMove(board, move);
      setBoard(nb);
      const { red } = countPieces(nb);
      if (red === 0) setStatus("Black wins!");
      else if (getAllMoves(nb, "red").length === 0) setStatus("Black wins!");
      else setStatus("");
      setTurn("red");
      setThinking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [turn, board, status]);

  const handleClick = useCallback((r: number, c: number) => {
    if (turn !== "red" || status || thinking) return;
    const piece = board[r][c];

    if (selected) {
      const move = validMoves.find((m) => m.to[0] === r && m.to[1] === c);
      if (move) {
        const nb = applyMove(board, move);
        // Check multi-jump
        if (move.jumps.length > 0) {
          const movedPiece = nb[r][c]!;
          const furtherJumps = getJumps(nb, r, c, movedPiece, new Set<string>([`${r},${c}`]));
          if (furtherJumps.length > 0) {
            setBoard(nb);
            setSelected([r, c]);
            setValidMoves(furtherJumps);
            return;
          }
        }
        const { red, black } = countPieces(nb);
        setBoard(nb);
        setSelected(null);
        setValidMoves([]);
        if (red === 0) { setStatus("Black wins!"); return; }
        if (black === 0) { setStatus("Red wins!"); return; }
        setTurn("black");
        return;
      }
      if (piece?.player === "red") {
        const moves = allMoves(board, "red").filter((m) => m.from[0] === r && m.from[1] === c);
        const allPlayerMoves = allMoves(board, "red");
        const hasJumps = allPlayerMoves.some((m) => m.jumps.length > 0);
        const pieceMoves = hasJumps ? moves.filter((m) => m.jumps.length > 0) : moves;
        if (pieceMoves.length > 0) { setSelected([r, c]); setValidMoves(pieceMoves); return; }
      }
      setSelected(null);
      setValidMoves([]);
      return;
    }

    if (piece?.player === "red") {
      const moves = allMoves(board, "red").filter((m) => m.from[0] === r && m.from[1] === c);
      const allPlayerMoves = allMoves(board, "red");
      const hasJumps = allPlayerMoves.some((m) => m.jumps.length > 0);
      const pieceMoves = hasJumps ? moves.filter((m) => m.jumps.length > 0) : moves;
      if (pieceMoves.length > 0) { setSelected([r, c]); setValidMoves(pieceMoves); }
    }
  }, [turn, status, thinking, board, selected, validMoves, allMoves]);

  const { red, black } = countPieces(board);
  const validDests = new Set(validMoves.map((m) => `${m.to[0]},${m.to[1]}`));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Checkers</h1>
        <span className="text-red-400">Red: {red}</span>
        <span className="text-gray-300">Black: {black}</span>
        <button onClick={reset} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">Reset</button>
      </div>
      <div className="mb-3 h-6 text-center">
        {status ? <span className="text-yellow-400 font-bold text-lg">{status}</span>
          : thinking ? <span className="text-gray-400">AI thinking...</span>
          : <span className="text-gray-300">{turn === "red" ? "Your turn (Red)" : "Black's turn"}</span>}
      </div>
      <div className="border-2 border-gray-600 inline-block">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((piece, c) => {
              const dark = (r + c) % 2 === 1;
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isValid = dark && validDests.has(`${r},${c}`);
              return (
                <div
                  key={c}
                  onClick={() => handleClick(r, c)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer
                    ${dark ? "bg-gray-700" : "bg-gray-200"}
                    ${isSelected ? "ring-2 ring-inset ring-yellow-400" : ""}
                    ${isValid ? "ring-2 ring-inset ring-green-400" : ""}`}
                >
                  {piece && (
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold
                      ${piece.player === "red" ? "bg-red-500 border-red-300" : "bg-gray-900 border-gray-500"}
                      ${isSelected ? "scale-110" : ""}`}>
                      {piece.king ? "♛" : ""}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

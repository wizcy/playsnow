"use client";
import { useState, useCallback } from "react";

type Suit = "♠" | "♥" | "♦" | "♣";
type Color = "red" | "black";
type Card = { suit: Suit; rank: number; faceUp: boolean; id: string };

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const suitColor = (s: Suit): Color => (s === "♥" || s === "♦" ? "red" : "black");
const rankLabel = (r: number) =>
  r === 1 ? "A" : r === 11 ? "J" : r === 12 ? "Q" : r === 13 ? "K" : String(r);

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS)
    for (let rank = 1; rank <= 13; rank++)
      deck.push({ suit, rank, faceUp: false, id: `${suit}${rank}` });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initGame() {
  const deck = buildDeck();
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] };
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }
  const stock = deck.slice(idx).map((c) => ({ ...c, faceUp: false }));
  return { tableau, stock, waste: [] as Card[], foundations: [[], [], [], []] as Card[][], moves: 0 };
}

type GameState = ReturnType<typeof initGame>;
type Selection = { area: "tableau" | "waste"; col?: number; cardIdx?: number } | null;

function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.rank === 1;
  const top = foundation[foundation.length - 1];
  return top.suit === card.suit && card.rank === top.rank + 1;
}

function canPlaceOnTableau(card: Card, col: Card[]): boolean {
  if (col.length === 0) return card.rank === 13;
  const top = col[col.length - 1];
  return top.faceUp && suitColor(card.suit) !== suitColor(top.suit) && card.rank === top.rank - 1;
}

export default function GameSolitaire() {
  const [state, setState] = useState<GameState>(initGame);
  const [selection, setSelection] = useState<Selection>(null);
  const [won, setWon] = useState(false);

  const checkWin = (foundations: Card[][]) => foundations.every((f) => f.length === 13);

  const reset = () => { setState(initGame()); setSelection(null); setWon(false); };

  const drawFromStock = useCallback(() => {
    setState((prev) => {
      const s = structuredClone(prev);
      if (s.stock.length === 0) {
        s.stock = s.waste.reverse().map((c) => ({ ...c, faceUp: false }));
        s.waste = [];
      } else {
        const card = s.stock.pop()!;
        card.faceUp = true;
        s.waste.push(card);
        s.moves++;
      }
      return s;
    });
    setSelection(null);
  }, []);

  const handleWasteClick = useCallback(() => {
    setSelection((prev) =>
      prev?.area === "waste" ? null : { area: "waste" }
    );
  }, []);

  const handleTableauClick = useCallback((col: number, cardIdx: number) => {
    setState((prev) => {
      const s = structuredClone(prev);
      const card = s.tableau[col][cardIdx];
      if (!card.faceUp) return prev;

      if (selection === null) return prev; // handled outside

      // Move from waste
      if (selection.area === "waste" && s.waste.length > 0) {
        const src = s.waste[s.waste.length - 1];
        if (canPlaceOnTableau(src, s.tableau[col])) {
          s.waste.pop();
          s.tableau[col].push({ ...src });
          s.moves++;
          return s;
        }
      }
      // Move from tableau
      if (selection.area === "tableau" && selection.col !== undefined && selection.cardIdx !== undefined) {
        const srcCol = selection.col;
        const srcIdx = selection.cardIdx;
        if (srcCol === col && srcIdx === cardIdx) return prev;
        const cards = s.tableau[srcCol].slice(srcIdx);
        if (cards.length > 0 && canPlaceOnTableau(cards[0], s.tableau[col])) {
          s.tableau[col].push(...cards);
          s.tableau[srcCol].splice(srcIdx);
          const last = s.tableau[srcCol];
          if (last.length > 0) last[last.length - 1].faceUp = true;
          s.moves++;
          return s;
        }
      }
      return prev;
    });
    setSelection(null);
  }, [selection]);

  const handleTableauSelect = useCallback((col: number, cardIdx: number) => {
    const card = state.tableau[col][cardIdx];
    if (!card.faceUp) return;
    if (selection?.area === "tableau" && selection.col === col && selection.cardIdx === cardIdx) {
      setSelection(null);
      return;
    }
    // Try to move to foundation first if single card
    if (state.tableau[col].length - 1 === cardIdx) {
      let moved = false;
      setState((prev) => {
        const s = structuredClone(prev);
        for (let f = 0; f < 4; f++) {
          if (canPlaceOnFoundation(s.tableau[col][cardIdx], s.foundations[f])) {
            s.foundations[f].push(s.tableau[col].pop()!);
            const last = s.tableau[col];
            if (last.length > 0) last[last.length - 1].faceUp = true;
            s.moves++;
            moved = true;
            if (checkWin(s.foundations)) setWon(true);
            return s;
          }
        }
        return prev;
      });
      if (moved) { setSelection(null); return; }
    }
    setSelection({ area: "tableau", col, cardIdx });
  }, [selection, state]);

  const handleFoundationClick = useCallback((fIdx: number) => {
    if (selection === null) return;
    setState((prev) => {
      const s = structuredClone(prev);
      let card: Card | undefined;
      if (selection.area === "waste") {
        card = s.waste[s.waste.length - 1];
        if (card && canPlaceOnFoundation(card, s.foundations[fIdx])) {
          s.waste.pop();
          s.foundations[fIdx].push(card);
          s.moves++;
          if (checkWin(s.foundations)) setWon(true);
          return s;
        }
      } else if (selection.area === "tableau" && selection.col !== undefined && selection.cardIdx !== undefined) {
        const col = s.tableau[selection.col];
        if (selection.cardIdx === col.length - 1) {
          card = col[col.length - 1];
          if (card && canPlaceOnFoundation(card, s.foundations[fIdx])) {
            col.pop();
            s.foundations[fIdx].push(card);
            if (col.length > 0) col[col.length - 1].faceUp = true;
            s.moves++;
            if (checkWin(s.foundations)) setWon(true);
            return s;
          }
        }
      }
      return prev;
    });
    setSelection(null);
  }, [selection]);

  const isSelected = (area: "tableau" | "waste", col?: number, cardIdx?: number) => {
    if (!selection) return false;
    if (selection.area !== area) return false;
    if (area === "waste") return true;
    return selection.col === col && selection.cardIdx !== undefined && cardIdx !== undefined && cardIdx >= selection.cardIdx;
  };

  const CardFace = ({ card, selected }: { card: Card; selected?: boolean }) => (
    <div className={`w-14 h-20 rounded border text-xs font-bold flex flex-col justify-between p-1 cursor-pointer select-none
      ${card.faceUp
        ? `bg-white ${suitColor(card.suit) === "red" ? "text-red-600" : "text-gray-900"} ${selected ? "ring-2 ring-yellow-400" : "border-gray-300"}`
        : "bg-blue-800 border-blue-600"}`}>
      {card.faceUp && (<><span>{rankLabel(card.rank)}{card.suit}</span><span className="self-end rotate-180">{rankLabel(card.rank)}{card.suit}</span></>)}
    </div>
  );

  const EmptyPile = ({ label, onClick, highlight }: { label: string; onClick?: () => void; highlight?: boolean }) => (
    <div onClick={onClick} className={`w-14 h-20 rounded border-2 border-dashed flex items-center justify-center text-xs cursor-pointer select-none
      ${highlight ? "border-yellow-400 text-yellow-400" : "border-gray-600 text-gray-600"}`}>
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Solitaire</h1>
        <span className="text-gray-400">Moves: {state.moves}</span>
        <button onClick={reset} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">Reset</button>
      </div>

      {won && <div className="mb-4 text-2xl font-bold text-yellow-400">You Win! 🎉</div>}

      {/* Top row: stock, waste, foundations */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {/* Stock */}
        <div onClick={drawFromStock} className="cursor-pointer">
          {state.stock.length > 0
            ? <div className="w-14 h-20 rounded border-2 border-blue-600 bg-blue-800 flex items-center justify-center text-white text-lg cursor-pointer select-none">🂠</div>
            : <EmptyPile label="↺" onClick={drawFromStock} />}
        </div>
        {/* Waste */}
        <div onClick={state.waste.length > 0 ? handleWasteClick : undefined}>
          {state.waste.length > 0
            ? <CardFace card={state.waste[state.waste.length - 1]} selected={isSelected("waste")} />
            : <EmptyPile label="" />}
        </div>
        <div className="w-4" />
        {/* Foundations */}
        {state.foundations.map((f, i) => (
          <div key={i} onClick={() => handleFoundationClick(i)}>
            {f.length > 0
              ? <CardFace card={f[f.length - 1]} selected={false} />
              : <EmptyPile label={SUITS[i]} onClick={() => handleFoundationClick(i)} highlight={selection !== null} />}
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="flex gap-2 justify-center flex-wrap">
        {state.tableau.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col" style={{ minWidth: "3.5rem" }}>
            {col.length === 0
              ? <EmptyPile label="" onClick={() => selection && handleTableauClick(colIdx, 0)} highlight={selection !== null && col.length === 0} />
              : col.map((card, cardIdx) => (
                <div
                  key={card.id}
                  style={{ marginTop: cardIdx === 0 ? 0 : "-60px", zIndex: cardIdx, position: "relative" }}
                  onClick={() => {
                    if (selection && selection.area !== "tableau") {
                      handleTableauClick(colIdx, cardIdx);
                    } else if (selection?.area === "tableau" && (selection.col !== colIdx || selection.cardIdx !== cardIdx)) {
                      handleTableauClick(colIdx, cardIdx);
                    } else {
                      handleTableauSelect(colIdx, cardIdx);
                    }
                  }}
                >
                  <CardFace card={card} selected={isSelected("tableau", colIdx, cardIdx)} />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

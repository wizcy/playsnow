"use client";
import { useState, useEffect } from "react";

const EMOJIS = ["🎮","🎲","🎯","🏆","⭐","🔥","💎","🎪"];
const shuffle = () => [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);

export default function GameMemoryMatch() {
  const [cards, setCards] = useState(shuffle);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const click = (i: number) => {
    if (locked || flipped.includes(i) || matched.has(i)) return;
    setFlipped(prev => [...prev, i]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      if (cards[flipped[0]] === cards[flipped[1]]) {
        setMatched(prev => { const s = new Set(prev); flipped.forEach(f => s.add(f)); return s; });
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  }, [flipped, cards]);

  const won = matched.size === cards.length;
  const reset = () => { setCards(shuffle()); setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false); };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, color:"#e2e8f0" }}>
      <style>{`
        .mc { width:64px; height:64px; cursor:pointer; perspective:600px; }
        .mc-inner {
          width:100%; height:100%; position:relative;
          transform-style:preserve-3d; transition:transform 0.4s ease; border-radius:8px;
        }
        .mc.flipped .mc-inner { transform:rotateY(180deg); }
        .mc-f, .mc-b {
          position:absolute; inset:0; display:flex; align-items:center;
          justify-content:center; border-radius:8px;
          backface-visibility:hidden; -webkit-backface-visibility:hidden; font-size:1.5rem;
        }
        .mc-f { background:#1e40af; }
        .mc-b { background:#374151; transform:rotateY(180deg); }
        .mc.matched .mc-b { background:#065f46; }
      `}</style>
      <div style={{ display:"flex", justifyContent:"space-between", width:"100%", maxWidth:300 }}>
        <span style={{ fontSize:"1.1rem", fontWeight:"bold" }}>Moves: {moves}</span>
        <button onClick={reset} style={{ background:"#374151", border:"none", color:"#e2e8f0", padding:"4px 12px", borderRadius:6, cursor:"pointer" }}>
          New Game
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,64px)", gap:8 }}>
        {cards.map((emoji, i) => (
          <div key={i}
            className={`mc${flipped.includes(i) || matched.has(i) ? " flipped" : ""}${matched.has(i) ? " matched" : ""}`}
            onClick={() => click(i)}>
            <div className="mc-inner">
              <div className="mc-f">?</div>
              <div className="mc-b">{emoji}</div>
            </div>
          </div>
        ))}
      </div>
      {won && <div style={{ color:"#34d399", fontWeight:"bold", fontSize:"1.25rem" }}>You Win! {moves} moves</div>}
    </div>
  );
}

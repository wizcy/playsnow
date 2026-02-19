"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { saveScore, getScore } from "@/lib/scores";

type P = { x: number; y: number };
const SIZE = 20;
const BASE_MS = 150;

function randFood(snake: P[]): P {
  let f: P;
  do { f = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

export default function GameSnake() {
  const [snake, setSnake] = useState<P[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<P>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => getScore("snake"));
  const [dead, setDead] = useState(false);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);

  const dir = useRef<P>({ x: 1, y: 0 });
  const next = useRef<P>({ x: 1, y: 0 });
  const refs = useRef({ snake, food, score, dead, paused });
  refs.current = { snake, food, score, dead, paused };

  const touch = useRef<{ x: number; y: number } | null>(null);

  const reset = useCallback(() => {
    const s = [{ x: 10, y: 10 }];
    dir.current = { x: 1, y: 0 };
    next.current = { x: 1, y: 0 };
    setSnake(s);
    setFood(randFood(s));
    setScore(0);
    setDead(false);
    setPaused(false);
    setStarted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (refs.current.dead) { reset(); return; }
        if (!started) { reset(); return; }
        setPaused(p => !p);
        return;
      }
      const map: Record<string, P> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (d && !(d.x === -dir.current.x && d.y === -dir.current.y)) {
        next.current = d;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset, started]);

  useEffect(() => {
    if (!started || dead || paused) return;
    const ms = Math.max(60, BASE_MS - Math.floor(score / 50) * 15);
    const id = setInterval(() => {
      const { snake: s, food: f, dead: d, paused: p } = refs.current;
      if (d || p) return;
      dir.current = next.current;
      const head = { x: s[0].x + dir.current.x, y: s[0].y + dir.current.y };
      if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE ||
          s.some(c => c.x === head.x && c.y === head.y)) {
        setDead(true);
          setBest(b => { const nb = Math.max(b, refs.current.score); saveScore("snake", nb); return nb; });
          return;
      }
      const ate = head.x === f.x && head.y === f.y;
      const ns = [head, ...s.slice(0, ate ? undefined : -1)];
      setSnake(ns);
      if (ate) { setScore(sc => sc + 10); setFood(randFood(ns)); }
    }, ms);
    return () => clearInterval(id);
  }, [started, dead, paused, score]);

  const cell = 100 / SIZE;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: "monospace" }}>
      <div style={{ color: "#aaa", fontSize: 14 }}>
        Score: <span style={{ color: "#fff", fontWeight: 700 }}>{score}</span>
        <span style={{ color: "#aaa", marginLeft: 12 }}>Best: <span style={{ color: "#fff", fontWeight: 700 }}>{best}</span></span>
        {started && !dead && <span style={{ color: "#555", marginLeft: 16, fontSize: 12 }}>Space to {paused ? "resume" : "pause"}</span>}
      </div>
      <div
        onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={e => {
          if (!touch.current) return;
          const dx = e.changedTouches[0].clientX - touch.current.x;
          const dy = e.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
          let d: P;
          if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
          else d = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
          if (!(d.x === -dir.current.x && d.y === -dir.current.y)) next.current = d;
        }}
        style={{
          position: "relative", width: "min(80vw, 400px)", aspectRatio: "1",
          background: "#0d0d0d", border: "2px solid #2a2a2a", borderRadius: 8, overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: `${food.x * cell}%`, top: `${food.y * cell}%`, width: `${cell}%`, height: `${cell}%`, background: "#e53", borderRadius: "50%", boxSizing: "border-box", padding: 1 }} />
        {snake.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: `${s.x * cell}%`, top: `${s.y * cell}%`, width: `${cell}%`, height: `${cell}%`, background: i === 0 ? "#4f4" : "#2a2", borderRadius: i === 0 ? 3 : 2, boxSizing: "border-box" }} />
        ))}
        {!started && (
          <div style={overlay}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>Snake</div>
            <div style={{ color: "#888", fontSize: 13 }}>Arrow keys / WASD or swipe</div>
            <button onClick={reset} style={btn}>Start</button>
          </div>
        )}
        {dead && (
          <div style={overlay}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#e53" }}>Game Over</div>
            <div style={{ color: "#fff", fontSize: 16 }}>Score: {score}</div>
            <button onClick={reset} style={btn}>Restart</button>
          </div>
        )}
        {paused && !dead && (
          <div style={overlay}>
            <div style={{ fontSize: 20, color: "#fff" }}>Paused</div>
            <div style={{ color: "#666", fontSize: 13 }}>Space to resume</div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
};
const btn: React.CSSProperties = {
  marginTop: 6, padding: "8px 28px", background: "#2a2", color: "#fff",
  border: "none", borderRadius: 6, cursor: "pointer", fontSize: 15, fontWeight: 600,
};

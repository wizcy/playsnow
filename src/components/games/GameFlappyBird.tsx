"use client";
import { useEffect, useRef, useState } from "react";
import { saveScore } from "@/lib/scores";

const W = 400, H = 500, GRAVITY = 0.45, JUMP = -8, PIPE_W = 52, GAP = 130, PIPE_SPEED = 2.5, BIRD_X = 70, BIRD_R = 13;

type Pipe = { x: number; topH: number; scored: boolean };
type State = { y: number; vy: number; pipes: Pipe[]; score: number; phase: "idle" | "playing" | "dead" };

function initState(): State {
  return { y: H / 2, vy: 0, pipes: [], score: 0, phase: "idle" };
}

export default function GameFlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>(initState());
  const [, setPhase] = useState<"idle" | "playing" | "dead">("idle");
  const [, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("flappy_best") || "0", 10);
  });

  const flap = () => {
    const s = stateRef.current;
    if (s.phase === "dead") {
      stateRef.current = { ...initState(), phase: "playing" };
      setScore(0);
      setPhase("playing");
    } else if (s.phase === "idle") {
      stateRef.current = { ...initState(), phase: "playing" };
      setPhase("playing");
    } else {
      s.vy = JUMP;
    }
  };

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); flap(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let frame = 0;

    const draw = () => {
      const s = stateRef.current;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);

      // pipes
      for (const p of s.pipes) {
        const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
        grad.addColorStop(0, "#16a34a");
        grad.addColorStop(1, "#4ade80");
        ctx.fillStyle = grad;
        // top pipe
        ctx.beginPath(); ctx.roundRect(p.x, 0, PIPE_W, p.topH, [0, 0, 6, 6]); ctx.fill();
        // cap
        ctx.fillRect(p.x - 4, p.topH - 14, PIPE_W + 8, 14);
        // bottom pipe
        ctx.beginPath(); ctx.roundRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP, [6, 6, 0, 0]); ctx.fill();
        ctx.fillRect(p.x - 4, p.topH + GAP, PIPE_W + 8, 14);
      }

      // bird
      const angle = Math.min(Math.max(s.vy * 0.06, -0.5), 1.2);
      ctx.save();
      ctx.translate(BIRD_X, s.y);
      ctx.rotate(angle);
      // body
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath(); ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2); ctx.fill();
      // wing
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath(); ctx.ellipse(-4, 3, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
      // eye
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(5, -4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.arc(6, -4, 2, 0, Math.PI * 2); ctx.fill();
      // beak
      ctx.fillStyle = "#f97316";
      ctx.beginPath(); ctx.moveTo(10, -1); ctx.lineTo(17, 1); ctx.lineTo(10, 3); ctx.closePath(); ctx.fill();
      ctx.restore();

      // score
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 28px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(String(s.score), W / 2, 44);

      // overlays
      if (s.phase === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 36px system-ui";
        ctx.fillText("Flappy Bird", W / 2, H / 2 - 40);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "18px system-ui";
        ctx.fillText("Tap / Click / Space to start", W / 2, H / 2 + 10);
        if (best > 0) {
          ctx.fillStyle = "#64748b";
          ctx.font = "15px system-ui";
          ctx.fillText(`Best: ${best}`, W / 2, H / 2 + 40);
        }
      }

      if (s.phase === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#f87171";
        ctx.font = "bold 36px system-ui";
        ctx.fillText("Game Over", W / 2, H / 2 - 50);
        ctx.fillStyle = "#fff";
        ctx.font = "22px system-ui";
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2);
        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px system-ui";
        ctx.fillText(`Best: ${best}`, W / 2, H / 2 + 30);
        ctx.fillStyle = "#64748b";
        ctx.font = "15px system-ui";
        ctx.fillText("Tap / Click / Space to restart", W / 2, H / 2 + 62);
      }
    };

    const loop = () => {
      const s = stateRef.current;

      if (s.phase === "playing") {
        s.vy += GRAVITY;
        s.y += s.vy;
        frame++;

        if (frame % 85 === 0) {
          s.pipes.push({ x: W, topH: 50 + Math.random() * (H - GAP - 100), scored: false });
        }
        s.pipes.forEach(p => { p.x -= PIPE_SPEED; });
        s.pipes = s.pipes.filter(p => p.x + PIPE_W > -10);

        // score
        for (const p of s.pipes) {
          if (!p.scored && p.x + PIPE_W < BIRD_X - BIRD_R) {
            p.scored = true;
            s.score++;
            setScore(s.score);
          }
        }

        // collision
        const dead =
          s.y + BIRD_R > H ||
          s.y - BIRD_R < 0 ||
          s.pipes.some(p =>
            BIRD_X + BIRD_R > p.x + 4 &&
            BIRD_X - BIRD_R < p.x + PIPE_W - 4 &&
            (s.y - BIRD_R < p.topH || s.y + BIRD_R > p.topH + GAP)
          );

        if (dead) {
          s.phase = "dead";
          setPhase("dead");
          setBest(prev => {
            const nb = Math.max(prev, s.score);
            localStorage.setItem("flappy_best", String(nb));
            saveScore("flappy-bird", nb);
            return nb;
          });
        }
      }

      draw();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={flap}
        onTouchStart={e => { e.preventDefault(); flap(); }}
        className="rounded-xl border border-slate-700 cursor-pointer"
        style={{ touchAction: "none" }}
      />
      <p className="text-slate-500 text-sm">Space / Click / Tap to flap</p>
    </div>
  );
}

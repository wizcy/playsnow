"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 10;
const ROWS = 5;
const BRICK_H = 20;
const BRICK_PAD = 4;
const PADDLE_H = 10;
const BALL_R = 8;
const ROW_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

interface GameState {
  score: number;
  lives: number;
  level: number;
  status: "idle" | "playing" | "paused" | "won" | "lost";
}

export default function GameBreakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    paddle: { x: 0, w: 80 },
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    bricks: [] as { x: number; y: number; w: number; alive: boolean; color: string }[],
    score: 0,
    lives: 3,
    level: 1,
    status: "idle" as GameState["status"],
    animId: 0,
    canvasW: 0,
    canvasH: 0,
  });
  const [display, setDisplay] = useState<GameState>({ score: 0, lives: 3, level: 1, status: "idle" });

  const syncDisplay = () => {
    const s = stateRef.current;
    setDisplay({ score: s.score, lives: s.lives, level: s.level, status: s.status });
  };

  const initBricks = (w: number) => {
    const brickW = (w - BRICK_PAD * (COLS + 1)) / COLS;
    const bricks = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.push({
          x: BRICK_PAD + c * (brickW + BRICK_PAD),
          y: 40 + r * (BRICK_H + BRICK_PAD),
          w: brickW,
          alive: true,
          color: ROW_COLORS[r],
        });
      }
    }
    return bricks;
  };

  const startGame = useCallback((level = 1, lives = 3, score = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const s = stateRef.current;
    s.canvasW = w;
    s.canvasH = h;
    s.score = score;
    s.lives = lives;
    s.level = level;
    s.paddle = { x: w / 2 - 40, w: 80 };
    const speed = 4 + level * 0.8;
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.5;
    s.ball = { x: w / 2, y: h - 60, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
    s.bricks = initBricks(w);
    s.status = "playing";
    syncDisplay();
    cancelAnimationFrame(s.animId);
    loop();
  }, []);

  const loop = () => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    update();
    draw();
    s.animId = requestAnimationFrame(loop);
  };

  const update = () => {
    const s = stateRef.current;
    const { canvasW: W, canvasH: H } = s;
    let { x, y, vx, vy } = s.ball;

    x += vx; y += vy;

    // Wall bounce
    if (x - BALL_R < 0) { x = BALL_R; vx = Math.abs(vx); }
    if (x + BALL_R > W) { x = W - BALL_R; vx = -Math.abs(vx); }
    if (y - BALL_R < 0) { y = BALL_R; vy = Math.abs(vy); }

    // Paddle bounce
    const px = s.paddle.x, pw = s.paddle.w;
    const paddleY = H - 30;
    if (vy > 0 && y + BALL_R >= paddleY && y + BALL_R <= paddleY + PADDLE_H && x >= px && x <= px + pw) {
      const rel = (x - (px + pw / 2)) / (pw / 2);
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = rel * (Math.PI / 3);
      vx = Math.sin(angle) * speed;
      vy = -Math.abs(Math.cos(angle) * speed);
      y = paddleY - BALL_R;
    }

    // Brick collision
    for (const b of s.bricks) {
      if (!b.alive) continue;
      if (x + BALL_R > b.x && x - BALL_R < b.x + b.w && y + BALL_R > b.y && y - BALL_R < b.y + BRICK_H) {
        b.alive = false;
        s.score += 10;
        const overlapL = x + BALL_R - b.x;
        const overlapR = b.x + b.w - (x - BALL_R);
        const overlapT = y + BALL_R - b.y;
        const overlapB = b.y + BRICK_H - (y - BALL_R);
        const minH = Math.min(overlapL, overlapR);
        const minV = Math.min(overlapT, overlapB);
        if (minH < minV) vx = -vx; else vy = -vy;
        break;
      }
    }

    // Lost ball
    if (y - BALL_R > H) {
      s.lives--;
      if (s.lives <= 0) {
        s.status = "lost";
        cancelAnimationFrame(s.animId);
        draw();
        syncDisplay();
        return;
      }
      const speed = 4 + s.level * 0.8;
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.5;
      s.ball = { x: W / 2, y: H - 60, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
      syncDisplay();
      return;
    }

    // Level clear
    if (s.bricks.every(b => !b.alive)) {
      s.status = "won";
      cancelAnimationFrame(s.animId);
      draw();
      syncDisplay();
      return;
    }

    s.ball = { x, y, vx, vy };
    if (s.score !== display.score || s.lives !== display.lives) syncDisplay();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;
    const { canvasW: W, canvasH: H } = s;

    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, W, H);

    // Bricks
    for (const b of s.bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.w, BRICK_H, 3);
      ctx.fill();
    }

    // Paddle
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.roundRect(s.paddle.x, H - 30, s.paddle.w, PADDLE_H, 5);
    ctx.fill();

    // Ball
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();

    // Overlay
    if (s.status === "lost" || s.status === "won" || s.status === "idle") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      const msg = s.status === "won" ? "Level Clear!" : s.status === "lost" ? "Game Over" : "Breakout";
      ctx.fillText(msg, W / 2, H / 2 - 10);
      ctx.font = "16px sans-serif";
      ctx.fillText("Click Reset to play", W / 2, H / 2 + 20);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mx = (e.clientX - rect.left) * scaleX;
    const s = stateRef.current;
    s.paddle.x = Math.max(0, Math.min(s.canvasW - s.paddle.w, mx - s.paddle.w / 2));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mx = (e.touches[0].clientX - rect.left) * scaleX;
    const s = stateRef.current;
    s.paddle.x = Math.max(0, Math.min(s.canvasW - s.paddle.w, mx - s.paddle.w / 2));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth;
      canvas.height = Math.min(500, parent.clientWidth * 0.75);
      stateRef.current.canvasW = canvas.width;
      stateRef.current.canvasH = canvas.height;
      draw();
    };
    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    return () => { ro.disconnect(); cancelAnimationFrame(stateRef.current.animId); };
  }, []);

  const handleReset = () => {
    if (display.status === "won") {
      startGame(display.level + 1, display.lives, display.score);
    } else {
      startGame(1, 3, 0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full select-none">
      <div className="flex gap-6 text-sm font-mono text-gray-300">
        <span>Level <span className="text-white font-bold">{display.level}</span></span>
        <span>Score <span className="text-yellow-400 font-bold">{display.score}</span></span>
        <span>Lives <span className="text-red-400 font-bold">{"♥".repeat(display.lives)}</span></span>
      </div>
      <div className="w-full max-w-2xl">
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg cursor-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        />
      </div>
      <button
        onClick={handleReset}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        {display.status === "won" ? `Next Level (${display.level + 1})` : "Reset"}
      </button>
    </div>
  );
}

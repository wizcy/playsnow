"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const CELL = 20;
const MAZE = [
  "####################",
  "#........##........#",
  "#.##.###.##.###.##.#",
  "#O##.###.##.###.##O#",
  "#.##.###.##.###.##.#",
  "#..................#",
  "#.##.##.####.##.##.#",
  "#.##.##.####.##.##.#",
  "#....##....####....#",
  "####.###.##.###.####",
  "####.###.##.###.####",
  "####.##........####",
  "####.##.####.##.####",
  "####.##.#  #.##.####",
  "     ...#  #...     ",
  "####.##.####.##.####",
  "####.##......##.####",
  "####.##.####.##.####",
  "####.###.##.###.####",
  "#........##........#",
  "#.##.###.##.###.##.#",
  "#O.##............##O#",
  "###.##.##.##.##.##.##",
  "#......##....##......#",
  "#.######.##.######.#",
  "#..................#",
  "#.##.##.####.##.##.#",
  "#....##....####....#",
  "#..................#",
  "####################",
];

// Normalize maze to 20 cols x 30 rows
const ROWS = MAZE.length;
const COLS = 20;
const W = COLS * CELL;
const H = ROWS * CELL;

function parseMaze() {
  const walls: boolean[][] = [];
  const dots = new Set<string>();
  const pellets = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    walls[r] = [];
    for (let c = 0; c < COLS; c++) {
      const ch = MAZE[r][c] ?? " ";
      walls[r][c] = ch === "#";
      if (ch === ".") dots.add(`${c},${r}`);
      if (ch === "O") pellets.add(`${c},${r}`);
    }
  }
  return { walls, dots, pellets };
}

type Vec = { x: number; y: number };
type Ghost = { x: number; y: number; scared: boolean; flash: boolean; lastDir: Vec };

interface State {
  pac: Vec;
  nextDir: Vec;
  dir: Vec;
  ghosts: Ghost[];
  walls: boolean[][];
  dots: Set<string>;
  pellets: Set<string>;
  score: number;
  lives: number;
  level: number;
  over: boolean;
  won: boolean;
  scaredTimer: number;
  tick: number;
  mouthAngle: number;
  mouthOpen: boolean;
}

const GHOST_STARTS: Vec[] = [{ x: 9, y: 13 }, { x: 10, y: 13 }];
const PAC_START: Vec = { x: 10, y: 23 };
const SCARED_DURATION = 300; // ticks
const FLASH_START = 100;

function makeGhosts(): Ghost[] {
  return GHOST_STARTS.map(p => ({ ...p, scared: false, flash: false, lastDir: { x: 1, y: 0 } }));
}

function canMove(walls: boolean[][], x: number, y: number) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
  return !walls[y][x];
}

function chaseDir(g: Ghost, target: Vec, walls: boolean[][]): Vec {
  const dirs: Vec[] = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
  const valid = dirs.filter(d => {
    if (d.x === -g.lastDir.x && d.y === -g.lastDir.y) return false; // no 180
    return canMove(walls, g.x + d.x, g.y + d.y);
  });
  if (!valid.length) return { x: -g.lastDir.x, y: -g.lastDir.y };
  if (g.scared) return valid[Math.floor(Math.random() * valid.length)];
  return valid.reduce((best, d) => {
    const nx = g.x + d.x, ny = g.y + d.y;
    const dist = Math.abs(nx - target.x) + Math.abs(ny - target.y);
    const bdist = Math.abs(g.x + best.x - target.x) + Math.abs(g.y + best.y - target.y);
    return dist < bdist ? d : best;
  });
}

export default function GamePacman() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const stateRef = useRef<State | null>(null);

  const initState = useCallback((lvl = 1): State => {
    const { walls, dots, pellets } = parseMaze();
    return {
      pac: { ...PAC_START },
      nextDir: { x: -1, y: 0 },
      dir: { x: -1, y: 0 },
      ghosts: makeGhosts(),
      walls, dots, pellets,
      score: stateRef.current?.score ?? 0,
      lives: stateRef.current?.lives ?? 3,
      level: lvl,
      over: false, won: false,
      scaredTimer: 0, tick: 0,
      mouthAngle: 0.25, mouthOpen: true,
    };
  }, []);

  const newGame = useCallback(() => {
    const s = initState(1);
    s.score = 0; s.lives = 3;
    stateRef.current = s;
    setScore(0); setLives(3); setLevel(1); setOver(false); setWon(false);
  }, [initState]);

  useEffect(() => { newGame(); }, [newGame]);

  // Keyboard
  useEffect(() => {
    const map: Record<string, Vec> = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
    };
    const h = (e: KeyboardEvent) => {
      if (map[e.key]) { e.preventDefault(); if (stateRef.current) stateRef.current.nextDir = map[e.key]; }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = setInterval(() => {
      const s = stateRef.current;
      if (!s || s.over || s.won) return;
      s.tick++;

      // Pac-Man speed: level increases speed slightly
      const speed = Math.max(1, 3 - Math.floor(s.level / 3));
      if (s.tick % speed !== 0) { draw(ctx, s); return; }

      // Try next direction first
      const nd = s.nextDir;
      if (canMove(s.walls, s.pac.x + nd.x, s.pac.y + nd.y)) s.dir = nd;

      const nx = s.pac.x + s.dir.x, ny = s.pac.y + s.dir.y;
      if (canMove(s.walls, nx, ny)) { s.pac = { x: nx, y: ny }; }

      // Mouth animation
      if (s.mouthOpen) { s.mouthAngle += 0.05; if (s.mouthAngle >= 0.25) s.mouthOpen = false; }
      else { s.mouthAngle -= 0.05; if (s.mouthAngle <= 0) s.mouthOpen = true; }

      // Eat dot
      const dk = `${s.pac.x},${s.pac.y}`;
      if (s.dots.has(dk)) { s.dots.delete(dk); s.score += 10; setScore(s.score); }
      if (s.pellets.has(dk)) {
        s.pellets.delete(dk); s.score += 50; setScore(s.score);
        s.scaredTimer = SCARED_DURATION;
        s.ghosts.forEach(g => { g.scared = true; g.flash = false; });
      }

      // Scared timer
      if (s.scaredTimer > 0) {
        s.scaredTimer--;
        if (s.scaredTimer < FLASH_START) s.ghosts.forEach(g => { if (g.scared) g.flash = (s.scaredTimer % 20 < 10); });
        if (s.scaredTimer === 0) s.ghosts.forEach(g => { g.scared = false; g.flash = false; });
      }

      // Ghost movement (slower than pac)
      const ghostSpeed = Math.max(2, 4 - Math.floor(s.level / 3));
      if (s.tick % ghostSpeed === 0) {
        s.ghosts.forEach((g, i) => {
          // Ghost 0 chases pac, ghost 1 targets ahead of pac
          const target = i === 0 ? s.pac : { x: s.pac.x + s.dir.x * 4, y: s.pac.y + s.dir.y * 4 };
          const d = chaseDir(g, target, s.walls);
          g.x += d.x; g.y += d.y; g.lastDir = d;
        });
      }

      // Collision
      for (const g of s.ghosts) {
        if (g.x === s.pac.x && g.y === s.pac.y) {
          if (g.scared) {
            g.scared = false; g.flash = false;
            g.x = GHOST_STARTS[s.ghosts.indexOf(g)].x;
            g.y = GHOST_STARTS[s.ghosts.indexOf(g)].y;
            s.score += 200; setScore(s.score);
          } else {
            s.lives--;
            setLives(s.lives);
            if (s.lives <= 0) { s.over = true; setOver(true); }
            else {
              s.pac = { ...PAC_START };
              s.dir = { x: -1, y: 0 }; s.nextDir = { x: -1, y: 0 };
              s.ghosts = makeGhosts();
              s.scaredTimer = 0;
            }
            break;
          }
        }
      }

      // Win condition
      if (s.dots.size === 0 && s.pellets.size === 0) {
        s.level++;
        setLevel(s.level);
        const next = initState(s.level);
        next.score = s.score; next.lives = s.lives;
        stateRef.current = next;
      }

      draw(ctx, s);
    }, 16);

    return () => clearInterval(loop);
  }, [initState]);

  function draw(ctx: CanvasRenderingContext2D, s: State) {
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, W, H);

    // Walls
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (s.walls[r][c]) {
          ctx.fillStyle = "#1a3a6e";
          ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
          ctx.strokeStyle = "#2255aa";
          ctx.strokeRect(c * CELL + 0.5, r * CELL + 0.5, CELL - 1, CELL - 1);
        }
      }
    }

    // Dots
    s.dots.forEach(k => {
      const [x, y] = k.split(",").map(Number);
      ctx.fillStyle = "#ffddaa";
      ctx.beginPath();
      ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Power pellets
    s.pellets.forEach(k => {
      const [x, y] = k.split(",").map(Number);
      const pulse = 0.5 + 0.5 * Math.sin(s.tick * 0.15);
      ctx.fillStyle = `rgba(255,200,50,${0.7 + 0.3 * pulse})`;
      ctx.beginPath();
      ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, 5 + pulse, 0, Math.PI * 2);
      ctx.fill();
    });

    // Pac-Man
    const px = s.pac.x * CELL + CELL / 2, py = s.pac.y * CELL + CELL / 2;
    const angle = Math.atan2(s.dir.y, s.dir.x);
    const mouth = s.mouthAngle * Math.PI;
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, CELL / 2 - 1, angle + mouth, angle + Math.PI * 2 - mouth);
    ctx.closePath();
    ctx.fill();

    // Ghosts
    const ghostColors = ["#ef4444", "#f97316"];
    s.ghosts.forEach((g, i) => {
      const gx = g.x * CELL + CELL / 2, gy = g.y * CELL + CELL / 2;
      const r = CELL / 2 - 1;
      let color = ghostColors[i];
      if (g.scared) color = g.flash ? "#ffffff" : "#3b82f6";

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, r, Math.PI, 0);
      // Wavy bottom
      const base = gy - 2 + r;
      ctx.lineTo(gx + r, base);
      const waves = 3;
      for (let w = 0; w < waves; w++) {
        const wx = gx + r - (w * 2 * r / waves);
        ctx.quadraticCurveTo(wx - r / waves, base + 4, wx - 2 * r / waves, base);
      }
      ctx.lineTo(gx - r, base);
      ctx.closePath();
      ctx.fill();

      // Eyes
      if (!g.scared) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(gx - 3, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(gx + 3, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#00f";
        ctx.beginPath(); ctx.arc(gx - 3, gy - 4, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(gx + 3, gy - 4, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  // Touch swipe
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex justify-between w-full max-w-xs text-sm">
        <span className="font-bold text-yellow-400">Score: {score}</span>
        <span className="text-gray-300">Level: {level}</span>
        <span className="text-red-400">{"♥".repeat(lives)}{"♡".repeat(Math.max(0, 3 - lives))}</span>
        <button onClick={newGame} className="bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-600 text-xs">New</button>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-xl border border-gray-700"
        style={{ touchAction: "none", maxWidth: "100%" }}
        onTouchStart={e => { const t = e.touches[0]; touchStart.current = { x: t.clientX, y: t.clientY }; }}
        onTouchEnd={e => {
          if (!touchStart.current || !stateRef.current) return;
          const dx = e.changedTouches[0].clientX - touchStart.current.x;
          const dy = e.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) < 15 && Math.abs(dy) < 15) return;
          const map: Record<string, Vec> = { right: { x: 1, y: 0 }, left: { x: -1, y: 0 }, down: { x: 0, y: 1 }, up: { x: 0, y: -1 } };
          const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
          stateRef.current.nextDir = map[dir];
          touchStart.current = null;
        }}
      />
      {over && <div className="text-red-400 font-bold text-lg">Game Over! Final Score: {score}</div>}
      {won && <div className="text-yellow-400 font-bold text-lg">You Win! Score: {score}</div>}
      <p className="text-gray-500 text-xs">Arrow keys / WASD or swipe to move</p>
    </div>
  );
}

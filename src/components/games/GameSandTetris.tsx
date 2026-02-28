"use client";
import { useEffect, useRef, useState } from "react";

interface GameControls {
  startGame: () => void;
  hardDrop: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
}

export default function GameSandTetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ncanvasRef = useRef<HTMLCanvasElement>(null);
  const ctrlRef = useRef<GameControls | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [overlay, setOverlay] = useState<{ title: string; msg: string } | null>({
    title: "SAND TETRIS",
    msg: "Blocks dissolve into sand!\nPress Start or Space",
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ncanvas = ncanvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const nctx = ncanvas.getContext("2d")!;

    const TCOLS = 10, TROWS = 20, PX = 4;
    const COLS = TCOLS * PX, ROWS = TROWS * PX;

    function setSize() {
      const wrap = canvas.parentElement!;
      const maxH = (wrap.clientHeight || 480) - 20;
      const maxW = (wrap.clientWidth || 320) - 120;
      const scale = Math.max(2, Math.min(Math.floor(maxH / ROWS), Math.floor(maxW / COLS)));
      canvas.width = COLS; canvas.height = ROWS;
      canvas.style.width = COLS * scale + "px";
      canvas.style.height = ROWS * scale + "px";
    }
    setSize();
    window.addEventListener("resize", setSize);

    const grid = new Uint32Array(COLS * ROWS);
    const stable = new Uint8Array(COLS * ROWS);
    const imgBuf = new Uint8ClampedArray(COLS * ROWS * 4);
    const gIdx = (r: number, c: number) => r * COLS + c;

    function colorVariant(rgba: number) {
      const d = (Math.random() - 0.5) * 0.24;
      const r = Math.min(255, Math.max(0, ((rgba >>> 24) & 0xff) * (1 + d))) | 0;
      const g = Math.min(255, Math.max(0, ((rgba >>> 16) & 0xff) * (1 + d))) | 0;
      const b = Math.min(255, Math.max(0, ((rgba >>> 8) & 0xff) * (1 + d))) | 0;
      return (r << 24) | (g << 16) | (b << 8) | 0xff;
    }

    const SHAPES = [
      { color: 0x00eeeeff, cells: [[0,1],[1,1],[2,1],[3,1]] },
      { color: 0xffd700ff, cells: [[0,0],[1,0],[0,1],[1,1]] },
      { color: 0xaa44ccff, cells: [[1,0],[0,1],[1,1],[2,1]] },
      { color: 0x22cc66ff, cells: [[1,0],[2,0],[0,1],[1,1]] },
      { color: 0xee3333ff, cells: [[0,0],[1,0],[1,1],[2,1]] },
      { color: 0x2266eeff, cells: [[0,0],[0,1],[1,1],[2,1]] },
      { color: 0xff8822ff, cells: [[2,0],[0,1],[1,1],[2,1]] },
    ];
    const randShape = () => SHAPES[Math.floor(Math.random() * SHAPES.length)];

    class Piece {
      color: number; cells: number[][]; tx: number; ty: number;
      constructor(s: { color: number; cells: number[][] }) {
        this.color = s.color;
        this.cells = s.cells.map(c => [...c]);
        this.tx = Math.floor((TCOLS - 4) / 2);
        this.ty = -2;
      }
      collides(dtx = 0, dty = 0, cells?: number[][]) {
        for (const [c, r] of (cells || this.cells)) {
          const ac = c + this.tx + dtx, ar = r + this.ty + dty;
          if (ac < 0 || ac >= TCOLS || ar >= TROWS) return true;
          if (ar < 0) continue;
          for (let dr = 0; dr < PX; dr++) for (let dc = 0; dc < PX; dc++) {
            const sr = ar * PX + dr, sc = ac * PX + dc;
            if (sr >= ROWS) return true;
            if (sc >= 0 && sc < COLS && grid[gIdx(sr, sc)]) return true;
          }
        }
        return false;
      }
      rotate() {
        const maxR = Math.max(...this.cells.map(([, r]) => r));
        const rot = this.cells.map(([c, r]) => [maxR - r, c]);
        if (!this.collides(0, 0, rot)) this.cells = rot;
        else if (!this.collides(1, 0, rot)) { this.cells = rot; this.tx++; }
        else if (!this.collides(-1, 0, rot)) { this.cells = rot; this.tx--; }
      }
      lock() {
        for (const [tc, tr] of this.cells.map(([c, r]) => [c + this.tx, r + this.ty])) {
          for (let dr = 0; dr < PX; dr++) for (let dc = 0; dc < PX; dc++) {
            const sr = tr * PX + dr, sc = tc * PX + dc;
            if (sr >= 0 && sr < ROWS && sc >= 0 && sc < COLS) {
              grid[gIdx(sr, sc)] = colorVariant(this.color);
              stable[gIdx(sr, sc)] = 0;
            }
          }
        }
      }
    }

    let current: Piece | null = null, next: Piece | null = null;
    let sc = 0, lv = 1, ln = 0;
    let running = false, dropTimer = 0, dropInterval = 600, softDrop = false;
    let lastTs = 0, rafId = 0;

    function updateSand() {
      for (let row = ROWS - 2; row >= 0; row--) {
        const ltr = Math.random() > 0.5;
        for (let i = 0; i < COLS; i++) {
          const col = ltr ? i : COLS - 1 - i;
          const idx = gIdx(row, col);
          if (!grid[idx] || stable[idx] >= 5) continue;
          const color = grid[idx];
          const below = gIdx(row + 1, col);
          if (!grid[below]) {
            grid[below] = color; stable[below] = 0; grid[idx] = 0; stable[idx] = 0;
          } else {
            let moved = false;
            for (const nc of Math.random() > 0.5 ? [col-1, col+1] : [col+1, col-1]) {
              if (nc >= 0 && nc < COLS && !grid[gIdx(row+1, nc)]) {
                grid[gIdx(row+1, nc)] = color; stable[gIdx(row+1, nc)] = 0;
                grid[idx] = 0; stable[idx] = 0; moved = true; break;
              }
            }
            if (!moved) stable[idx] = Math.min(255, stable[idx] + 1);
          }
        }
      }
    }

    function checkLines() {
      let cleared = 0;
      for (let row = ROWS - 1; row >= 0; row--) {
        let count = 0;
        for (let col = 0; col < COLS; col++) if (grid[gIdx(row, col)]) count++;
        if (count / COLS >= 0.85) {
          for (let col = 0; col < COLS; col++) { grid[gIdx(row, col)] = 0; stable[gIdx(row, col)] = 0; }
          for (let r = 0; r < row; r++) for (let col = 0; col < COLS; col++) if (grid[gIdx(r, col)]) stable[gIdx(r, col)] = 0;
          cleared++; row++;
        }
      }
      return cleared;
    }

    function drawNext() {
      nctx.fillStyle = "#0d0d1a"; nctx.fillRect(0, 0, 80, 80);
      if (!next) return;
      const r0=(next.color>>>24)&0xff, g0=(next.color>>>16)&0xff, b0=(next.color>>>8)&0xff;
      nctx.fillStyle = `rgb(${r0},${g0},${b0})`;
      const offX = (4 - Math.max(...next.cells.map(([c]) => c)) - 1) * 9 + 4;
      const offY = (2 - Math.max(...next.cells.map(([, r]) => r))) * 9 + 10;
      for (const [c, r] of next.cells) nctx.fillRect(offX + c * 18, offY + r * 18, 16, 16);
    }

    function spawnPiece() {
      current = next || new Piece(randShape());
      next = new Piece(randShape());
      drawNext();
      if (current.collides()) {
        running = false;
        setOverlay({ title: "GAME OVER", msg: `Score: ${sc}  Lines: ${ln}` });
      }
    }

    function lockAndSpawn() {
      current!.lock();
      const cleared = checkLines();
      if (cleared > 0) {
        sc += ([0,100,300,500,800][Math.min(cleared,4)] || cleared*200) * lv;
        ln += cleared; lv = Math.floor(ln/10)+1;
        dropInterval = Math.max(80, 600-(lv-1)*55);
        setScore(sc); setLevel(lv); setLines(ln);
      }
      for (let c = 0; c < COLS; c++) if (grid[gIdx(2, c)]) {
        running = false;
        setOverlay({ title: "GAME OVER", msg: `Score: ${sc}  Lines: ${ln}` });
        return;
      }
      spawnPiece();
    }

    function startGame() {
      grid.fill(0); stable.fill(0);
      sc = 0; lv = 1; ln = 0; running = true;
      dropTimer = 0; dropInterval = 600; softDrop = false;
      setScore(0); setLevel(1); setLines(0); setOverlay(null);
      next = new Piece(randShape()); spawnPiece();
      lastTs = performance.now();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }

    function hardDrop() {
      if (!current || !running) return;
      while (!current.collides(0, 1)) { current.ty++; sc++; }
      setScore(sc); lockAndSpawn();
    }

    function drawPiece(piece: Piece, dtx: number, dty: number, alpha: number) {
      const r0=(piece.color>>>24)&0xff, g0=(piece.color>>>16)&0xff, b0=(piece.color>>>8)&0xff;
      for (const [tc, tr] of piece.cells) {
        const ac=tc+piece.tx+dtx, ar=tr+piece.ty+dty;
        for (let dr=0; dr<PX; dr++) for (let dc=0; dc<PX; dc++) {
          const sr=ar*PX+dr, sc=ac*PX+dc;
          if (sr<0||sr>=ROWS||sc<0||sc>=COLS) continue;
          const p=gIdx(sr,sc)*4, edge=dr===0||dr===PX-1||dc===0||dc===PX-1;
          const rv=edge?Math.min(255,r0+40):r0, gv=edge?Math.min(255,g0+40):g0, bv=edge?Math.min(255,b0+40):b0;
          if (alpha<1) { imgBuf[p]=(imgBuf[p]*(1-alpha)+rv*alpha)|0; imgBuf[p+1]=(imgBuf[p+1]*(1-alpha)+gv*alpha)|0; imgBuf[p+2]=(imgBuf[p+2]*(1-alpha)+bv*alpha)|0; imgBuf[p+3]=255; }
          else { imgBuf[p]=rv; imgBuf[p+1]=gv; imgBuf[p+2]=bv; imgBuf[p+3]=255; }
        }
      }
    }

    function render() {
      for (let i = 0; i < COLS * ROWS; i++) {
        const p = i * 4, v = grid[i];
        if (v) { imgBuf[p]=(v>>>24)&0xff; imgBuf[p+1]=(v>>>16)&0xff; imgBuf[p+2]=(v>>>8)&0xff; imgBuf[p+3]=0xff; }
        else { imgBuf[p]=18; imgBuf[p+1]=18; imgBuf[p+2]=38; imgBuf[p+3]=255; }
      }
      if (current) {
        let ghostDy = 0;
        while (!current.collides(0, ghostDy+1)) ghostDy++;
        drawPiece(current, 0, ghostDy, 0.2);
        drawPiece(current, 0, 0, 1.0);
      }
      ctx.putImageData(new ImageData(imgBuf, COLS, ROWS), 0, 0);
    }

    function loop(ts: number) {
      if (!running) return;
      const dt = Math.min(ts - lastTs, 50); lastTs = ts;
      updateSand();
      const interval = softDrop ? Math.max(40, dropInterval/8) : dropInterval;
      dropTimer += dt;
      if (dropTimer >= interval) {
        dropTimer = 0;
        if (current && !current.collides(0,1)) { current.ty++; if (softDrop) { sc++; setScore(sc); } }
        else if (current) lockAndSpawn();
      }
      render();
      rafId = requestAnimationFrame(loop);
    }

    ctrlRef.current = {
      startGame,
      hardDrop,
      moveLeft: () => { if (current && running && !current.collides(-1,0)) current.tx--; },
      moveRight: () => { if (current && running && !current.collides(1,0)) current.tx++; },
      rotate: () => { if (current && running) current.rotate(); },
    };

    const onKey = (e: KeyboardEvent) => {
      if (!running) { if (e.code==="Space") { e.preventDefault(); startGame(); } return; }
      if (!current) return;
      if (e.code==="ArrowLeft") { e.preventDefault(); if (!current.collides(-1,0)) current.tx--; }
      else if (e.code==="ArrowRight") { e.preventDefault(); if (!current.collides(1,0)) current.tx++; }
      else if (e.code==="ArrowUp"||e.code==="KeyZ") { e.preventDefault(); current.rotate(); }
      else if (e.code==="ArrowDown") { e.preventDefault(); softDrop=true; }
      else if (e.code==="Space") { e.preventDefault(); hardDrop(); }
    };
    const onKeyUp = (e: KeyboardEvent) => { if (e.code==="ArrowDown") softDrop=false; };
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKeyUp);

    let tx0=0, ty0=0;
    const onTS = (e: TouchEvent) => { e.preventDefault(); tx0=e.touches[0].clientX; ty0=e.touches[0].clientY; };
    const onTE = (e: TouchEvent) => {
      e.preventDefault();
      if (!running) { startGame(); return; }
      if (!current) return;
      const dx=e.changedTouches[0].clientX-tx0, dy=e.changedTouches[0].clientY-ty0;
      if (Math.abs(dx)<10&&Math.abs(dy)<10) current.rotate();
      else if (Math.abs(dx)>Math.abs(dy)) { if (dx<-20&&!current.collides(-1,0)) current.tx--; else if (dx>20&&!current.collides(1,0)) current.tx++; }
      else if (dy>20) hardDrop();
    };
    canvas.addEventListener("touchstart", onTS, { passive: false });
    canvas.addEventListener("touchend", onTE, { passive: false });

    render();
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchend", onTE);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, background:"#0d0d1a", padding:12, borderRadius:8, width:"100%" }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", position:"relative" }}>
        <div style={{ position:"relative" }}>
          <canvas ref={canvasRef} style={{ imageRendering:"pixelated", border:"1px solid #444", display:"block" }} />
          {overlay && (
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"rgba(5,5,15,0.93)", border:"1px solid #b06020", borderRadius:10, padding:"20px 28px", textAlign:"center", minWidth:160 }}>
              <div style={{ color:"#e8c060", fontSize:"1.2rem", marginBottom:8 }}>{overlay.title}</div>
              <div style={{ color:"#a08040", fontSize:"0.8rem", lineHeight:1.6 }}>{overlay.msg.split("\n").map((l,i)=><div key={i}>{l}</div>)}</div>
            </div>
          )}
        </div>
        <div style={{ width:100, display:"flex", flexDirection:"column", gap:8 }}>
          {(["Next","Score","Level","Lines"] as const).map(label => (
            <div key={label} style={{ background:"#12122a", border:"1px solid #2a2a4a", borderRadius:6, padding:"6px 8px", textAlign:"center" }}>
              <div style={{ fontSize:"0.58rem", color:"#666", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{label}</div>
              <div style={{ fontSize:"1.1rem", fontWeight:"bold", color:"#e8c060" }}>
                {label==="Next" ? <canvas ref={ncanvasRef} width={80} height={80} style={{ imageRendering:"pixelated", display:"block", margin:"4px auto 0" }} /> : label==="Score" ? score : label==="Level" ? level : lines}
              </div>
            </div>
          ))}
          <button onClick={() => ctrlRef.current?.startGame()} style={{ width:"100%", padding:"8px 0", background:"#7a3a10", color:"#f0c060", border:"1px solid #b06020", borderRadius:6, fontSize:"0.82rem", fontWeight:"bold", cursor:"pointer" }}>START</button>
        </div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {([["◀", "moveLeft"],["↻","rotate"],["▶","moveRight"],["▼▼","hardDrop"]] as [string, keyof GameControls][]).map(([label, fn]) => (
          <button key={label} onPointerDown={() => ctrlRef.current?.[fn]()} style={{ width:56, height:56, background:"#12122a", border:"1px solid #2a2a4a", borderRadius:8, color:"#e8c060", fontSize:"1.3rem", cursor:"pointer" }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

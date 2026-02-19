"use client";
import { useState, useEffect, useRef } from "react";
import { saveScore, getScore } from "@/lib/scores";

const ROWS=10,COLS=10,MINES=15;
type Cell={mine:boolean;revealed:boolean;flagged:boolean;count:number};

function buildBoard(safeR:number,safeC:number):Cell[][]{
  const b:Cell[][]=Array.from({length:ROWS},()=>Array.from({length:COLS},()=>({mine:false,revealed:false,flagged:false,count:0})));
  let placed=0;
  while(placed<MINES){
    const r=Math.floor(Math.random()*ROWS),c=Math.floor(Math.random()*COLS);
    if(!b[r][c].mine&&!(r===safeR&&c===safeC)){b[r][c].mine=true;placed++;}
  }
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    if(b[r][c].mine)continue;
    let n=0;
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&b[nr][nc].mine)n++;}
    b[r][c].count=n;
  }
  return b;
}

function flood(b:Cell[][],r:number,c:number){
  if(r<0||r>=ROWS||c<0||c>=COLS||b[r][c].revealed||b[r][c].flagged||b[r][c].mine)return;
  b[r][c].revealed=true;
  if(b[r][c].count===0)for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)flood(b,r+dr,c+dc);
}

const COLORS=["","#60a5fa","#4ade80","#f87171","#818cf8","#fb923c","#22d3ee","#e879f9","#94a3b8"];

export default function GameMinesweeper(){
  const [board,setBoard]=useState<Cell[][]|null>(null);
  const [over,setOver]=useState(false);
  const [won,setWon]=useState(false);
  const [time,setTime]=useState(0);
  const [started,setStarted]=useState(false);
  const [bestTime,setBestTime]=useState<number|null>(()=>{const s=getScore("minesweeper");return s>0?9999-s:null;});
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(()=>{
    if(started&&!over&&!won){
      timerRef.current=setInterval(()=>setTime(t=>t+1),1000);
    }else{
      if(timerRef.current)clearInterval(timerRef.current);
    }
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[started,over,won]);

  const reset=()=>{setBoard(null);setOver(false);setWon(false);setTime(0);setStarted(false);};

  const click=(r:number,c:number)=>{
    if(over||won)return;
    let b:Cell[][];
    if(!board){
      b=buildBoard(r,c);
      setStarted(true);
    }else{
      b=board.map(row=>row.map(cell=>({...cell})));
    }
    if(b[r][c].flagged||b[r][c].revealed)return;
    if(b[r][c].mine){
      b.forEach(row=>row.forEach(cell=>{if(cell.mine)cell.revealed=true;}));
      setBoard(b);setOver(true);return;
    }
    flood(b,r,c);
    const safe=b.flat().filter(cell=>!cell.mine);
    if(safe.every(cell=>cell.revealed)){setBoard(b);setWon(true);setBestTime(prev=>{if(prev===null||time<prev){saveScore("minesweeper",9999-time);return time;}return prev;});return;}
    setBoard(b);
  };

  const flag=(e:React.MouseEvent,r:number,c:number)=>{
    e.preventDefault();
    if(over||won||!board||board[r][c].revealed)return;
    const b=board.map(row=>row.map(cell=>({...cell})));
    b[r][c].flagged=!b[r][c].flagged;
    setBoard(b);
  };

  const flags=board?board.flat().filter(c=>c.flagged).length:0;
  const displayBoard=board??Array.from({length:ROWS},()=>Array.from({length:COLS},()=>({mine:false,revealed:false,flagged:false,count:0})));

  return(
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex justify-between w-full max-w-xs items-center">
        <span className="text-sm font-mono">💣 {MINES-flags}</span>
        <button onClick={reset} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">New Game</button>
        <span className="text-sm font-mono">⏱ {time}s{bestTime!==null&&<span className="text-gray-400 ml-2">Best: {bestTime}s</span>}</span>
      </div>
      <div className="border border-gray-600 rounded overflow-hidden" style={{display:"grid",gridTemplateColumns:`repeat(${COLS},1fr)`}}>
        {displayBoard.flat().map((cell,i)=>{
          const r=Math.floor(i/COLS),c=i%COLS;
          const isBlast=over&&cell.mine&&cell.revealed;
          return(
            <div key={i} onClick={()=>click(r,c)} onContextMenu={e=>flag(e,r,c)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold cursor-pointer border border-gray-700
                ${cell.revealed?(isBlast?"bg-red-800":"bg-gray-700"):"bg-gray-600 hover:bg-gray-500"}`}
              style={{color:cell.revealed&&!cell.mine&&cell.count?COLORS[cell.count]:undefined}}>
              {cell.flagged&&!cell.revealed?"🚩":cell.revealed?(cell.mine?"💣":cell.count||""):""}
            </div>
          );
        })}
      </div>
      <div className="h-6 flex items-center">
        {over&&<span className="text-red-400 font-bold">Game Over!</span>}
        {won&&<span className="text-green-400 font-bold">You Win! ({time}s)</span>}
        {!over&&!won&&!started&&<span className="text-gray-500 text-sm">Click to start</span>}
      </div>
      <p className="text-gray-600 text-xs">Left-click reveal · Right-click flag</p>
    </div>
  );
}

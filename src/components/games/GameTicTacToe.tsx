"use client";
import { useState } from "react";

type Player = "X" | "O" | null;
const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function getWinLine(b: Player[]): number[]|null {
  for(const line of WINS) if(b[line[0]]&&b[line[0]]===b[line[1]]&&b[line[0]]===b[line[2]])return line;
  return null;
}

function minimax(b: Player[], isMax: boolean): number {
  const line=getWinLine(b);
  if(line)return b[line[0]]==="O"?10:-10;
  if(b.every(v=>v))return 0;
  if(isMax){
    let best=-Infinity;
    for(let i=0;i<9;i++)if(!b[i]){b[i]="O";best=Math.max(best,minimax(b,false));b[i]=null;}
    return best;
  }else{
    let best=Infinity;
    for(let i=0;i<9;i++)if(!b[i]){b[i]="X";best=Math.min(best,minimax(b,true));b[i]=null;}
    return best;
  }
}

function bestMove(b: Player[]): number {
  let best=-Infinity,move=0;
  for(let i=0;i<9;i++)if(!b[i]){
    b[i]="O";const s=minimax(b,false);b[i]=null;
    if(s>best){best=s;move=i;}
  }
  return move;
}

export default function GameTicTacToe(){
  const [board,setBoard]=useState<Player[]>(Array(9).fill(null));
  const [scores,setScores]=useState({X:0,O:0,D:0});
  const [done,setDone]=useState(false);

  const winLine=getWinLine(board);
  const isDraw=!winLine&&board.every(v=>v);
  const winner=winLine?board[winLine[0]]:null;

  const click=(i:number)=>{
    if(board[i]||done)return;
    const b=[...board];b[i]="X";
    const wl=getWinLine(b);
    if(wl){setBoard(b);setScores(s=>({...s,X:s.X+1}));setDone(true);return;}
    if(b.every(v=>v)){setBoard(b);setScores(s=>({...s,D:s.D+1}));setDone(true);return;}
    b[bestMove(b)]="O";
    const wl2=getWinLine(b);
    if(wl2){setBoard(b);setScores(s=>({...s,O:s.O+1}));setDone(true);return;}
    if(b.every(v=>v)){setBoard(b);setScores(s=>({...s,D:s.D+1}));setDone(true);return;}
    setBoard(b);
  };

  const reset=()=>{setBoard(Array(9).fill(null));setDone(false);};

  return(
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-sm font-semibold">
        <span className="text-blue-400">You (X): {scores.X}</span>
        <span className="text-gray-400">Draws: {scores.D}</span>
        <span className="text-red-400">AI (O): {scores.O}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {board.map((v,i)=>{
          const isWin=winLine?.includes(i);
          return(
            <div key={i} onClick={()=>click(i)}
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold cursor-pointer transition-colors
                ${isWin?"bg-yellow-500":"bg-gray-800 hover:bg-gray-700"}`}
              style={{color:v==="X"?"#60a5fa":"#f87171"}}>
              {v}
            </div>
          );
        })}
      </div>
      <div className="h-7 flex items-center">
        {winner&&<span className="font-bold text-lg" style={{color:winner==="X"?"#60a5fa":"#f87171"}}>{winner==="X"?"You win!":"AI wins!"}</span>}
        {isDraw&&<span className="text-yellow-400 font-bold text-lg">Draw!</span>}
        {!done&&!isDraw&&<span className="text-gray-400 text-sm">Your turn (X)</span>}
      </div>
      <button onClick={reset} className="bg-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-600">New Round</button>
    </div>
  );
}

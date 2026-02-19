"use client";
import { useState, useCallback } from "react";

type Color = "w" | "b";
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";
type Piece = { t: PieceType; c: Color } | null;
type Board = Piece[][];
type Pos = [number, number];
type Castle = { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };

const G: Record<string, string> = {
  wK:"♔",wQ:"♕",wR:"♖",wB:"♗",wN:"♘",wP:"♙",
  bK:"♚",bQ:"♛",bR:"♜",bB:"♝",bN:"♞",bP:"♟",
};

function initBoard(): Board {
  const b: Board = Array.from({length:8},()=>Array(8).fill(null));
  const order: PieceType[] = ["R","N","B","Q","K","B","N","R"];
  for(let c=0;c<8;c++){
    b[0][c]={t:order[c],c:"b"};b[1][c]={t:"P",c:"b"};
    b[6][c]={t:"P",c:"w"};b[7][c]={t:order[c],c:"w"};
  }
  return b;
}

function inB(r:number,c:number){return r>=0&&r<8&&c>=0&&c<8;}

function rawMoves(board:Board,r:number,c:number,ep:Pos|null):Pos[]{
  const p=board[r][c];if(!p)return[];
  const {t,c:col}=p;
  const moves:Pos[]=[];
  const opp=(nr:number,nc:number)=>inB(nr,nc)&&board[nr][nc]&&board[nr][nc]!.c!==col;
  const free=(nr:number,nc:number)=>inB(nr,nc)&&!board[nr][nc];
  const slide=(dr:number,dc:number)=>{
    let nr=r+dr,nc=c+dc;
    while(inB(nr,nc)){
      if(board[nr][nc]){if(board[nr][nc]!.c!==col)moves.push([nr,nc]);break;}
      moves.push([nr,nc]);nr+=dr;nc+=dc;
    }
  };
  if(t==="R"){[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>slide(a,b));}
  else if(t==="B"){[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>slide(a,b));}
  else if(t==="Q"){[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>slide(a,b));}
  else if(t==="N"){[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
    if(inB(r+dr,c+dc)&&board[r+dr][c+dc]?.c!==col)moves.push([r+dr,c+dc]);
  });}
  else if(t==="K"){[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr,dc])=>{
    if(inB(r+dr,c+dc)&&board[r+dr][c+dc]?.c!==col)moves.push([r+dr,c+dc]);
  });}
  else if(t==="P"){
    const dir=col==="w"?-1:1,start=col==="w"?6:1;
    if(free(r+dir,c)){moves.push([r+dir,c]);if(r===start&&free(r+2*dir,c))moves.push([r+2*dir,c]);}
    for(const dc of[-1,1]){
      if(opp(r+dir,c+dc))moves.push([r+dir,c+dc]);
      if(ep&&ep[0]===r+dir&&ep[1]===c+dc)moves.push([r+dir,c+dc]);
    }
  }
  return moves;
}

function applyMove(board:Board,from:Pos,to:Pos,ep:Pos|null):Board{
  const b=board.map(row=>[...row]);
  const p=b[from[0]][from[1]];
  b[to[0]][to[1]]=p;b[from[0]][from[1]]=null;
  if(p?.t==="P"&&ep&&to[0]===ep[0]&&to[1]===ep[1])b[from[0]][to[1]]=null;
  if(p?.t==="P"&&(to[0]===0||to[0]===7))b[to[0]][to[1]]={t:"Q",c:p.c};
  return b;
}

function inCheck(board:Board,col:Color):boolean{
  let kr=-1,kc=-1;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(board[r][c]?.t==="K"&&board[r][c]?.c===col){kr=r;kc=c;}
  const opp:Color=col==="w"?"b":"w";
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(board[r][c]?.c===opp&&rawMoves(board,r,c,null).some(([mr,mc])=>mr===kr&&mc===kc))return true;
  }
  return false;
}

function legalMoves(board:Board,r:number,c:number,ep:Pos|null,castle:Castle):Pos[]{
  const p=board[r][c];if(!p)return[];
  const legal=rawMoves(board,r,c,ep).filter(([tr,tc])=>!inCheck(applyMove(board,[r,c],[tr,tc],ep),p.c));
  if(p.t==="K"&&!inCheck(board,p.c)){
    const row=p.c==="w"?7:0;
    if(r===row&&c===4){
      const ks=p.c==="w"?castle.wK:castle.bK;
      if(ks&&!board[row][5]&&!board[row][6]&&board[row][7]?.t==="R"){
        const b1=applyMove(board,[row,4],[row,5],null);
        if(!inCheck(b1,p.c)&&!inCheck(applyMove(b1,[row,5],[row,6],null),p.c))legal.push([row,6]);
      }
      const qs=p.c==="w"?castle.wQ:castle.bQ;
      if(qs&&!board[row][3]&&!board[row][2]&&!board[row][1]&&board[row][0]?.t==="R"){
        const b1=applyMove(board,[row,4],[row,3],null);
        if(!inCheck(b1,p.c)&&!inCheck(applyMove(b1,[row,3],[row,2],null),p.c))legal.push([row,2]);
      }
    }
  }
  return legal;
}

function anyMoves(board:Board,col:Color,ep:Pos|null,castle:Castle):boolean{
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(board[r][c]?.c===col&&legalMoves(board,r,c,ep,castle).length>0)return true;
  return false;
}

function capturedPieces(board:Board):{w:string[];b:string[]}{
  const init:Record<PieceType,number>={K:1,Q:1,R:2,B:2,N:2,P:8};
  const cnt=(col:Color,t:PieceType)=>board.flat().filter(p=>p?.c===col&&p?.t===t).length;
  const w:string[]=[],b:string[]=[];
  (["Q","R","B","N","P"] as PieceType[]).forEach(t=>{
    for(let i=cnt("w",t);i<init[t];i++)b.push(G["w"+t]);
    for(let i=cnt("b",t);i<init[t];i++)w.push(G["b"+t]);
  });
  return{w,b};
}

export default function GameChess(){
  const [board,setBoard]=useState<Board>(initBoard);
  const [sel,setSel]=useState<Pos|null>(null);
  const [turn,setTurn]=useState<Color>("w");
  const [ep,setEp]=useState<Pos|null>(null);
  const [castle,setCastle]=useState<Castle>({wK:true,wQ:true,bK:true,bQ:true});
  const [status,setStatus]=useState("");
  const [hl,setHl]=useState<Pos[]>([]);

  const reset=useCallback(()=>{
    setBoard(initBoard());setSel(null);setTurn("w");
    setEp(null);setCastle({wK:true,wQ:true,bK:true,bQ:true});
    setStatus("");setHl([]);
  },[]);

  const click=(r:number,c:number)=>{
    if(status.includes("wins")||status.includes("Stalemate"))return;
    const p=board[r][c];
    if(sel){
      const [sr,sc]=sel;
      if(sr===r&&sc===c){setSel(null);setHl([]);return;}
      if(p?.c===turn){setSel([r,c]);setHl(legalMoves(board,r,c,ep,castle));return;}
      const moves=legalMoves(board,sr,sc,ep,castle);
      if(!moves.some(([lr,lc])=>lr===r&&lc===c)){setSel(null);setHl([]);return;}
      let nb=applyMove(board,[sr,sc],[r,c],ep);
      const sp=board[sr][sc];
      if(sp?.t==="K"){
        if(c===6&&sc===4)nb=applyMove(nb,[r,7],[r,5],null);
        if(c===2&&sc===4)nb=applyMove(nb,[r,0],[r,3],null);
      }
      const nc={...castle};
      if(sp?.t==="K"){if(sp.c==="w"){nc.wK=false;nc.wQ=false;}else{nc.bK=false;nc.bQ=false;}}
      if(sp?.t==="R"){
        if(sr===7&&sc===0)nc.wQ=false;if(sr===7&&sc===7)nc.wK=false;
        if(sr===0&&sc===0)nc.bQ=false;if(sr===0&&sc===7)nc.bK=false;
      }
      const nep:Pos|null=sp?.t==="P"&&Math.abs(r-sr)===2?[sr+(r-sr)/2,c]:null;
      const next:Color=turn==="w"?"b":"w";
      const chk=inCheck(nb,next);
      const has=anyMoves(nb,next,nep,nc);
      if(!has)setStatus(chk?`${next==="w"?"White":"Black"} checkmated! ${turn==="w"?"White":"Black"} wins!`:"Stalemate — Draw!");
      else setStatus(chk?`${next==="w"?"White":"Black"} is in check!`:"");
      setBoard(nb);setEp(nep);setCastle(nc);setSel(null);setHl([]);setTurn(next);
    }else{
      if(p?.c===turn){setSel([r,c]);setHl(legalMoves(board,r,c,ep,castle));}
    }
  };

  const cap=capturedPieces(board);
  const gameOver=status.includes("wins")||status.includes("Stalemate");

  return(
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="flex justify-between w-full max-w-sm items-center">
        <span className="text-sm font-semibold">{turn==="w"?"⬜ White":"⬛ Black"}&apos;s turn</span>
        <button onClick={reset} className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">Reset</button>
      </div>
      {status&&<div className={`text-sm font-bold px-2 py-1 rounded ${gameOver?"text-green-400":"text-yellow-400"}`}>{status}</div>}
      <div className="text-xs text-gray-300 h-5 tracking-wide">{cap.b.join(" ")}</div>
      <div className="border-2 border-gray-500 rounded overflow-hidden">
        {board.map((row,r)=>(
          <div key={r} className="flex">
            {row.map((p,c)=>{
              const light=(r+c)%2===0;
              const isSel=sel?.[0]===r&&sel?.[1]===c;
              const isHl=hl.some(([hr,hc])=>hr===r&&hc===c);
              const isCapHl=isHl&&!!board[r][c];
              let bg=light?"bg-amber-100":"bg-amber-800";
              if(isSel)bg="bg-yellow-400";
              else if(isCapHl)bg=light?"bg-red-300":"bg-red-600";
              else if(isHl)bg=light?"bg-green-200":"bg-green-700";
              return(
                <div key={c} onClick={()=>click(r,c)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-xl sm:text-2xl cursor-pointer relative ${bg}`}>
                  {isHl&&!p&&<div className="w-3 h-3 rounded-full bg-green-500 opacity-50 pointer-events-none"/>}
                  {p&&<span className={p.c==="w"?"drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]":""}>{G[p.c+p.t]}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-300 h-5 tracking-wide">{cap.w.join(" ")}</div>
    </div>
  );
}

"use client";
import { useRef } from "react";

export default function GameSandTetris() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  return (
    <iframe
      ref={iframeRef}
      src="/games/sand-tetris/"
      style={{ width: "100%", height: "600px", border: "none", borderRadius: "8px", display: "block" }}
      title="Sand Tetris"
      allow="autoplay"
      scrolling="no"
    />
  );
}

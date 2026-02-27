"use client";
import { useEffect, useRef } from "react";

export default function GameSandTetris() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const resize = () => {
      if (iframe.contentWindow) {
        iframe.contentWindow.dispatchEvent(new Event("resize"));
      }
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/games/sand-tetris/"
      style={{
        width: "100%",
        height: "600px",
        border: "none",
        borderRadius: "8px",
        display: "block",
      }}
      title="Sand Tetris"
      allow="autoplay"
      scrolling="no"
    />
  );
}

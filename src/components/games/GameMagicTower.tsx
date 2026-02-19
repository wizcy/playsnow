"use client";
export default function GameMagicTower() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", background: "#000" }}>
      <iframe
        src="/games/magic-tower/index.html"
        style={{ width: 640, height: 640, maxWidth: "100%", border: "none" }}
        title="Magic Tower"
        allowFullScreen
      />
    </div>
  );
}

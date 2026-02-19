"use client";
export default function GameMagicTower() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", background: "#000" }}>
      <iframe
        src="/games/magic-tower/index.html"
        style={{ width: 972, height: 702, maxWidth: "100%", border: "none" }}
        title="Magic Tower"
        allowFullScreen
      />
    </div>
  );
}

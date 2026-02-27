"use client";
export default function GameMagicTower() {
  return (
    <div style={{ width: "100%", overflowX: "auto", background: "#000", display: "flex", justifyContent: "center" }}>
      <iframe
        src="/games/magic-tower"
        style={{ width: 976, height: 706, border: "none", flexShrink: 0 }}
        title="Magic Tower"
        allowFullScreen
      />
    </div>
  );
}

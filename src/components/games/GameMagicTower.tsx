"use client";
export default function GameMagicTower() {
  return (
    <div style={{ width: "100%", overflow: "hidden", background: "#000" }}>
      <div style={{ width: 1296, height: 936, margin: "0 auto", transformOrigin: "top center", transform: "scale(var(--s))" }} ref={(el) => {
        if (!el) return;
        const update = () => {
          const s = Math.min(1, (el.parentElement?.clientWidth || 1296) / 1296);
          el.style.setProperty("--s", String(s));
          (el.parentElement as HTMLElement).style.height = `${936 * s}px`;
        };
        update();
        window.addEventListener("resize", update);
      }}>
        <iframe
          src="/games/magic-tower/index.html"
          style={{ width: 1296, height: 936, border: "none" }}
          title="Magic Tower"
          allowFullScreen
        />
      </div>
    </div>
  );
}

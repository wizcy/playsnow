"use client";
export default function GameMagicTower() {
  return (
    <div style={{ width: "100%", overflow: "hidden", background: "#000" }}>
      <div style={{ width: 972, height: 702, margin: "0 auto", transformOrigin: "top center", transform: "scale(var(--s))" }} ref={(el) => {
        if (!el) return;
        const update = () => {
          const s = Math.min(1, (el.parentElement?.clientWidth || 972) / 972);
          el.style.setProperty("--s", String(s));
          (el.parentElement as HTMLElement).style.height = `${702 * s}px`;
        };
        update();
        window.addEventListener("resize", update);
      }}>
        <iframe
          src="/games/magic-tower/index.html"
          style={{ width: 972, height: 702, border: "none" }}
          title="Magic Tower"
          allowFullScreen
        />
      </div>
    </div>
  );
}

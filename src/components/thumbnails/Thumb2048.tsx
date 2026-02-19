"use client";
export default function Thumb2048() {
  const tiles = [
    { val: "2048", bg: "#edc22e", color: "#f9f6f2", size: "text-lg" },
    { val: "1024", bg: "#edc22e", color: "#f9f6f2", size: "text-sm" },
    { val: "512", bg: "#e5953a", color: "#f9f6f2", size: "text-sm" },
    { val: "256", bg: "#e5953a", color: "#f9f6f2", size: "text-sm" },
    { val: "128", bg: "#e07c3a", color: "#f9f6f2", size: "text-xs" },
    { val: "64", bg: "#f65e3b", color: "#f9f6f2", size: "text-xs" },
    { val: "32", bg: "#f67c5f", color: "#f9f6f2", size: "text-xs" },
    { val: "16", bg: "#f59563", color: "#776e65", size: "text-xs" },
    { val: "8", bg: "#f2b179", color: "#776e65", size: "text-xs" },
  ];
  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: "#bbada0" }}>
      <div className="grid gap-1.5 p-2" style={{ gridTemplateColumns: "repeat(3, 1fr)", width: "90%", aspectRatio: "1" }}>
        {tiles.map((t) => (
          <div key={t.val} className={`flex items-center justify-center font-black rounded ${t.size}`}
            style={{ background: t.bg, color: t.color, aspectRatio: "1" }}>
            {t.val}
          </div>
        ))}
      </div>
    </div>
  );
}

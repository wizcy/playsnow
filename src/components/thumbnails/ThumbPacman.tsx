"use client";
export default function ThumbPacman() {
  const dots = [[25,50],[40,50],[55,50],[70,50],[85,50],[25,65],[40,65],[55,65],[70,65],[85,65]];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ background: "#000" }}>
      {/* Dots */}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#facc15" />
      ))}
      {/* Power pellet */}
      <circle cx="85" cy="35" r="5" fill="#facc15" />
      {/* Pacman */}
      <path d="M20,35 L20,35 A15,15 0 1,1 20,35.01 Z" fill="#facc15"
        transform="rotate(-30, 20, 35)"
        style={{ clipPath: "none" }} />
      <path d="M20,35 L35,28 A15,15 0 0,0 35,42 Z" fill="#000" />
      <circle cx="20" cy="28" r="2" fill="#000" />
      {/* Ghost */}
      <path d="M60,20 Q60,12 68,12 Q76,12 76,20 L76,32 Q73,29 70,32 Q67,29 64,32 Q61,29 60,32 Z" fill="#ff0000" />
      <circle cx="65" cy="20" r="3" fill="white" />
      <circle cx="71" cy="20" r="3" fill="white" />
      <circle cx="66" cy="20" r="1.5" fill="#000" />
      <circle cx="72" cy="20" r="1.5" fill="#000" />
    </svg>
  );
}

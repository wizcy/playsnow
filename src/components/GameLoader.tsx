export default function GameLoader() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, color: "#818384" }}>
      <div style={{ fontSize: 48, animation: "pulse 1.5s ease-in-out infinite" }}>🎮</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>Loading game...</div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%", background: "#3a3a3c",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
    </div>
  );
}

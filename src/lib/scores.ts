const KEY = "pn_scores";

function load(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function saveScore(gameSlug: string, score: number): void {
  const all = load();
  if (score > (all[gameSlug] ?? 0)) {
    all[gameSlug] = score;
    localStorage.setItem(KEY, JSON.stringify(all));
  }
}

export function getScore(gameSlug: string): number {
  return load()[gameSlug] ?? 0;
}

export function getAllScores(): Record<string, number> {
  return load();
}

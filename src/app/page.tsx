"use client";
import { useState, useEffect } from "react";
import { games, categories } from "@/lib/games";
import GameCard from "@/components/GameCard";
import Link from "next/link";
import { getAllScores } from "@/lib/scores";

const featured = ["wordle", "2048", "chess"].map(s => games.find(g => g.slug === s)!).filter(Boolean);
const allCategories = ["All", ...categories.map(c => c.name)];

export default function Home() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? games : games.filter(g => g.category === filter);
  const [topScores, setTopScores] = useState<{ slug: string; name: string; score: number }[]>([]);

  useEffect(() => {
    const all = getAllScores();
    const entries = games
      .filter(g => (all[g.slug] ?? 0) > 0)
      .map(g => ({ slug: g.slug, name: g.title, score: all[g.slug] }))
      .slice(0, 3);
    setTopScores(entries);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-16 mb-10 rounded-2xl" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
        <h1 className="text-5xl font-bold mb-3">Play Free Online Games</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">15 classic games, no download needed</p>
        <Link href="/games/wordle" className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition text-lg">
          🎯 Today&apos;s Challenge: Wordle
        </Link>
      </section>

      {/* Your Stats */}
      {topScores.length > 0 && (
        <section className="mb-10 bg-gray-800 rounded-xl px-6 py-4 flex items-center gap-6 flex-wrap">
          <span className="text-sm font-semibold text-yellow-400">🏆 Your Best Scores</span>
          {topScores.map(({ slug, name, score }) => (
            <Link key={slug} href={`/games/${slug}`} className="text-sm text-gray-300 hover:text-white transition">
              {name}: <span className="font-bold text-white">{score}</span>
            </Link>
          ))}
        </section>
      )}

      {/* Featured */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">⭐ Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map(g => <GameCard key={g.slug} game={g} size="large" />)}
        </div>
      </section>

      {/* All Games with filter */}
      <section id="all-games" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🎮 All Games</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === cat ? "bg-yellow-500 text-gray-900" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(g => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>

      {/* SEO Text */}
      <section className="bg-gray-800 rounded-xl p-8 text-gray-400 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-white mb-3">About PlayNow — Your Free Online Gaming Destination</h2>
        <p className="mb-3">PlayNow is a free online gaming platform where you can play classic and popular games directly in your web browser. We offer a carefully curated collection of HTML5 games including puzzle favorites like 2048, Tetris, Sudoku, and Minesweeper, arcade classics like Snake and Pac-Man, casual hits like Flappy Bird, and brain games like Chess and Memory Match.</p>
        <p>All our games are built with modern web technology for fast loading times and smooth gameplay. Just pick a game and start playing instantly.</p>
      </section>
    </main>
  );
}

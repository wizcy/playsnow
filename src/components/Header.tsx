"use client";
import Link from "next/link";
import { useState } from "react";
import { categories } from "@/lib/games";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          🎮 <span className="text-white">Play<span className="text-yellow-400">Now</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="text-gray-300 hover:text-white">Categories ▾</button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg py-2 min-w-[160px] shadow-xl">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}`} className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
        </nav>

        <button className="md:hidden text-gray-300 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4 space-y-3">
          <Link href="/" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="block text-gray-400 hover:text-white pl-4" onClick={() => setMenuOpen(false)}>
              {c.name} Games
            </Link>
          ))}
          <Link href="/about" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="block text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      )}
    </header>
  );
}

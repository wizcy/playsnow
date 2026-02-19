"use client";
import Link from "next/link";
import type { Game } from "@/lib/games";
import { thumbnails } from "./thumbnails";

export default function GameCard({ game, size = "small" }: { game: Game; size?: "small" | "large" }) {
  const isLarge = size === "large";
  const Thumb = thumbnails[game.slug];
  return (
    <Link href={`/games/${game.slug}`}
      className={`group relative rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all hover:scale-105 hover:shadow-xl ${isLarge ? "aspect-[4/3]" : "aspect-square"}`}>
      <div className="absolute inset-0">
        {Thumb ? <Thumb /> : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${game.color}55, ${game.color}22)` }} />}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-3">
        <div className="flex items-end justify-between gap-2">
          <span className={`font-bold text-white leading-tight ${isLarge ? "text-xl" : "text-sm"}`}>{game.title}</span>
          <span className="shrink-0 text-xs text-white/80 px-2 py-0.5 rounded-full" style={{ background: `${game.color}99` }}>{game.category}</span>
        </div>
        {isLarge && <p className="text-xs text-gray-300 mt-1 line-clamp-2">{game.description}</p>}
      </div>
    </Link>
  );
}

import { categories, getCategory, getGamesByCategory } from "@/lib/games";
import { notFound } from "next/navigation";
import Link from "next/link";
import GameCard from "@/components/GameCard";
import type { Metadata } from "next";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cat = getCategory(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.name} Games - Play Free Online`,
    description: cat.description,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();
  const categoryGames = getGamesByCategory(cat.name);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-white">{cat.name} Games</span>
      </nav>
      <h1 className="text-4xl font-bold mb-3">{cat.name} Games</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">{cat.description}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categoryGames.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
    </main>
  );
}

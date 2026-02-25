import { games, getGame, getRelatedGames } from "@/lib/games";
import { getGameComponent } from "@/lib/gameComponents";
import { notFound } from "next/navigation";
import Link from "next/link";
import GameCard from "@/components/GameCard";
import GameLoader from "@/components/GameLoader";
import { Suspense } from "react";
import type { Metadata } from "next";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const game = getGame(params.slug);
  if (!game) return {};
  const canonical = `https://playsnow.top/games/${game.slug}`;
  const description = `${game.description} Play ${game.title} free online — no download, no sign-up required. ${game.keywords[0].charAt(0).toUpperCase() + game.keywords[0].slice(1)} that works on desktop and mobile.`;
  return {
    title: `Play ${game.title} Online Free - No Download`,
    description,
    keywords: game.keywords.join(", "),
    alternates: { canonical },
    openGraph: {
      title: `Play ${game.title} Online Free - No Download | PlayNow`,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGame(params.slug);
  if (!game) notFound();
  const GameComponent = getGameComponent(params.slug);
  const related = getRelatedGames(params.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    url: `https://playsnow.top/games/${game.slug}`,
    description: game.description,
    genre: game.category,
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://playsnow.top/" },
      { "@type": "ListItem", position: 2, name: `${game.category} Games`, item: `https://playsnow.top/category/${game.category.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name: game.title, item: `https://playsnow.top/games/${game.slug}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: game.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/category/${game.category.toLowerCase()}`} className="hover:text-white">{game.category} Games</Link>
        <span className="mx-2">›</span>
        <span className="text-white">{game.title}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-2">{game.emoji} {game.title}</h1>
      <p className="text-gray-400 mb-6">{game.longDescription}</p>

      {/* Game Area */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8 flex justify-center min-h-[400px] items-center">
        <Suspense fallback={<GameLoader />}>
          {GameComponent ? <GameComponent /> : <GameLoader />}
        </Suspense>
      </div>

      {/* Ad Slot 1 placeholder */}
      {/* <div className="bg-gray-800 rounded h-[90px] mb-8 flex items-center justify-center text-gray-600 text-sm">Ad Space</div> */}

      {/* How to Play */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">How to Play {game.title}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🖥️ Desktop</h3>
            <p className="text-gray-400 text-sm">{game.howToPlay.desktop}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📱 Mobile</h3>
            <p className="text-gray-400 text-sm">{game.howToPlay.mobile}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Game Features</h2>
        <ul className="space-y-2">
          {game.features.map((f, i) => <li key={i} className="text-gray-400 flex gap-2"><span className="text-green-400">✓</span>{f}</li>)}
        </ul>
      </section>

      {/* Tips */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Tips & Tricks</h2>
        <ol className="space-y-2 list-decimal list-inside">
          {game.tips.map((t, i) => <li key={i} className="text-gray-400">{t}</li>)}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {game.faq.map((f, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-1">{f.question}</h3>
              <p className="text-gray-400 text-sm">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Games */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">More Games You Might Like</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {related.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>
    </main>
  );
}

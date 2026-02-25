import { games, categories } from "@/lib/games";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://playsnow.top";
  const gamePages = games.map((g) => ({ url: `${base}/games/${g.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 }));
  const catPages = categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }));
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...gamePages,
    ...catPages,
    { url: `${base}/about`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.3 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), priority: 0.2 },
    { url: `${base}/terms`, lastModified: new Date(), priority: 0.2 },
  ];
}

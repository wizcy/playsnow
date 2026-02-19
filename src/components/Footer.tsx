import Link from "next/link";
import { categories } from "@/lib/games";

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="block text-sm text-gray-400 hover:text-white">{c.name} Games</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-gray-400 hover:text-white">About Us</Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <div className="space-y-2">
              <Link href="/privacy-policy" className="block text-sm text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-gray-400 hover:text-white">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">PlayNow</h3>
            <p className="text-sm text-gray-400">Free online games you can play instantly in your browser. No downloads, no sign-ups — just fun.</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PlayNow. All games are free to play online.
        </div>
      </div>
    </footer>
  );
}

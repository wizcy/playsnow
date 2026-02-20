import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-gray">
      <h1>About PlayNow</h1>
      <p>PlayNow is a free online gaming platform dedicated to bringing classic and beloved games to your browser. No downloads, no sign-ups, no hassle — just pick a game and start playing.</p>
      <h2>Our Mission</h2>
      <p>We believe great games should be accessible to everyone. Our carefully curated collection features timeless classics like Tetris, Snake, 2048, Chess, and more — all rebuilt with modern web technology for fast, smooth gameplay on any device.</p>
      <h2>How It Works</h2>
      <p>Every game on PlayNow is built with HTML5 and runs entirely in your browser. There is nothing to install and no account required. Our games work on desktop computers, laptops, tablets, and smartphones.</p>
      <h2>Contact</h2>
      <p>Have feedback, suggestions, or questions? We would love to hear from you at <a href="mailto:contact@playsnow.top">contact@playsnow.top</a>.</p>
    </main>
  );
}

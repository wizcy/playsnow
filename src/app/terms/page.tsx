import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-gray">
      <h1>Terms of Service</h1>
      <p><em>Last updated: February 2026</em></p>
      <p>By accessing PlayNow (playnow.fun), you agree to these terms.</p>
      <h2>Use of Service</h2>
      <p>PlayNow provides free browser-based games for entertainment. You may use our service for personal, non-commercial purposes. You agree not to attempt to disrupt, hack, or reverse-engineer our games or website.</p>
      <h2>Intellectual Property</h2>
      <p>Our original game implementations and website content are protected by copyright. Classic game concepts (like Tetris, Chess, etc.) are in the public domain, but our specific implementations are original works.</p>
      <h2>Disclaimer</h2>
      <p>Our games are provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of our service.</p>
      <h2>Changes</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
      <h2>Contact</h2>
      <p>Questions? Email us at contact@playnow.fun.</p>
    </main>
  );
}

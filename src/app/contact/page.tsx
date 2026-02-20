import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-gray">
      <h1>Contact Us</h1>
      <p>We would love to hear from you! Whether you have feedback, game suggestions, or questions, feel free to reach out.</p>
      <h2>Email</h2>
      <p><a href="mailto:wencyapp@gmail.com">wencyapp@gmail.com</a></p>
      <h2>Response Time</h2>
      <p>We typically respond within 48 hours.</p>
    </main>
  );
}

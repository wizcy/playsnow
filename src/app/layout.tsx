import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: { default: "PlayNow - Free Online Games | Play Instantly", template: "%s | PlayNow" },
  description: "Play the best free online games instantly in your browser. No downloads, no sign-ups. 2048, Snake, Tetris, Chess and more classic games.",
  keywords: "free online games, browser games, play games online, no download games, unblocked games",
  metadataBase: new URL("https://playsnow.top"),
  alternates: { canonical: "https://playsnow.top/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><GoogleAnalytics /></head>
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

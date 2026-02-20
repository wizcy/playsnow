import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-gray">
      <h1>Privacy Policy</h1>
      <p><em>Last updated: February 2026</em></p>
      <p>PlayNow (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the website playsnow.top. This page informs you of our policies regarding the collection, use, and disclosure of personal information.</p>
      <h2>Information We Collect</h2>
      <p>We do not require registration or collect personal information to play our games. We may collect anonymous usage data through Google Analytics, including pages visited, time spent, device type, and browser information.</p>
      <h2>Cookies</h2>
      <p>We use cookies for analytics and advertising purposes. Third-party services like Google Analytics and Google AdSense may set their own cookies. You can disable cookies in your browser settings.</p>
      <h2>Third-Party Advertising</h2>
      <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads">Google Ad Settings</a>.</p>
      <h2>Children&apos;s Privacy</h2>
      <p>Our games are suitable for all ages. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us.</p>
      <h2>Changes to This Policy</h2>
      <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>
      <h2>Contact Us</h2>
      <p>If you have questions about this privacy policy, please contact us at wencyapp@gmail.com.</p>
    </main>
  );
}

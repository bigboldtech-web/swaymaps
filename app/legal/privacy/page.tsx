import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-sky-400 hover:text-sky-300">
          &larr; Back to SwayMaps
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 8, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
            <p className="mt-2"><strong className="text-slate-200">Account Information:</strong> Name, email address, and password hash when you create an account.</p>
            <p className="mt-2"><strong className="text-slate-200">Content:</strong> Maps, nodes, edges, notes, and other content you create within SwayMaps.</p>
            <p className="mt-2"><strong className="text-slate-200">Usage Data:</strong> Pages visited, features used, device type, browser type, and IP address for analytics and service improvement.</p>
            <p className="mt-2"><strong className="text-slate-200">Payment Information:</strong> Processed securely by Stripe. We do not store your credit card details.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. How We Use Your Information</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>To provide and maintain the Service</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send transactional emails (welcome, billing, invites)</li>
              <li>To improve the Service and develop new features</li>
              <li>To provide customer support</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Data Sharing</h2>
            <p className="mt-2">We do not sell your personal information. We share data only with:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-slate-200">Service Providers:</strong> Stripe (payments), Resend (email), Vercel (hosting), Supabase (database)</li>
              <li><strong className="text-slate-200">Your Team:</strong> Workspace members can access shared maps according to their role permissions</li>
              <li><strong className="text-slate-200">Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Data Security</h2>
            <p className="mt-2">We implement industry-standard security measures including encryption in transit (TLS) and at rest, secure password hashing (bcrypt), and regular security reviews. No system is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Data Retention</h2>
            <p className="mt-2">We retain your data for as long as your account is active. Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law. Anonymized usage data may be retained indefinitely.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Your Rights</h2>
            <p className="mt-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data (available via JSON export)</li>
              <li>Object to data processing</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at privacy@swaymaps.com.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Cookies</h2>
            <p className="mt-2">We use essential cookies for authentication and session management. We use analytics cookies to understand how the Service is used. You can disable non-essential cookies in your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. International Transfers</h2>
            <p className="mt-2">Your data may be processed in countries outside your own. We ensure appropriate safeguards are in place for international data transfers in compliance with GDPR and other applicable laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">9. Children's Privacy</h2>
            <p className="mt-2">SwayMaps is not intended for use by children under 16. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">10. Changes to This Policy</h2>
            <p className="mt-2">We may update this Privacy Policy from time to time. We will notify you of material changes via email. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">11. Contact</h2>
            <p className="mt-2">For privacy-related questions, contact us at privacy@swaymaps.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

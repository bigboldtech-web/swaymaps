import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-brand-400 hover:text-brand-300">
          &larr; Back to SwayMaps
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 8, 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="mt-2">By accessing or using SwayMaps ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Description of Service</h2>
            <p className="mt-2">SwayMaps is a visual dependency mapping platform that allows users to create, share, and collaborate on system dependency maps. The Service is provided on a subscription basis with Free, Pro, and Team tiers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Accounts</h2>
            <p className="mt-2">You must provide accurate information when creating an account. You are responsible for maintaining the security of your account and password. You are responsible for all activities that occur under your account.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Subscriptions & Billing</h2>
            <p className="mt-2">Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by law. You may cancel your subscription at any time; access continues until the end of your current billing period. We may change pricing with 30 days notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Free Trials</h2>
            <p className="mt-2">We may offer free trials of paid plans. At the end of a trial, your account will be downgraded to the Free plan unless you add a payment method. We reserve the right to limit trial eligibility.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Your Content</h2>
            <p className="mt-2">You retain ownership of all content you create on SwayMaps ("Your Content"). You grant us a limited license to store, display, and process Your Content solely to provide the Service. We will not sell or share Your Content with third parties except as necessary to operate the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Acceptable Use</h2>
            <p className="mt-2">You agree not to: (a) use the Service for any illegal purpose; (b) upload malicious content; (c) attempt to gain unauthorized access to the Service; (d) interfere with other users; (e) reverse-engineer the Service; (f) exceed rate limits or abuse the API.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Termination</h2>
            <p className="mt-2">We may suspend or terminate your account for violation of these Terms. Upon termination, your right to use the Service ceases immediately. We will make your data available for export for 30 days after termination.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">9. Disclaimer of Warranties</h2>
            <p className="mt-2">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">10. Limitation of Liability</h2>
            <p className="mt-2">IN NO EVENT SHALL SWAYMAPS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">11. Changes to Terms</h2>
            <p className="mt-2">We may update these Terms from time to time. We will notify you of material changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">12. Contact</h2>
            <p className="mt-2">For questions about these Terms, contact us at legal@swaymaps.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

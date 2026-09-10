import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Paw & Keepsake collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <Link href="/" className="text-xs text-muted font-jakarta hover:text-accent transition-colors mb-8 inline-flex items-center gap-1.5">
        ← Back to Home
      </Link>

      <h1 className="font-fraunces text-3xl text-foreground font-light italic mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted font-jakarta mb-10">Last updated: September 2026</p>

      <div className="prose prose-sm max-w-none font-jakarta text-foreground leading-relaxed space-y-8">
        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Information We Collect</h2>
          <p className="text-muted mb-3">We collect information you provide directly to us, including:</p>
          <ul className="list-none space-y-1.5">
            {[
              'Name and email address (when placing an order or saving a draft)',
              'Shipping address (required to fulfill your order)',
              'Phone number (required by shipping carriers)',
              'Payment information (processed securely by Stripe — we never store card data)',
              'Customization details (pet name, breed, dates, memorial quote)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-trust mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">How We Use Your Information</h2>
          <ul className="list-none space-y-1.5">
            {[
              'To process and fulfill your order',
              'To send order confirmation and shipping tracking emails',
              'To respond to your customer service inquiries',
              'To improve our products and services',
              'To send occasional promotional emails (you may opt out at any time)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-trust mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Third-Party Services</h2>
          <div className="space-y-4">
            {[
              { name: 'Stripe', desc: 'Payment processing. Your card information is handled directly by Stripe and is never stored on our servers. Stripe is PCI DSS Level 1 certified.' },
              { name: 'Meta Pixel / Conversions API', desc: 'We use Meta\'s advertising tools to measure the effectiveness of our ads and to show relevant advertising. You can opt out via your Facebook ad settings.' },
              { name: 'Google Analytics 4', desc: 'We use Google Analytics to understand how visitors use our site. Data is anonymized and aggregated. You can opt out using the Google Analytics opt-out browser add-on.' },
              { name: 'Cloudflare R2', desc: 'We store generated print files (your personalized art) securely on Cloudflare\'s infrastructure. Files are retained for 90 days post-order.' },
            ].map(({ name, desc }) => (
              <div key={name} className="p-3 rounded-card border border-border bg-surface-subtle">
                <p className="font-semibold text-foreground text-sm mb-1">{name}</p>
                <p className="text-muted text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Your Rights (California Residents — CCPA)</h2>
          <p className="text-muted mb-3">
            If you are a California resident, you have the right to:
          </p>
          <ul className="list-none space-y-1.5">
            {[
              'Know what personal information we collect about you',
              'Request deletion of your personal information',
              'Opt out of the sale of your personal information (we do not sell personal data)',
              'Non-discrimination for exercising your CCPA rights',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-trust mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-muted text-sm mt-3">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:hello@pawandkeepsake.com" className="text-accent underline underline-offset-2">
              hello@pawandkeepsake.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Email Communications (CAN-SPAM)</h2>
          <p className="text-muted">
            If you subscribe to marketing emails, you may unsubscribe at any time by clicking the
            "Unsubscribe" link in any email or by emailing us directly. Transactional emails (order
            confirmations, shipping updates) cannot be opted out of as they are required to fulfill your order.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Data Retention</h2>
          <p className="text-muted">
            We retain order and customer data for up to 7 years as required by US tax law.
            Email marketing data is retained until you unsubscribe. You may request deletion of
            non-legally-required data at any time.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Contact</h2>
          <p className="text-muted">
            Questions about this Privacy Policy? Contact us at:{' '}
            <a href="mailto:hello@pawandkeepsake.com" className="text-accent hover:text-accent-hover underline underline-offset-2">
              hello@pawandkeepsake.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

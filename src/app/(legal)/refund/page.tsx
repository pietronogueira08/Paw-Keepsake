import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Replacement Policy',
  description: 'Our 14-day compassionate return policy. If you\'re not 100% moved, we\'ll make it right.',
};

export default function RefundPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <Link href="/" className="text-xs text-muted font-jakarta hover:text-accent transition-colors mb-8 inline-flex items-center gap-1.5">
        ← Back to Home
      </Link>

      <h1 className="font-fraunces text-3xl text-foreground font-light italic mb-2">Refund & Replacement Policy</h1>
      <p className="text-sm text-muted font-jakarta mb-4">Last updated: September 2026</p>

      <div className="p-4 rounded-card bg-accent/5 border border-accent/20 mb-10">
        <p className="font-fraunces text-lg text-foreground italic leading-relaxed">
          "If you are not 100% moved by your memorial piece, we will make it right — always."
        </p>
        <p className="text-xs text-muted font-jakarta mt-2">— Our Promise to Every Family</p>
      </div>

      <div className="prose prose-sm max-w-none font-jakarta text-foreground leading-relaxed space-y-8">
        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">14-Day Compassionate Return Policy</h2>
          <p className="text-muted">
            We understand that you are purchasing something deeply personal during what may be a difficult time.
            That is why we offer a full refund, no questions asked, within <strong className="text-foreground">14 days</strong>{' '}
            of receiving your order. Simply reach out to us — you do not need to return the piece.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">What Is Covered</h2>
          <ul className="list-none space-y-2">
            {[
              'You are not satisfied with the quality of the print or frame',
              'The piece does not match your order specifications',
              'Your order arrived damaged or defective',
              'You simply changed your mind within 14 days',
              'The wrong size or product type was delivered',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-trust mt-0.5 flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Damaged Items</h2>
          <p className="text-muted">
            If your piece arrives damaged due to shipping, please photograph the damage and email us
            within <strong className="text-foreground">48 hours</strong> of delivery. We will ship a
            replacement at no cost, typically within 2-3 business days of your report.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">How to Request a Refund or Replacement</h2>
          <ol className="list-none space-y-3">
            {[
              'Email us at hello@pawandkeepsake.com with your order number',
              'Briefly describe your concern (no detailed explanation required)',
              'We will respond within 12 hours with confirmation',
              'Your refund will be processed to your original payment method within 3-5 business days',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted">
                <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Contact Us</h2>
          <p className="text-muted">
            Email:{' '}
            <a href="mailto:hello@pawandkeepsake.com" className="text-accent hover:text-accent-hover underline underline-offset-2">
              hello@pawandkeepsake.com
            </a>
            <br />
            Response time: Within 12 hours, Monday–Sunday
          </p>
        </section>
      </div>
    </main>
  );
}

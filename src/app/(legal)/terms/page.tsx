import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service & Conditions of Sale',
  description:
    'Legal terms governing custom memorial artwork orders, manufacturing, warranties, and intellectual property at Paw & Keepsake.',
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Link
        href="/"
        className="text-xs text-muted font-jakarta hover:text-accent transition-colors mb-8 inline-flex items-center gap-1.5"
      >
        ← Back to Home
      </Link>

      <div className="mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-accent font-jakarta">
          Legal Agreement
        </span>
        <h1 className="font-fraunces text-3xl sm:text-4xl text-foreground font-light italic mt-1 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted font-jakarta">
          Effective Date: September 2026
        </p>
      </div>

      <div className="prose prose-sm max-w-none font-jakarta text-foreground leading-relaxed space-y-10">
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            1. Agreement to Terms
          </h2>
          <p className="text-muted leading-relaxed">
            By visiting our website and placing an order with <strong>Paw &amp; Keepsake</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service, our Privacy Policy, and our Refund &amp; Shipping Policies. If you do not agree with any part of these terms, please do not use our website or place an order.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            2. Custom Personalized Artwork
          </h2>
          <p className="text-muted leading-relaxed mb-3">
            Our products consist of individually crafted, personalized memorial wall art, canvases, and keepsake items tailored with your pet&apos;s name, dates, breed silhouette, and chosen tribute inscription:
          </p>
          <ul className="list-none space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-trust font-bold">•</span>
              <span><strong>Proofing &amp; Accuracy:</strong> Please carefully review all spelling, dates, and inscriptions prior to finalizing your order. Because each item is custom printed on demand, production commences shortly after checkout.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-trust font-bold">•</span>
              <span><strong>Artistic Style:</strong> Our artwork utilizes signature digital watercolor techniques designed for warm, expressive tribute aesthetics. Slight color variations may occur between backlit digital screens and printed physical canvas surfaces.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            3. Pricing &amp; Payment Processing
          </h2>
          <p className="text-muted leading-relaxed mb-3">
            All prices are stated in United States Dollars (USD). We reserve the right to adjust pricing or promotions at any time prior to order submission:
          </p>
          <ul className="list-none space-y-1.5 text-sm text-muted">
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span>Payment is due in full at the time of purchase via certified, secure payment processors.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span>Orders under $50 are charged a flat standard shipping rate of $8.95; orders of $50 or more qualify for free insured delivery across the contiguous USA.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span>We do not store credit card or sensitive payment credentials on our servers.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            4. Manufacturing &amp; Fulfillment
          </h2>
          <p className="text-muted leading-relaxed">
            All canvas and print orders are manufactured, stretched, and assembled in the USA through our trusted fulfillment infrastructure partner, <strong>Printify</strong>. We strive to fulfill and dispatch orders within 1 to 2 business days, with transit times ranging from 3 to 5 business days via USPS or UPS Ground.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            5. Lifetime Memory Guarantee &amp; Compassionate Refunds
          </h2>
          <p className="text-muted leading-relaxed mb-3">
            We understand the emotional nature of memorial art. We back every piece with our <strong>100% Lifetime Memory Guarantee</strong>:
          </p>
          <ul className="list-none space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>14-Day Compassionate Return Window:</strong> If you are not 100% moved by your artwork, contact us within 14 days of delivery for a full refund or a free replacement redesign.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Damaged in Transit:</strong> If your package arrives damaged by the carrier, we will expedite a brand new replacement canvas at zero cost to you.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            6. Intellectual Property &amp; Content Rights
          </h2>
          <p className="text-muted leading-relaxed mb-2">
            You retain all moral and personal rights to the names, memories, and photos you provide. By submitting your order details, you grant Paw &amp; Keepsake a limited, non-exclusive license solely to generate the print files and manufacture your physical goods.
          </p>
          <p className="text-muted leading-relaxed">
            All website design, brand typography, custom breed silhouette vector artwork, custom code, and marketing assets are the exclusive intellectual property of Paw &amp; Keepsake.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            7. Limitation of Liability
          </h2>
          <p className="text-muted leading-relaxed">
            To the maximum extent permitted by applicable law, Paw &amp; Keepsake and its directors, employees, and fulfillment partners shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our website or purchased goods. Our total aggregate liability for any claim arising from an order is limited strictly to the total purchase price paid for that order.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            8. Governing Law &amp; Dispute Resolution
          </h2>
          <p className="text-muted leading-relaxed">
            These Terms of Service are governed by and construed in accordance with the laws of the United States. In the unlikely event of a dispute, we encourage reaching out directly to our support team first to achieve a compassionate and prompt resolution.
          </p>
        </section>

        <section className="pt-6 border-t border-border">
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            9. Contact Information
          </h2>
          <p className="text-muted leading-relaxed">
            Questions regarding these Terms of Service should be directed to our support team:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-surface border border-border inline-block">
            <p className="text-sm font-semibold text-foreground">Paw &amp; Keepsake Support</p>
            <p className="text-sm mt-1">
              Email:{' '}
              <a
                href="mailto:pawkeepsake@gmail.com"
                className="text-accent hover:text-accent-hover font-semibold underline underline-offset-2"
              >
                pawkeepsake@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description: 'Learn about Paw & Keepsake shipping times, carriers, and free shipping policy.',
};

export default function ShippingPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <Link href="/" className="text-xs text-muted font-jakarta hover:text-accent transition-colors mb-8 inline-flex items-center gap-1.5">
        ← Back to Home
      </Link>

      <h1 className="font-fraunces text-3xl text-foreground font-light italic mb-2">Shipping & Delivery</h1>
      <p className="text-sm text-muted font-jakarta mb-10">Last updated: September 2026</p>

      <div className="prose prose-sm max-w-none font-jakarta text-foreground leading-relaxed space-y-8">
        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Processing Time</h2>
          <p className="text-muted">
            Every Paw & Keepsake memorial piece is made to order. Orders are processed and sent to our
            print studio within <strong className="text-foreground">1 business day</strong> of purchase.
            You will receive an email confirmation with your order details immediately after checkout.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Shipping Methods</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-card border border-border bg-surface-subtle">
              <p className="font-semibold text-foreground text-sm mb-1">USPS Priority Mail</p>
              <p className="text-muted text-sm">2-3 business days transit time. Includes tracking and up to $100 insurance.</p>
            </div>
            <div className="p-4 rounded-card border border-border bg-surface-subtle">
              <p className="font-semibold text-foreground text-sm mb-1">UPS Ground</p>
              <p className="text-muted text-sm">3-5 business days transit time. Full package tracking included.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Delivery Timeline</h2>
          <p className="text-muted">
            From order to doorstep, please allow <strong className="text-foreground">4-6 business days</strong>:
          </p>
          <ul className="list-none space-y-2 mt-3">
            {['Day 1: Order processed & sent to print studio', 'Days 2-3: Printing, quality inspection & packaging', 'Days 4-6: Carrier transit to your door'].map((step) => (
              <li key={step} className="flex items-start gap-2 text-sm text-muted">
                <span className="text-trust mt-0.5">✓</span>
                {step}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Free Insured Shipping</h2>
          <p className="text-muted">
            All orders of <strong className="text-foreground">$50 or more</strong> qualify for free insured
            shipping within the contiguous United States. Orders under $50 are charged a flat rate of
            <strong className="text-foreground"> $8.95</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Order Tracking</h2>
          <p className="text-muted">
            Once your order ships, you will receive an email with your tracking number. You can track
            your package directly on the USPS or UPS website. For support, email us at{' '}
            <a href="mailto:hello@pawandkeepsake.com" className="text-accent hover:text-accent-hover underline underline-offset-2">
              hello@pawandkeepsake.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Canada Shipping</h2>
          <p className="text-muted">
            We ship to Canada via USPS First Class International or UPS Standard. Transit time is
            7-14 business days. Canadian customers are responsible for any applicable customs duties or taxes.
            Flat rate of <strong className="text-foreground">$18.95</strong> applies.
          </p>
        </section>

        <section>
          <h2 className="font-fraunces text-xl text-foreground font-normal mb-3">Damaged or Lost Packages</h2>
          <p className="text-muted">
            If your order arrives damaged or is lost in transit, please contact us within 7 days of the
            expected delivery date. We will arrange a full replacement at no additional cost to you.
            See our{' '}
            <Link href="/refund" className="text-accent hover:text-accent-hover underline underline-offset-2">
              Refund & Replacement Policy
            </Link>{' '}
            for details.
          </p>
        </section>
      </div>
    </main>
  );
}

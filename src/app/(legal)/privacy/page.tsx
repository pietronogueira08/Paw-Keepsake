import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection',
  description:
    'How Paw & Keepsake collects, protects, and strictly safeguards your personal information. Zero data selling, 256-bit encryption, and full CCPA & GDPR compliance.',
};

export default function PrivacyPage() {
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
          Your Trust &amp; Privacy
        </span>
        <h1 className="font-fraunces text-3xl sm:text-4xl text-foreground font-light italic mt-1 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted font-jakarta">
          Effective &amp; Last Updated: September 2026
        </p>
      </div>

      {/* Zero Data Selling Hero Box */}
      <div className="p-5 rounded-2xl bg-trust/10 border border-trust/20 mb-10">
        <div className="flex items-center gap-2 text-trust font-semibold text-sm font-jakarta mb-1">
          <span>🛡️</span>
          <span>Our Sacred Privacy Commitment</span>
        </div>
        <p className="text-xs sm:text-sm text-foreground/90 font-jakarta leading-relaxed">
          We treat the memory of your beloved pet with reverence and dignity. 
          <strong> We DO NOT sell, rent, lease, or monetize your personal information or pet memories to data brokers, ad networks, or unauthorized third parties under any circumstances.</strong> Your information is used strictly to craft and deliver your memorial art.
        </p>
      </div>

      <div className="prose prose-sm max-w-none font-jakarta text-foreground leading-relaxed space-y-10">
        {/* 1. Information We Collect */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            1. Information We Collect &amp; Principle of Data Minimization
          </h2>
          <p className="text-muted mb-4">
            In compliance with global data privacy principles, we practice strict data minimization. We only collect information strictly required to manufacture, process, and ship your memorial artwork:
          </p>
          <ul className="list-none space-y-2">
            {[
              {
                title: 'Order & Shipping Details',
                desc: 'Your name, shipping address, and phone number (required by USPS/UPS delivery carriers to deliver your physical package).',
              },
              {
                title: 'Contact Information',
                desc: 'Your email address, used exclusively to send your order receipt, proof notifications, and package tracking updates.',
              },
              {
                title: 'Custom Memorial Details',
                desc: 'Pet name, breed silhouette, lifespan dates, and chosen tribute inscription required to generate your custom fine art print file.',
              },
              {
                title: 'Payment Data (Zero Raw Storage)',
                desc: 'Payment processing is handled via direct end-to-end 256-bit encrypted connections with certified PCI-DSS Level 1 payment processors. We never see, store, or transmit your credit card number or CVV code on our servers.',
              },
              {
                title: 'Technical Session Data',
                desc: 'Local browser storage for cart persistence and rate-limiting cookies to prevent automated abuse of our free AI quote generator.',
              },
            ].map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-2.5 text-sm text-muted">
                <span className="text-trust mt-0.5 flex-shrink-0 font-bold">•</span>
                <div>
                  <strong className="text-foreground">{title}:</strong> {desc}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Zero Data Selling */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            2. We Do Not Sell or Share Your Personal Information
          </h2>
          <p className="text-muted leading-relaxed">
            Under the California Consumer Privacy Act (CCPA), California Privacy Rights Act (CPRA), and European GDPR, selling or sharing personal information includes transferring data to third parties for monetary value or cross-context behavioral advertising.
          </p>
          <p className="text-muted mt-2 leading-relaxed">
            <strong>Paw &amp; Keepsake has never sold, does not sell, and will never sell or share customer personal information.</strong> We do not participate in advertising data exchanges, nor do we build behavioral profiles for third-party monetization.
          </p>
        </section>

        {/* 3. Third-Party Service Providers */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            3. Authorized Service Providers &amp; Fulfillment
          </h2>
          <p className="text-muted mb-4">
            We partner exclusively with reputable, enterprise-grade infrastructure providers under strict confidentiality and data protection agreements:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                name: 'Printify (Print Fulfillment)',
                desc: 'Our USA-based artisan printing partner. When you order, your shipping address and custom high-resolution print file are securely transmitted to Printify solely to print and box your piece.',
              },
              {
                name: 'Cloudflare R2 (Encrypted Storage)',
                desc: 'High-resolution print assets are stored in private, encrypted cloud storage on Cloudflare infrastructure, automatically purged after fulfillment.',
              },
              {
                name: 'Google Analytics 4 (Anonymized)',
                desc: 'Aggregate website visitor statistics with IP anonymization enabled. Zero customer names, emails, or personal details are ever sent to analytics.',
              },
              {
                name: 'Certified Payment Gateways',
                desc: 'Bank-grade, PCI-DSS Level 1 compliant processors handling checkout transactions with 256-bit SSL encryption.',
              },
            ].map(({ name, desc }) => (
              <div key={name} className="p-4 rounded-xl border border-border bg-surface-subtle">
                <p className="font-semibold text-foreground text-sm mb-1">{name}</p>
                <p className="text-muted text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Security & Encryption Standards */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            4. Security &amp; Encryption Standards
          </h2>
          <p className="text-muted leading-relaxed mb-3">
            We implement comprehensive technical and organizational safeguards to protect customer data from unauthorized access, loss, or disclosure:
          </p>
          <ul className="list-none space-y-1.5 text-sm text-muted">
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span><strong>TLS 1.3 / 256-Bit SSL:</strong> All data transmitted between your browser and our servers is encrypted in transit.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span><strong>HSTS Enforced:</strong> HTTP Strict Transport Security ensures all connections are automatically upgraded to secure HTTPS.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span><strong>Strict Access Controls:</strong> Only authorized studio staff have access to order management dashboards.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">✓</span>
              <span><strong>Log Sanitization:</strong> Internal server logs redact customer emails and phone numbers to eliminate accidental exposure.</span>
            </li>
          </ul>
        </section>

        {/* 5. Your Rights: CCPA, GDPR, LGPD */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            5. Your Global Privacy Rights (CCPA / GDPR / LGPD)
          </h2>
          <p className="text-muted mb-3">
            Regardless of where you reside, Paw &amp; Keepsake extends the highest global privacy standards to all customers:
          </p>
          <ul className="list-none space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Right to Know &amp; Access:</strong> You may request a complete copy of all personal information we hold regarding your account or orders.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Right to Deletion (&quot;Right to be Forgotten&quot;):</strong> You may request permanent deletion of your customer record, draft designs, or order history (excluding records mandated by tax law).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Right to Correction:</strong> You may correct inaccurate shipping details or contact information before production begins.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent font-bold">•</span>
              <span><strong>Right to Non-Discrimination:</strong> We never deny service, charge different prices, or provide different quality to customers exercising their privacy rights.</span>
            </li>
          </ul>
          <p className="text-muted text-sm mt-4">
            To submit an access, deletion, or privacy request, email us directly at{' '}
            <a href="mailto:pawkeepsake@gmail.com" className="text-accent font-semibold underline underline-offset-2">
              pawkeepsake@gmail.com
            </a>
            . We process and confirm all verified requests within 48 hours.
          </p>
        </section>

        {/* 6. Children's Privacy */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            6. Children&apos;s Online Privacy (COPPA Compliance)
          </h2>
          <p className="text-muted leading-relaxed">
            Our services are intended strictly for adult pet parents and gift buyers aged 18 and older. We do not knowingly solicit, collect, or store personal information from children under the age of 13. If you believe a minor has submitted personal information to our site, please contact us immediately for prompt deletion.
          </p>
        </section>

        {/* 7. Email Marketing & CAN-SPAM Compliance */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            7. Email Communications &amp; CAN-SPAM Act
          </h2>
          <p className="text-muted leading-relaxed">
            We adhere strictly to the CAN-SPAM Act:
          </p>
          <ul className="list-none space-y-1.5 text-sm text-muted mt-2">
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">•</span>
              <span><strong>Transactional Emails:</strong> Order receipts and tracking numbers are sent solely to complete your purchase.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-trust font-bold">•</span>
              <span><strong>Opt-In Marketing:</strong> Promotional or remembrance emails require explicit consent and include a clear, instant 1-click &quot;Unsubscribe&quot; link in every footer.</span>
            </li>
          </ul>
        </section>

        {/* 8. Data Retention */}
        <section>
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            8. Data Retention Schedule
          </h2>
          <p className="text-muted leading-relaxed">
            Order invoices and transaction logs are retained for up to 7 years solely to satisfy statutory US tax and financial audit requirements. Generated high-resolution print files are securely archived for 90 days after delivery to honor our 100% Lifetime Memory Guarantee, after which they are automatically purged.
          </p>
        </section>

        {/* 9. Contact */}
        <section className="pt-6 border-t border-border">
          <h2 className="font-fraunces text-2xl text-foreground font-normal mb-3">
            9. Privacy Officer &amp; Inquiries
          </h2>
          <p className="text-muted leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy, please contact our dedicated support team:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-surface border border-border inline-block">
            <p className="text-sm font-semibold text-foreground">Paw &amp; Keepsake Studio</p>
            <p className="text-xs text-muted mt-0.5">Privacy &amp; Data Protection</p>
            <p className="text-sm mt-2">
              Email:{' '}
              <a
                href="mailto:pawkeepsake@gmail.com"
                className="text-accent hover:text-accent-hover font-semibold underline underline-offset-2"
              >
                pawkeepsake@gmail.com
              </a>
            </p>
            <p className="text-xs text-muted mt-1">Average Response: Within 12 hours</p>
          </div>
        </section>
      </div>
    </main>
  );
}

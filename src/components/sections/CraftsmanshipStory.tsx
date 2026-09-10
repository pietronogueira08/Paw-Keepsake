'use client';

import { motion } from 'framer-motion';

const PROCESS_STEPS = [
  {
    emoji: '📸',
    title: 'You Share the Details',
    description: 'Select your pet\'s breed, add their name and the dates that defined your time together.',
  },
  {
    emoji: '🎨',
    title: 'We Design Your Memorial',
    description: 'Our artists generate a bespoke watercolor illustration styled specifically for your dog\'s breed.',
  },
  {
    emoji: '🖨️',
    title: 'Museum-Grade Printing',
    description: 'Every piece is printed at 300 DPI on 300 GSM fine art paper or professional stretched canvas.',
  },
  {
    emoji: '📦',
    title: 'Arrives at Your Door',
    description: 'Carefully packaged and shipped with tracking via USPS or UPS. Arrives in 4-6 business days.',
  },
];

const MATERIAL_CALLOUTS = [
  '300 GSM Fine Art Paper',
  'Gallery UV-Protective Coating',
  'Solid Wood Stretcher Bars',
  'Acid-Free Archival Materials',
  'Lifetime Colorfastness',
];

export function CraftsmanshipStory() {
  return (
    <section className="w-full bg-background py-20 lg:py-28" aria-labelledby="craftsmanship-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-jakarta uppercase tracking-widest text-muted mb-3">
            Our Process
          </p>
          <h2 id="craftsmanship-heading" className="font-fraunces text-3xl lg:text-4xl text-foreground font-light italic leading-snug mb-4">
            Crafted With the Care Their Memory Deserves
          </h2>
          <p className="text-muted font-jakarta text-base leading-relaxed">
            Every piece is individually printed and assembled by our team of artisans in the USA,
            on museum-grade materials that outlast generations.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {PROCESS_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl" aria-hidden="true">
                {step.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-accent font-jakarta">
                    Step {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-fraunces text-lg text-foreground font-normal mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-muted font-jakarta leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Material callouts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {MATERIAL_CALLOUTS.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-trust/30 bg-trust/5 text-xs font-jakarta text-trust"
            >
              ✓ {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

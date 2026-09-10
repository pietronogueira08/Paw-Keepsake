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
    <section className="w-full bg-background py-16 md:py-24" aria-labelledby="craftsmanship-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <p className="text-xs font-jakarta uppercase tracking-wider text-muted mb-3 font-semibold">
            Our Process
          </p>
          <h2 id="craftsmanship-heading" className="font-fraunces text-3xl md:text-4xl lg:text-5xl text-foreground font-light italic leading-tight mb-6">
            Crafted With the Care Their Memory Deserves
          </h2>
          <p className="text-muted font-jakarta text-lg leading-relaxed">
            Every piece is individually printed and assembled by our team of artisans in the USA,
            on museum-grade materials that outlast generations.
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {PROCESS_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="flex flex-col"
            >
              <div className="w-14 h-14 rounded-full bg-[--bg-page] flex items-center justify-center text-2xl mb-4 border border-[--border-default]" aria-hidden="true">
                {step.emoji}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B88A58] font-jakarta mb-2 block">
                  Step {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-fraunces text-xl text-foreground font-normal mb-3 leading-snug mt-3">
                  {step.title}
                </h3>
                <p className="text-base text-muted font-jakarta leading-relaxed">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-trust/20 bg-white shadow-sm text-sm font-jakarta text-trust"
            >
              ✓ {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

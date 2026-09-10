'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Does the canvas arrive ready to hang?',
    answer:
      'Yes — every custom canvas ships with pre-installed museum-grade hanging hardware and adhesive wall bumpers already attached to the back. Just find your spot on the wall and hang it. No tools, no fuss.',
  },
  {
    question: 'How long does production and shipping take?',
    answer:
      'All pieces are printed and carefully assembled in the USA within 2–3 business days of your order. From there, USPS Priority or UPS delivers to your door in 3–5 business days — with real-time tracking sent directly to your email.',
  },
  {
    question: "What if my print arrives damaged or isn't perfect?",
    answer:
      "We stand behind every piece with our 100% Lifetime Memory Guarantee. If anything arrives damaged during shipping or doesn't meet your expectations, we'll reprint and ship a brand-new piece immediately — at absolutely zero cost to you. No questions asked.",
  },
  {
    question: 'Can I customize the quote or font style?',
    answer:
      'Absolutely. During personalization you can choose from our collection of timeless, heartfelt quotes curated by our team — or enter your own custom message, a poem, or a line that was uniquely yours with your pet. The design will always feel personal.',
  },
];

function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const answerId = useId();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 280, damping: 28 }}
      className={cn(
        'border rounded-2xl transition-colors duration-200',
        isOpen ? 'border-accent/30 bg-accent/3' : 'border-border bg-surface',
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-fraunces text-base sm:text-lg font-normal text-foreground leading-snug">
          {item.question}
        </span>
        <span className={cn('mt-0.5 shrink-0 transition-colors', isOpen ? 'text-[--accent]' : 'text-[--text-secondary]')}>
          <PlusIcon isOpen={isOpen} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm sm:text-base text-muted font-jakarta leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqAccordion() {
  return (
    <section className="w-full bg-surface-subtle py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="text-center mb-10 sm:mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent font-jakarta mb-3">
            Got Questions?
          </p>
          <h2 className="font-fraunces text-3xl sm:text-4xl text-foreground font-light italic">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted font-jakarta text-sm sm:text-base max-w-md mx-auto">
            Crafted with care — and answered with honesty.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.question} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

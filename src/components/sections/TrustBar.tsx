'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Sparkles, HeartHandshake } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Free Insured US Shipping',
    subtitle: 'On orders $50+ • 4-6 day tracked delivery via USPS & FedEx',
  },
  {
    icon: ShieldCheck,
    title: '100% Lifetime Memory Guarantee',
    subtitle: 'If it doesn’t bring you total peace, we replace it free of charge',
  },
  {
    icon: Sparkles,
    title: 'Museum-Grade Canvas & Inks',
    subtitle: '300 GSM archival cotton blend • UV-protective coating that never fades',
  },
  {
    icon: HeartHandshake,
    title: 'Handcrafted in the USA',
    subtitle: 'Individually printed, hand-stretched & assembled with love in Ohio',
  },
];

export function TrustBar() {
  return (
    <section
      className="w-full bg-[#FAF8F5] border-y border-[--border-default] py-8 sm:py-10"
      aria-label="Trust and Guarantees"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-start gap-3.5 sm:gap-4 p-2"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-[--border-default] shadow-xs flex items-center justify-center shrink-0 text-[--accent]">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-jakarta font-bold text-sm sm:text-[15px] text-[--text-primary] leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="font-jakarta text-xs sm:text-[13px] text-[--text-secondary] leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

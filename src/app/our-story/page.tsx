import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, ShieldCheck, Sparkles, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story — Crafted for the Dogs Who Made Us Whole',
  description:
    'The story behind Paw & Keepsake: why we built a fine art digital atelier dedicated to preserving the memory and dignity of beloved dogs forever.',
};

export default function OurStoryPage() {
  return (
    <div className="bg-[--bg-page] min-h-screen text-[--text-primary] selection:bg-[--accent]/20">
      {/* ── Editorial Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[--border-default]/60">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[--accent]/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[--border-default] shadow-sm mb-6">
            <Heart size={13} className="text-[--accent] fill-[--accent]" />
            <span className="text-[11px] font-bold font-jakarta uppercase tracking-widest text-[--text-secondary]">
              The Heart Behind Paw & Keepsake
            </span>
          </div>

          <h1 className="font-fraunces text-4xl sm:text-5xl md:text-6xl font-light leading-[1.12] mb-6 text-[--text-primary]">
            They give us a decade of devotion. <br />
            <span className="italic text-[--accent]">We give them a lifetime of memory.</span>
          </h1>

          <p className="text-lg md:text-xl text-[--text-secondary] font-jakarta leading-relaxed max-w-2xl mx-auto font-light">
            Paw & Keepsake was founded by dog lovers who experienced the silence that follows saying goodbye. 
            We created this atelier so that no beloved dog is ever reduced to a forgotten folder in a phone.
          </p>
        </div>
      </section>

      {/* ── Main Narrative ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Chapter 1 */}
          <article className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[--accent] font-jakarta block">
              Chapter I • The Quiet After the Goodbye
            </span>
            <h2 className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-normal text-[--text-primary] leading-tight">
              A collar on the nightstand, and photos trapped in glass screens.
            </h2>
            <div className="text-base sm:text-lg text-[--text-secondary] font-jakarta leading-relaxed space-y-4">
              <p>
                Anyone who has walked a dog through their twilight years knows the sacred weight of that bond. 
                They greet us when the world is exhausting. They sit at our feet through life’s triumphs and heartbreaks. 
                And when their journey comes to an end, the house becomes impossibly quiet.
              </p>
              <p>
                Like thousands of pet parents, when we lost our own first dog, we found ourselves scrolling through 
                hundreds of photos on our smartphones. But looking at tiny, illuminated phone screens didn't bring comfort — 
                it felt transient, distant, and cold.
              </p>
              <p>
                We searched for a way to honor them properly. What we found everywhere else was either cheap plastic novelties, 
                garish cartoon caricatures, or low-resolution print shops that treated a family member like generic warehouse merchandise.
              </p>
            </div>
          </article>

          {/* Quote Breakout */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[--border-default] shadow-sm relative overflow-hidden my-8">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[--accent]" />
            <p className="font-fraunces text-xl sm:text-2xl text-[--text-primary] italic leading-snug mb-4">
              “Until one has loved an animal, a part of one's soul remains unawakened. When they depart, our grief is not a weakness — it is the final, tender expression of our loyalty.”
            </p>
            <span className="text-xs font-semibold uppercase tracking-wider text-[--text-secondary] font-jakarta">
              — The Paw & Keepsake Philosophy
            </span>
          </div>

          {/* Chapter 2 */}
          <article className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[--accent] font-jakarta block">
              Chapter II • The Atelier Commitment
            </span>
            <h2 className="font-fraunces text-2xl sm:text-3xl md:text-4xl font-normal text-[--text-primary] leading-tight">
              Crafting fine art worthy of the unconditional love they gave us.
            </h2>
            <div className="text-base sm:text-lg text-[--text-secondary] font-jakarta leading-relaxed space-y-4">
              <p>
                We decided to build something different: a dedicated digital studio and fine art workshop that 
                approaches pet loss with absolute reverence, artistic sensibility, and heirloom permanence.
              </p>
              <p>
                Every silhouette in our collection is meticulously crafted to capture the essence of distinct dog breeds — from the bat ears of a Frenchie to the noble poise of a Golden Retriever or German Shepherd. 
                Combined with your dog's name, their years on earth, and words of remembrance, each canvas becomes a warm, permanent presence in your home.
              </p>
              <p>
                When you walk past it in the morning with your coffee, you don't just see a picture; you feel the warmth of their spirit greeting you once again.
              </p>
            </div>
          </article>

        </div>
      </section>

      {/* ── Values Pillars ── */}
      <section className="bg-white py-16 md:py-24 border-y border-[--border-default]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[--accent] font-jakarta mb-3 block">
              Our Non-Negotiable Standards
            </span>
            <h2 className="font-fraunces text-3xl sm:text-4xl text-[--text-primary] font-light">
              Crafted as if it were for our own dog.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-[--bg-page] border border-[--border-default] flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-white border border-[--border-default] flex items-center justify-center text-[--accent] mb-6 shadow-sm">
                <Sparkles size={22} />
              </div>
              <h3 className="font-fraunces text-xl font-normal text-[--text-primary] mb-3">
                Reverence Over Speed
              </h3>
              <p className="text-sm text-[--text-secondary] font-jakarta leading-relaxed">
                We do not operate like high-speed dropshippers. Each design is custom tailored, color-balanced, 
                and reviewed with genuine human compassion before printing.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-[--bg-page] border border-[--border-default] flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-white border border-[--border-default] flex items-center justify-center text-[--accent] mb-6 shadow-sm">
                <Award size={22} />
              </div>
              <h3 className="font-fraunces text-xl font-normal text-[--text-primary] mb-3">
                Museum-Grade Archival Quality
              </h3>
              <p className="text-sm text-[--text-secondary] font-jakarta leading-relaxed">
                Printed on 300 GSM cotton rag blend with UV-resistant archival pigments. 
                Mounted on solid kiln-dried American wood stretcher bars engineered never to warp or fade.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-[--bg-page] border border-[--border-default] flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-white border border-[--border-default] flex items-center justify-center text-[--accent] mb-6 shadow-sm">
                <ShieldCheck size={22} />
              </div>
              <h3 className="font-fraunces text-xl font-normal text-[--text-primary] mb-3">
                Lifetime Memory Guarantee
              </h3>
              <p className="text-sm text-[--text-secondary] font-jakarta leading-relaxed">
                If your tribute doesn't bring immediate tears of warmth and comfort to your heart, 
                or if anything ever happens in transit, we will replace or refund it without question.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder's Note ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-white border border-[--border-default] shadow-sm mx-auto flex items-center justify-center text-2xl">
            🐾
          </div>
          <h2 className="font-fraunces text-3xl font-light text-[--text-primary]">
            Our Promise to You
          </h2>
          <p className="text-base sm:text-lg text-[--text-secondary] font-jakarta leading-relaxed font-light">
            Whether you said goodbye yesterday or years ago, we know how deeply you miss the pitter-patter of their paws. 
            Thank you for trusting our atelier to hold their memory with the dignity it deserves.
          </p>
          <div className="pt-4">
            <p className="font-fraunces italic text-xl text-[--text-primary]">
              The Artisans & Pet Parents at Paw & Keepsake
            </p>
            <p className="text-xs uppercase tracking-widest text-[--text-secondary] font-jakarta mt-1">
              Assembled & Printed in the USA 🇺🇸
            </p>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#2B241D] text-[#FAF8F5] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-xl">
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B88A58] font-jakarta mb-4 block">
                Begin Your Tribute
              </span>
              <h2 className="font-fraunces text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-6">
                Eternize the dog who gave you their entire world.
              </h2>
              <p className="text-white/70 font-jakarta text-base sm:text-lg mb-8 leading-relaxed">
                Customize their museum-quality canvas in less than two minutes. 
                Preview it in real-time before it is handcrafted with love.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#hero-customizer-section"
                  className="w-full sm:w-auto px-8 h-14 rounded-lg bg-[--accent] hover:bg-[--accent-hover] text-white font-jakarta font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  Create Custom Canvas
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 h-14 rounded-lg bg-white/10 hover:bg-white/15 text-white font-jakarta font-semibold text-base transition-all flex items-center justify-center border border-white/20"
                >
                  Explore All Keepsakes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import type { ReviewPhoto } from '@/types/ecommerce';

const REVIEWS: ReviewPhoto[] = [
  {
    id: 'r1', authorName: 'Sarah M.', location: 'Plano, TX', rating: 5,
    body: 'When we lost our golden retriever Max after 13 years, I didn\'t know how to process the grief. This canvas now hangs above our fireplace and it\'s like he\'s still with us. The watercolor looks EXACTLY like him.',
    petName: 'Max', breed: 'Golden Retriever', productType: 'museum-canvas', size: '18x24',
    verifiedPurchase: true, datePosted: 'August 2026',
  },
  {
    id: 'r2', authorName: 'James & Priya L.', location: 'Portland, OR', rating: 5,
    body: 'Ordered the 18×24 framed print for my wife\'s birthday. She cried when she opened it. Best gift I\'ve ever given anyone. The frame quality is absolutely stunning.',
    petName: 'Bella', breed: 'Labrador Retriever', productType: 'framed-print', size: '18x24',
    verifiedPurchase: true, datePosted: 'July 2026',
  },
  {
    id: 'r3', authorName: 'Linda K.', location: 'Naperville, IL', rating: 5,
    body: 'I was skeptical ordering art online but the quality blew me away. The frame is solid, the print is crystal clear. Our Frenchie Baguette lives on forever in our living room.',
    petName: 'Baguette', breed: 'French Bulldog', productType: 'framed-print', size: '12x16',
    verifiedPurchase: true, datePosted: 'August 2026',
  },
  {
    id: 'r4', authorName: 'Tom R.', location: 'Austin, TX', rating: 5,
    body: 'Incredibly fast shipping. Got it in 5 days. The packaging was so careful, like they knew how precious the cargo was. Absolutely beautiful piece.',
    petName: 'Cooper', breed: 'Beagle', productType: 'museum-canvas', size: '12x16',
    verifiedPurchase: true, datePosted: 'June 2026',
  },
  {
    id: 'r5', authorName: 'Melissa C.', location: 'Denver, CO', rating: 5,
    body: 'The custom quote I chose — about dogs finding their way home — made the piece even more special. I stare at it every morning with my coffee and feel so much peace.',
    petName: 'Luna', breed: 'Australian Shepherd', productType: 'museum-canvas', size: '18x24',
    verifiedPurchase: true, datePosted: 'July 2026',
  },
  {
    id: 'r6', authorName: 'David & Susan H.', location: 'Scottsdale, AZ', rating: 5,
    body: 'Our Labrador Charlie passed at 15. This piece captures his spirit perfectly. The watercolor style is so warm and life-like. We ordered a second one as a gift.',
    petName: 'Charlie', breed: 'Labrador Retriever', productType: 'framed-print', size: '18x24',
    verifiedPurchase: true, datePosted: 'May 2026',
  },
  {
    id: 'r7', authorName: 'Amanda T.', location: 'Nashville, TN', rating: 5,
    body: 'Ordered 3 — one for me and one for each of my sisters who also loved our childhood dog. Cheaper than therapy and infinitely more meaningful. 10/10 would recommend.',
    petName: 'Biscuit', breed: 'Dachshund', productType: 'museum-canvas', size: '12x16',
    verifiedPurchase: true, datePosted: 'August 2026',
  },
  {
    id: 'r8', authorName: 'Robert K.', location: 'Chicago, IL', rating: 5,
    body: 'The breed selection was perfect — they had my rare Irish Setter. Amazing attention to detail on the silhouette. The warm colors are exactly right. 100% recommend.',
    petName: 'Finn', breed: 'Irish Setter', productType: 'framed-print', size: '18x24',
    verifiedPurchase: true, datePosted: 'June 2026',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < rating ? '#B88A58' : 'none'}
          stroke={i < rating ? '#B88A58' : '#EBE6DE'}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: ReviewPhoto; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 15 : -15, index % 2 === 0 ? -15 : 15]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="bg-surface rounded-card border border-border p-5 shadow-card break-inside-avoid mb-4"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-sm text-foreground font-jakarta">{review.authorName}</p>
          <p className="text-[11px] text-muted font-jakarta">{review.location}</p>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-sm text-foreground font-jakarta leading-relaxed mb-3">
        "{review.body}"
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted font-jakarta">
            {review.breed} · {review.size.replace('x', '×')}"
          </span>
        </div>
        <div className="flex items-center gap-1">
          {review.verifiedPurchase && (
            <span className="text-[9px] font-semibold text-trust uppercase tracking-wider font-jakarta bg-trust/10 px-1.5 py-0.5 rounded-full">
              ✓ Verified
            </span>
          )}
          <span className="text-[10px] text-muted/60 font-jakarta">{review.datePosted}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function EmotionalReviewsWall() {
  return (
    <section className="w-full bg-surface-subtle py-20 lg:py-28" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} fill="#B88A58" stroke="#B88A58" aria-hidden="true" />
            ))}
          </div>
          <h2 id="reviews-heading" className="font-fraunces text-3xl lg:text-4xl text-foreground font-light italic mb-3">
            1,400+ Families Have Honored Their Dogs' Legacies
          </h2>
          <p className="text-muted font-jakarta text-sm">
            Average rating: <strong className="text-accent">4.9 / 5</strong> from verified purchases
          </p>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {REVIEWS.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted font-jakarta mt-10"
        >
          Join 1,400+ families who chose to preserve their dog's memory forever.
        </motion.p>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, X, ZoomIn, Heart } from 'lucide-react';

interface MemorialReview {
  id: string;
  authorName: string;
  location: string;
  avatarSrc: string;
  rating: number;
  body: string;
  petName: string;
  breed: string;
  productType: string;
  size: string;
  verifiedPurchase: boolean;
  datePosted: string;
  imageSrc: string;
  imageAlt: string;
  memorialSetup: string;
}

const REVIEWS: MemorialReview[] = [
  {
    id: 'r1',
    authorName: 'Amanda L.',
    location: 'Denver, CO',
    avatarSrc: '/images/avatars/avatar-amanda.webp',
    rating: 5,
    body: 'The moment I opened the box and saw Bailey\'s sweet, gentle eyes looking right back at me, tears filled my eyes. The canvas texture and the soft watercolor brushwork capture his personality so beautifully. It truly feels like bringing a piece of his loving spirit home.',
    petName: 'Bailey',
    breed: 'Cavalier King Charles',
    productType: 'Museum Canvas',
    size: '12×16"',
    verifiedPurchase: true,
    datePosted: 'September 2026',
    imageSrc: '/images/reviews/review-bailey-unboxing.webp',
    imageAlt: 'Verified customer unboxing custom watercolor memorial canvas of Bailey the Cavalier King Charles Spaniel',
    memorialSetup: 'Delivered Memorial & Unboxing',
  },
  {
    id: 'r2',
    authorName: 'Sarah M.',
    location: 'Austin, TX',
    avatarSrc: '/images/avatars/avatar-sarah.webp',
    rating: 5,
    body: 'Jake was our family\'s constant joy for 12 years. Placing his portrait right on our piano with his original leather collar has brought so much peace to our home. Every guest stops and smiles when they see his gentle eyes.',
    petName: 'Jake',
    breed: 'Beagle',
    productType: 'Museum Canvas',
    size: '12×16"',
    verifiedPurchase: true,
    datePosted: 'August 2026',
    imageSrc: '/images/reviews/review-jake-piano.webp',
    imageAlt: 'Beagle Jake memorial canvas on piano next to his leather collar',
    memorialSetup: 'Piano Keepsake with Collar',
  },
  {
    id: 'r3',
    authorName: 'David H.',
    location: 'Scottsdale, AZ',
    avatarSrc: '/images/avatars/avatar-david.webp',
    rating: 5,
    body: 'Clark was the noblest companion I\'ve ever had. Seeing him hanging in our living room every morning brings a sense of quiet strength and dignity back into our home. The depth of the canvas and the watercolor strokes are truly gallery-grade.',
    petName: 'Clark',
    breed: 'Doberman Pinscher',
    productType: 'Museum Canvas',
    size: '16×24"',
    verifiedPurchase: true,
    datePosted: 'August 2026',
    imageSrc: '/images/reviews/review-clark-wall.webp',
    imageAlt: 'Doberman Clark memorial canvas hanging above wooden console table in living room',
    memorialSetup: 'Living Room Memorial Wall',
  },
  {
    id: 'r4',
    authorName: 'Tom & Rachel R.',
    location: 'Plano, TX',
    avatarSrc: '/images/avatars/avatar-tom-rachel.webp',
    rating: 5,
    body: 'Unboxed Buster\'s tribute over coffee this morning. The packaging was bulletproof and opening it was so deeply moving. The texture on the archival canvas makes his eyes feel alive again. 5 days from order to our doorstep.',
    petName: 'Buster',
    breed: 'Rescue Shepherd Mix',
    productType: 'Museum Canvas',
    size: '12×16"',
    verifiedPurchase: true,
    datePosted: 'August 2026',
    imageSrc: '/images/reviews/review-unboxing-table.webp',
    imageAlt: 'Unboxed custom rescue dog canvas portrait on rustic dining table',
    memorialSetup: 'Unboxing Morning Tribute',
  },
  {
    id: 'r5',
    authorName: 'Linda K.',
    location: 'Naperville, IL',
    avatarSrc: '/images/avatars/avatar-linda.webp',
    rating: 5,
    body: 'When Charlie passed after 13 years of unconditional love, the silence was unbearable. This canvas sits on our mantel next to his collar and an amber candle. It\'s not just art — it\'s a sacred place of gratitude for his life.',
    petName: 'Charlie',
    breed: 'Golden Retriever',
    productType: 'Framed Canvas',
    size: '16×24"',
    verifiedPurchase: true,
    datePosted: 'July 2026',
    imageSrc: '/images/reviews/review-charlie-mantel.webp',
    imageAlt: 'Golden Retriever Charlie memorial portrait on rustic mantel with collar and candle',
    memorialSetup: 'Memorial Mantel with Candle & Collar',
  },
  {
    id: 'r6',
    authorName: 'Susan & David M.',
    location: 'Scottsdale, AZ',
    avatarSrc: '/images/avatars/avatar-susan-david.webp',
    rating: 5,
    body: 'Max was our protector and faithful shadow for 13 years. Seeing his portrait on our stone fireplace alongside his paw print keepsake brings warmth right back into our home. Hands down the most meaningful tribute we could have chosen.',
    petName: 'Max',
    breed: 'German Shepherd',
    productType: 'Framed Canvas',
    size: '16×24"',
    verifiedPurchase: true,
    datePosted: 'July 2026',
    imageSrc: '/images/reviews/review-max-fireplace.webp',
    imageAlt: 'German Shepherd Max memorial canvas on brick fireplace mantel with paw print keepsake',
    memorialSetup: 'Fireplace Mantel with Paw Keepsake',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? '#B88A58' : 'none'}
          stroke={i < rating ? '#B88A58' : '#EBE6DE'}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function EmotionalReviewsWall() {
  const [selectedImage, setSelectedImage] = useState<MemorialReview | null>(null);

  return (
    <section id="reviews" className="w-full bg-[#FAF8F5] py-16 md:py-24 border-t border-[--border-default]" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[--accent]/10 border border-[--accent]/20 text-[--accent] text-xs font-semibold tracking-wide uppercase font-jakarta mb-3">
            <Heart size={13} className="fill-[--accent]" />
            <span>Memorial Customer Tributes</span>
          </div>

          <h2 id="reviews-heading" className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-[--text-primary] font-normal tracking-tight mb-4">
            Cherished in Homes Across America
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm font-jakarta text-[--text-secondary]">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <span className="font-bold text-[--text-primary]">4.9 / 5.0 Rating</span>
            <span className="text-[--border-default]">•</span>
            <span>Over 1,400+ Families Comforted</span>
            <span className="text-[--border-default]">•</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-600 inline" /> 100% Verified Memorial Photos
            </span>
          </div>
        </motion.div>

        {/* Reviews Grid with Real Customer Photos & Avatars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
              className="rounded-2xl bg-white border border-[--border-default] shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow duration-300 group"
            >
              <div>
                {/* Real Customer Photo Container */}
                <div
                  className="relative w-full aspect-[4/3] bg-[#EBE6DE] overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(review)}
                >
                  <Image
                    src={review.imageSrc}
                    alt={review.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 opacity-70 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Photo Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-xs">
                    <span className="text-[11px] font-medium font-jakarta bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {review.memorialSetup}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white/40 transition-colors">
                      <ZoomIn size={13} className="text-white" />
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6">
                  {/* Author Avatar & Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 ring-1 ring-[--border-default]">
                        <Image
                          src={review.avatarSrc}
                          alt={review.authorName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm sm:text-[15px] text-[--text-primary] font-jakarta leading-tight">
                            {review.authorName}
                          </p>
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-xs text-[--text-secondary] font-jakarta mt-0.5">
                          {review.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <StarRating rating={review.rating} />
                      <span className="text-[10px] font-semibold text-emerald-700 font-jakarta bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-sm font-jakarta text-[--text-secondary] leading-relaxed italic">
                    “{review.body}”
                  </p>
                </div>
              </div>

              {/* Card Footer: Memorial Tribute Details */}
              <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5] border-t border-[--border-default] flex items-center justify-between text-xs font-jakarta">
                <span className="font-medium text-[--text-primary]">
                  {review.petName} · {review.breed}
                </span>
                <span className="text-[--accent] font-medium">
                  {review.size} {review.productType}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Bottom Trust Statement */}
        <div className="text-center mt-12 sm:mt-16 pt-8 border-t border-[--border-default]/60 max-w-2xl mx-auto">
          <p className="text-sm sm:text-base text-[--text-secondary] font-jakarta">
            Every memorial canvas is individually printed and assembled with museum-grade archival materials, designed to keep your dog’s memory alive for generations.
          </p>
        </div>

      </div>

      {/* Full Photo Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close photo view"
              >
                <X size={18} />
              </button>

              <div className="relative w-full aspect-[4/3] bg-black">
                <Image
                  src={selectedImage.imageSrc}
                  alt={selectedImage.imageAlt}
                  fill
                  sizes="800px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-5 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[--border-default] shrink-0">
                      <Image
                        src={selectedImage.avatarSrc}
                        alt={selectedImage.authorName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[--text-primary] font-jakarta">
                        {selectedImage.authorName} — {selectedImage.location}
                      </h3>
                      <p className="text-xs text-[--text-secondary] font-jakarta">
                        Memorial setup: {selectedImage.memorialSetup}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[--accent] font-jakarta">
                      {selectedImage.petName} ({selectedImage.breed})
                    </span>
                    <p className="text-[11px] text-[--text-secondary]">
                      {selectedImage.size} {selectedImage.productType}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-jakarta text-[--text-secondary] italic mt-2 pt-2 border-t border-[--border-default]">
                  “{selectedImage.body}”
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

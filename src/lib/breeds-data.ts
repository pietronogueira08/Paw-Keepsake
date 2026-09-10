import type { Breed, MemorialQuote, SizeVariant } from '@/types/ecommerce';

// =============================================================================
// Paw & Keepsake -- Static Data: Breeds, Quotes, Size Variants
// =============================================================================

// ---------------------------------------------------------------------------
// BREEDS  (30 total: 15 top AKC + 15 additional)
// All SVG paths use viewBox "0 0 200 200"
// ---------------------------------------------------------------------------

export const BREEDS: Breed[] = [
  // ---- Top 15 (AKC popularity order) ----

  {
    id: 'french-bulldog',
    name: 'French Bulldog',
    slug: 'french-bulldog',
    popularRank: 1,
    category: 'non-sporting',
    svgPath:
      'M 100 40 C 82 36 66 44 60 56 C 48 52 40 60 42 72 C 34 76 28 88 34 100 ' +
      'C 30 112 34 124 44 128 C 46 140 54 152 66 154 C 72 162 84 166 100 164 ' +
      'C 116 166 128 162 134 154 C 146 152 154 140 156 128 C 166 124 170 112 166 100 ' +
      'C 172 88 166 76 158 72 C 160 60 152 52 140 56 C 134 44 118 36 100 40 Z ' +
      'M 72 66 C 66 56 54 56 52 66 C 50 76 58 82 68 78 C 76 74 76 68 72 66 Z ' +
      'M 128 66 C 124 68 124 74 132 78 C 142 82 150 76 148 66 C 146 56 134 56 128 66 Z',
  },
  {
    id: 'labrador-retriever',
    name: 'Labrador Retriever',
    slug: 'labrador-retriever',
    popularRank: 2,
    category: 'sporting',
    svgPath:
      'M 100 28 C 80 22 60 34 54 52 C 42 50 32 60 30 74 C 24 82 22 96 28 108 ' +
      'C 22 118 24 132 34 140 C 36 154 46 164 60 166 C 70 174 84 178 100 176 ' +
      'C 116 178 130 174 140 166 C 154 164 164 154 166 140 C 176 132 178 118 172 108 ' +
      'C 178 96 176 82 170 74 C 168 60 158 50 146 52 C 140 34 120 22 100 28 Z ' +
      'M 60 50 C 52 40 40 44 38 56 C 36 68 46 76 58 70 Z ' +
      'M 140 50 C 142 76 154 68 162 56 C 160 44 148 40 140 50 Z',
  },
  {
    id: 'golden-retriever',
    name: 'Golden Retriever',
    slug: 'golden-retriever',
    popularRank: 3,
    category: 'sporting',
    svgPath:
      'M 100 24 C 78 18 56 32 50 52 C 36 50 24 62 24 78 C 16 90 16 106 26 118 ' +
      'C 22 130 26 146 38 154 C 42 168 54 178 70 180 C 80 188 90 190 100 190 ' +
      'C 110 190 120 188 130 180 C 146 178 158 168 162 154 C 174 146 178 130 174 118 ' +
      'C 184 106 184 90 176 78 C 176 62 164 50 150 52 C 144 32 122 18 100 24 Z ' +
      'M 58 50 C 48 36 34 40 32 56 C 30 72 44 80 58 72 Z ' +
      'M 142 50 C 142 72 156 80 168 56 C 166 40 152 36 142 50 Z',
  },
  {
    id: 'german-shepherd',
    name: 'German Shepherd',
    slug: 'german-shepherd',
    popularRank: 4,
    category: 'herding',
    svgPath:
      'M 100 22 C 80 16 62 26 56 44 C 44 30 28 36 28 52 C 18 40 12 58 20 72 ' +
      'C 12 84 14 100 24 112 C 20 126 24 142 36 150 C 40 164 52 174 68 176 ' +
      'C 80 184 90 186 100 186 C 110 186 120 184 132 176 C 148 174 160 164 164 150 ' +
      'C 176 142 180 126 176 112 C 186 100 188 84 180 72 C 188 58 182 40 172 52 ' +
      'C 172 36 156 30 144 44 C 138 26 120 16 100 22 Z ' +
      'M 54 42 C 46 28 30 30 30 48 C 30 60 42 64 52 58 Z ' +
      'M 146 42 C 148 58 158 60 170 48 C 170 30 154 28 146 42 Z',
  },
  {
    id: 'bulldog',
    name: 'Bulldog',
    slug: 'bulldog',
    popularRank: 5,
    category: 'non-sporting',
    svgPath:
      'M 100 44 C 80 38 62 48 56 62 C 44 56 34 66 36 80 C 28 84 24 98 32 110 ' +
      'C 28 122 32 136 44 142 C 46 156 58 166 72 168 C 82 174 90 176 100 174 ' +
      'C 110 176 118 174 128 168 C 142 166 154 156 156 142 C 168 136 172 122 168 110 ' +
      'C 176 98 172 84 164 80 C 166 66 156 56 144 62 C 138 48 120 38 100 44 Z ' +
      'M 76 70 C 66 60 52 64 52 76 C 52 86 64 90 74 84 C 80 80 80 74 76 70 Z ' +
      'M 124 70 C 120 74 120 80 126 84 C 136 90 148 86 148 76 C 148 64 134 60 124 70 Z ' +
      'M 82 108 C 76 104 70 108 70 114 C 70 122 80 126 90 120 Z ' +
      'M 118 108 C 110 120 120 126 130 114 C 130 108 124 104 118 108 Z',
  },
  {
    id: 'poodle',
    name: 'Poodle',
    slug: 'poodle',
    popularRank: 6,
    category: 'non-sporting',
    svgPath:
      'M 100 20 C 84 16 70 24 64 38 C 54 28 40 34 38 48 C 28 44 20 56 24 70 ' +
      'C 16 80 16 96 26 108 C 22 122 28 138 40 146 C 44 160 56 172 72 174 ' +
      'C 82 182 90 184 100 182 C 110 184 118 182 128 174 C 144 172 156 160 160 146 ' +
      'C 172 138 178 122 174 108 C 184 96 184 80 176 70 C 180 56 172 44 162 48 ' +
      'C 160 34 146 28 136 38 C 130 24 116 16 100 20 Z ' +
      'M 66 36 C 60 26 44 28 42 44 C 40 58 54 64 66 56 Z ' +
      'M 134 36 C 134 56 146 58 158 44 C 156 28 140 26 134 36 Z',
  },
  {
    id: 'beagle',
    name: 'Beagle',
    slug: 'beagle',
    popularRank: 7,
    category: 'hound',
    svgPath:
      'M 100 30 C 82 24 64 36 58 54 C 44 46 30 56 30 72 C 22 82 22 98 32 110 ' +
      'C 28 122 32 138 44 146 C 48 160 60 170 74 172 C 84 180 92 182 100 180 ' +
      'C 108 182 116 180 126 172 C 140 170 152 160 156 146 C 168 138 172 122 168 110 ' +
      'C 178 98 178 82 170 72 C 170 56 156 46 142 54 C 136 36 118 24 100 30 Z ' +
      'M 58 52 C 46 38 30 42 30 60 C 30 76 48 82 60 72 Z ' +
      'M 142 52 C 140 72 152 76 170 60 C 170 42 154 38 142 52 Z',
  },
  {
    id: 'rottweiler',
    name: 'Rottweiler',
    slug: 'rottweiler',
    popularRank: 8,
    category: 'working',
    svgPath:
      'M 100 30 C 78 22 58 36 52 56 C 38 52 26 64 28 80 C 18 90 18 108 30 120 ' +
      'C 24 134 28 150 42 158 C 46 174 60 184 76 186 C 86 194 94 196 100 194 ' +
      'C 106 196 114 194 124 186 C 140 184 154 174 158 158 C 172 150 176 134 170 120 ' +
      'C 182 108 182 90 172 80 C 174 64 162 52 148 56 C 142 36 122 22 100 30 Z ' +
      'M 56 54 C 46 38 28 44 28 62 C 28 78 46 84 58 74 Z ' +
      'M 144 54 C 142 74 154 78 172 62 C 172 44 154 38 144 54 Z',
  },
  {
    id: 'german-shorthaired-pointer',
    name: 'German Shorthaired Pointer',
    slug: 'german-shorthaired-pointer',
    popularRank: 9,
    category: 'sporting',
    svgPath:
      'M 100 26 C 80 20 60 34 54 54 C 40 50 28 62 28 78 C 20 90 20 106 30 118 ' +
      'C 24 132 28 148 40 156 C 44 170 56 180 72 182 C 82 190 92 192 100 190 ' +
      'C 108 192 118 190 128 182 C 144 180 156 170 160 156 C 172 148 176 132 170 118 ' +
      'C 180 106 180 90 172 78 C 172 62 160 50 146 54 C 140 34 120 20 100 26 Z ' +
      'M 56 52 C 46 36 28 42 28 60 C 28 76 46 82 58 70 Z ' +
      'M 144 52 C 142 70 154 76 172 60 C 172 42 154 36 144 52 Z',
  },
  {
    id: 'dachshund',
    name: 'Dachshund',
    slug: 'dachshund',
    popularRank: 10,
    category: 'hound',
    svgPath:
      'M 30 80 C 30 62 44 52 60 52 C 68 42 78 36 92 36 C 104 34 114 36 122 42 ' +
      'C 136 44 148 50 154 60 C 162 60 172 66 174 78 C 180 88 178 102 170 110 ' +
      'C 172 122 168 134 158 140 C 152 154 140 162 126 162 C 114 168 102 168 90 162 ' +
      'C 76 160 64 152 58 140 C 48 134 42 122 44 110 C 36 102 28 90 30 80 Z ' +
      'M 60 54 C 50 40 36 46 38 60 C 40 72 56 76 64 68 Z ' +
      'M 154 60 C 162 68 162 80 168 72 C 174 62 168 50 158 52 Z',
  },
  {
    id: 'pembroke-welsh-corgi',
    name: 'Pembroke Welsh Corgi',
    slug: 'pembroke-welsh-corgi',
    popularRank: 11,
    category: 'herding',
    svgPath:
      'M 100 34 C 80 28 60 40 54 58 C 40 44 24 50 26 68 C 16 58 10 76 18 90 ' +
      'C 12 104 16 120 28 128 C 32 144 44 156 60 158 C 72 166 84 170 100 168 ' +
      'C 116 170 128 166 140 158 C 156 156 168 144 172 128 C 184 120 188 104 182 90 ' +
      'C 190 76 184 58 174 68 C 176 50 160 44 146 58 C 140 40 120 28 100 34 Z ' +
      'M 52 58 C 40 44 22 48 24 66 C 26 80 44 84 56 74 Z ' +
      'M 148 58 C 144 74 156 80 174 66 C 176 48 158 44 148 58 Z',
  },
  {
    id: 'australian-shepherd',
    name: 'Australian Shepherd',
    slug: 'australian-shepherd',
    popularRank: 12,
    category: 'herding',
    svgPath:
      'M 100 26 C 80 20 60 32 54 52 C 40 48 28 60 28 76 C 20 88 20 104 30 116 ' +
      'C 24 130 28 146 40 154 C 44 168 58 178 74 180 C 84 188 92 190 100 188 ' +
      'C 108 190 116 188 126 180 C 142 178 156 168 160 154 C 172 146 176 130 170 116 ' +
      'C 180 104 180 88 172 76 C 172 60 160 48 146 52 C 140 32 120 20 100 26 Z ' +
      'M 56 50 C 44 34 26 40 28 58 C 30 74 48 80 60 68 Z ' +
      'M 144 50 C 140 68 152 74 172 58 C 174 40 156 34 144 50 Z',
  },
  {
    id: 'yorkshire-terrier',
    name: 'Yorkshire Terrier',
    slug: 'yorkshire-terrier',
    popularRank: 13,
    category: 'toy',
    svgPath:
      'M 100 32 C 84 26 70 36 64 50 C 54 40 40 46 40 60 C 30 66 26 80 32 92 ' +
      'C 26 104 28 118 38 126 C 40 140 50 150 64 152 C 74 160 84 164 100 162 ' +
      'C 116 164 126 160 136 152 C 150 150 160 140 162 126 C 172 118 174 104 168 92 ' +
      'C 174 80 170 66 160 60 C 160 46 146 40 136 50 C 130 36 116 26 100 32 Z ' +
      'M 62 50 C 54 38 38 42 40 56 C 42 68 58 72 68 62 Z ' +
      'M 138 50 C 132 62 142 68 160 56 C 162 42 146 38 138 50 Z',
  },
  {
    id: 'cavalier-king-charles-spaniel',
    name: 'Cavalier King Charles Spaniel',
    slug: 'cavalier-king-charles-spaniel',
    popularRank: 14,
    category: 'toy',
    svgPath:
      'M 100 28 C 82 22 64 34 58 52 C 44 44 30 56 32 72 C 24 82 24 98 34 110 ' +
      'C 28 124 32 140 44 148 C 48 162 62 172 78 174 ' +
      'C 88 182 94 184 100 182 C 106 184 112 182 122 174 ' +
      'C 138 172 152 162 156 148 C 168 140 172 124 166 110 ' +
      'C 176 98 176 82 168 72 C 170 56 156 44 142 52 ' +
      'C 136 34 118 22 100 28 Z ' +
      'M 54 50 C 42 34 24 40 26 60 C 28 76 48 82 60 70 Z ' +
      'M 146 50 C 140 70 152 76 174 60 C 176 40 158 34 146 50 Z',
  },
  {
    id: 'doberman-pinscher',
    name: 'Doberman Pinscher',
    slug: 'doberman-pinscher',
    popularRank: 15,
    category: 'working',
    svgPath:
      'M 100 22 C 82 16 64 28 58 48 C 46 34 30 38 28 54 C 18 44 12 60 20 74 ' +
      'C 12 86 14 102 24 114 C 18 128 24 144 36 152 ' +
      'C 40 166 52 178 68 180 C 80 188 90 190 100 188 ' +
      'C 110 190 120 188 132 180 C 148 178 160 166 164 152 ' +
      'C 176 144 182 128 176 114 C 186 102 188 86 180 74 ' +
      'C 188 60 182 44 172 54 C 170 38 154 34 142 48 ' +
      'C 136 28 118 16 100 22 Z ' +
      'M 56 48 C 44 30 26 36 28 54 C 30 68 48 72 60 62 Z ' +
      'M 144 48 C 140 62 152 68 172 54 C 174 36 156 30 144 48 Z',
  },

  // ---- Additional 15 breeds ----

  {
    id: 'boxer',
    name: 'Boxer',
    slug: 'boxer',
    popularRank: null,
    category: 'working',
    svgPath:
      'M 100 36 C 80 30 62 42 56 60 C 42 54 30 66 32 82 C 22 90 20 106 30 118 ' +
      'C 24 132 28 148 42 156 C 46 170 60 180 76 182 ' +
      'C 86 190 94 192 100 190 C 106 192 114 190 124 182 ' +
      'C 140 180 154 170 158 156 C 172 148 176 132 170 118 ' +
      'C 180 106 178 90 168 82 C 170 66 158 54 144 60 ' +
      'C 138 42 120 30 100 36 Z ' +
      'M 58 58 C 46 42 28 48 30 66 C 32 80 50 86 62 74 Z ' +
      'M 142 58 C 138 74 150 80 170 66 C 172 48 154 42 142 58 Z',
  },
  {
    id: 'siberian-husky',
    name: 'Siberian Husky',
    slug: 'siberian-husky',
    popularRank: null,
    category: 'working',
    svgPath:
      'M 100 24 C 80 18 60 32 54 52 C 40 36 22 40 22 58 C 12 46 6 64 14 78 ' +
      'C 6 90 8 108 20 120 C 14 134 20 150 34 158 ' +
      'C 38 172 52 182 68 184 C 80 192 90 194 100 192 ' +
      'C 110 194 120 192 132 184 C 148 182 162 172 166 158 ' +
      'C 180 150 186 134 180 120 C 192 108 194 90 186 78 ' +
      'C 194 64 188 46 178 58 C 178 40 160 36 146 52 ' +
      'C 140 32 120 18 100 24 Z ' +
      'M 52 50 C 40 32 20 38 22 58 C 24 74 44 80 56 66 Z ' +
      'M 148 50 C 144 66 156 74 178 58 C 180 38 160 32 148 50 Z',
  },
  {
    id: 'great-dane',
    name: 'Great Dane',
    slug: 'great-dane',
    popularRank: null,
    category: 'working',
    svgPath:
      'M 100 18 C 78 10 56 26 50 48 C 34 44 20 58 22 76 C 12 88 12 108 24 122 ' +
      'C 16 138 22 156 36 164 C 40 180 56 192 74 194 ' +
      'C 84 196 92 196 100 194 C 108 196 116 196 126 194 ' +
      'C 144 192 160 180 164 164 C 178 156 184 138 176 122 ' +
      'C 188 108 188 88 178 76 C 180 58 166 44 150 48 ' +
      'C 144 26 122 10 100 18 Z ' +
      'M 50 46 C 38 28 18 36 20 56 C 22 74 44 80 56 64 Z ' +
      'M 150 46 C 144 64 158 74 180 56 C 182 36 162 28 150 46 Z',
  },
  {
    id: 'miniature-schnauzer',
    name: 'Miniature Schnauzer',
    slug: 'miniature-schnauzer',
    popularRank: null,
    category: 'terrier',
    svgPath:
      'M 100 30 C 82 24 66 36 60 52 C 46 44 32 56 34 70 C 24 78 22 94 32 106 ' +
      'C 26 118 30 134 42 142 C 46 156 58 166 74 168 ' +
      'C 84 176 92 178 100 176 C 108 178 116 176 126 168 ' +
      'C 142 166 154 156 158 142 C 170 134 174 118 168 106 ' +
      'C 178 94 176 78 166 70 C 168 56 154 44 140 52 ' +
      'C 134 36 118 24 100 30 Z ' +
      'M 62 50 C 50 36 32 42 34 58 C 36 70 54 76 66 64 Z ' +
      'M 138 50 C 134 64 146 70 164 58 C 166 42 148 36 138 50 Z ' +
      'M 84 142 C 76 148 76 158 84 160 C 92 162 100 158 100 150 ' +
      'C 100 158 108 162 116 160 C 124 158 124 148 116 142 Z',
  },
  {
    id: 'shih-tzu',
    name: 'Shih Tzu',
    slug: 'shih-tzu',
    popularRank: null,
    category: 'toy',
    svgPath:
      'M 100 34 C 82 28 66 40 60 56 C 48 48 34 58 36 72 ' +
      'C 26 80 24 96 34 108 C 28 120 32 136 44 144 ' +
      'C 48 158 60 168 76 170 C 86 178 94 180 100 178 ' +
      'C 106 180 114 178 124 170 C 140 168 152 158 156 144 ' +
      'C 168 136 172 120 166 108 C 176 96 174 80 164 72 ' +
      'C 166 58 152 48 140 56 C 134 40 118 28 100 34 Z ' +
      'M 62 54 C 52 40 34 46 36 62 C 38 74 56 78 68 68 Z ' +
      'M 138 54 C 132 68 144 74 164 62 C 166 46 148 40 138 54 Z',
  },
  {
    id: 'boston-terrier',
    name: 'Boston Terrier',
    slug: 'boston-terrier',
    popularRank: null,
    category: 'non-sporting',
    svgPath:
      'M 100 36 C 82 30 66 42 60 58 C 48 50 34 60 36 76 ' +
      'C 26 82 24 98 34 110 C 28 122 32 138 44 146 ' +
      'C 48 160 60 170 76 172 C 86 180 94 182 100 180 ' +
      'C 106 182 114 180 124 172 C 140 170 152 160 156 146 ' +
      'C 168 138 172 122 166 110 C 176 98 174 82 164 76 ' +
      'C 166 60 152 50 140 58 C 134 42 118 30 100 36 Z ' +
      'M 62 56 C 52 42 34 48 36 64 C 38 76 56 80 68 70 Z ' +
      'M 138 56 C 132 70 144 76 164 64 C 166 48 148 42 138 56 Z',
  },
  {
    id: 'bernese-mountain-dog',
    name: 'Bernese Mountain Dog',
    slug: 'bernese-mountain-dog',
    popularRank: null,
    category: 'working',
    svgPath:
      'M 100 22 C 78 14 56 30 50 52 C 34 48 20 62 22 80 C 12 92 12 112 24 126 ' +
      'C 16 142 22 160 38 168 C 42 184 58 196 76 198 ' +
      'C 86 194 94 192 100 190 C 106 192 114 194 124 198 ' +
      'C 142 196 158 184 162 168 C 178 160 184 142 176 126 ' +
      'C 188 112 188 92 178 80 C 180 62 166 48 150 52 ' +
      'C 144 30 122 14 100 22 Z ' +
      'M 50 50 C 38 30 16 38 18 60 C 20 78 42 84 56 68 Z ' +
      'M 150 50 C 144 68 158 78 182 60 C 184 38 162 30 150 50 Z',
  },
  {
    id: 'pomeranian',
    name: 'Pomeranian',
    slug: 'pomeranian',
    popularRank: null,
    category: 'toy',
    svgPath:
      'M 100 28 C 84 22 68 32 62 48 C 50 38 36 46 38 60 ' +
      'C 28 66 24 82 32 94 C 26 106 28 122 40 130 ' +
      'C 44 144 56 154 72 156 C 82 164 90 166 100 164 ' +
      'C 110 166 118 164 128 156 C 144 154 156 144 160 130 ' +
      'C 172 122 174 106 168 94 C 176 82 172 66 162 60 ' +
      'C 164 46 150 38 138 48 C 132 32 116 22 100 28 Z ' +
      'M 64 46 C 56 32 38 38 40 54 C 42 66 58 70 70 60 Z ' +
      'M 136 46 C 130 60 142 66 160 54 C 162 38 144 32 136 46 Z',
  },
  {
    id: 'havanese',
    name: 'Havanese',
    slug: 'havanese',
    popularRank: null,
    category: 'toy',
    svgPath:
      'M 100 32 C 84 26 68 38 62 54 C 50 44 36 54 38 68 ' +
      'C 28 76 26 92 36 104 C 30 116 34 132 46 140 ' +
      'C 50 154 62 164 78 166 C 88 174 96 176 100 174 ' +
      'C 104 176 112 174 122 166 C 138 164 150 154 154 140 ' +
      'C 166 132 170 116 164 104 C 174 92 172 76 162 68 ' +
      'C 164 54 150 44 138 54 C 132 38 116 26 100 32 Z ' +
      'M 64 52 C 54 38 36 44 38 60 C 40 72 58 76 70 64 Z ' +
      'M 136 52 C 130 64 142 72 160 60 C 162 44 144 38 136 52 Z',
  },
  {
    id: 'shetland-sheepdog',
    name: 'Shetland Sheepdog',
    slug: 'shetland-sheepdog',
    popularRank: null,
    category: 'herding',
    svgPath:
      'M 100 26 C 82 18 62 32 56 52 C 42 36 24 42 24 60 ' +
      'C 14 50 8 68 16 82 C 8 96 10 114 22 126 ' +
      'C 16 140 22 158 36 166 C 40 180 56 190 72 192 ' +
      'C 82 196 90 196 100 194 C 110 196 118 196 128 192 ' +
      'C 144 190 160 180 164 166 C 178 158 184 140 178 126 ' +
      'C 190 114 192 96 184 82 C 192 68 186 50 176 60 ' +
      'C 176 42 158 36 144 52 C 138 32 118 18 100 26 Z ' +
      'M 54 50 C 40 32 20 40 22 62 C 24 78 46 84 58 68 Z ' +
      'M 146 50 C 142 68 156 78 178 62 C 180 40 160 32 146 50 Z',
  },
  {
    id: 'maltese',
    name: 'Maltese',
    slug: 'maltese',
    popularRank: null,
    category: 'toy',
    svgPath:
      'M 100 34 C 86 28 72 38 66 54 C 54 44 40 54 42 68 ' +
      'C 32 74 28 90 36 102 C 30 114 32 130 44 138 ' +
      'C 48 152 60 162 76 164 C 86 172 94 174 100 172 ' +
      'C 106 174 114 172 124 164 C 140 162 152 152 156 138 ' +
      'C 168 130 170 114 164 102 C 172 90 168 74 158 68 ' +
      'C 160 54 146 44 134 54 C 128 38 114 28 100 34 Z ' +
      'M 68 52 C 58 38 40 46 42 62 C 44 74 62 78 72 66 Z ' +
      'M 132 52 C 128 66 138 74 158 62 C 160 46 142 38 132 52 Z',
  },
  {
    id: 'weimaraner',
    name: 'Weimaraner',
    slug: 'weimaraner',
    popularRank: null,
    category: 'sporting',
    svgPath:
      'M 100 24 C 80 16 60 30 54 52 C 38 48 24 62 26 80 ' +
      'C 16 92 16 110 28 124 C 20 140 26 158 40 166 ' +
      'C 44 182 60 194 78 196 C 88 192 96 190 100 188 ' +
      'C 104 190 112 192 122 196 C 140 194 156 182 160 166 ' +
      'C 174 158 180 140 172 124 C 184 110 184 92 174 80 ' +
      'C 176 62 162 48 146 52 C 140 30 120 16 100 24 Z ' +
      'M 54 50 C 40 30 20 38 22 60 C 24 78 46 84 58 66 Z ' +
      'M 146 50 C 142 66 156 78 178 60 C 180 38 160 30 146 50 Z',
  },
  {
    id: 'border-collie',
    name: 'Border Collie',
    slug: 'border-collie',
    popularRank: null,
    category: 'herding',
    svgPath:
      'M 100 24 C 80 18 60 32 54 52 C 40 36 22 42 22 62 ' +
      'C 12 52 6 70 14 84 C 6 98 8 116 20 128 ' +
      'C 14 142 20 160 34 168 C 38 184 54 194 70 196 ' +
      'C 82 194 90 192 100 190 C 110 192 118 194 130 196 ' +
      'C 146 194 162 184 166 168 C 180 160 186 142 180 128 ' +
      'C 192 116 194 98 186 84 C 194 70 188 52 178 62 ' +
      'C 178 42 160 36 146 52 C 140 32 120 18 100 24 Z ' +
      'M 52 50 C 38 30 18 40 20 64 C 22 80 46 86 58 68 Z ' +
      'M 148 50 C 142 68 158 80 180 64 C 182 40 162 30 148 50 Z',
  },
  {
    id: 'irish-setter',
    name: 'Irish Setter',
    slug: 'irish-setter',
    popularRank: null,
    category: 'sporting',
    svgPath:
      'M 100 22 C 80 14 58 30 52 52 C 36 46 22 60 24 78 ' +
      'C 14 90 14 108 26 122 C 18 138 24 156 40 164 ' +
      'C 44 180 60 192 78 194 C 88 190 96 188 100 186 ' +
      'C 104 188 112 190 122 194 C 140 192 156 180 160 164 ' +
      'C 176 156 182 138 174 122 C 186 108 186 90 176 78 ' +
      'C 178 60 164 46 148 52 C 142 30 120 14 100 22 Z ' +
      'M 52 50 C 38 28 16 38 18 60 C 20 78 44 84 58 66 Z ' +
      'M 148 50 C 142 66 158 78 182 60 C 184 38 162 28 148 50 Z',
  },
  {
    id: 'vizsla',
    name: 'Vizsla',
    slug: 'vizsla',
    popularRank: null,
    category: 'sporting',
    svgPath:
      'M 100 26 C 80 18 60 34 54 56 C 38 50 24 66 26 84 ' +
      'C 16 96 16 114 28 128 C 20 144 26 162 42 170 ' +
      'C 46 186 62 196 80 198 C 90 194 98 192 100 190 ' +
      'C 102 192 110 194 120 198 C 138 196 154 186 158 170 ' +
      'C 174 162 180 144 172 128 C 184 114 184 96 174 84 ' +
      'C 176 66 162 50 146 56 C 140 34 120 18 100 26 Z ' +
      'M 54 54 C 40 32 18 42 20 64 C 22 82 46 88 60 70 Z ' +
      'M 146 54 C 140 70 156 82 180 64 C 182 42 160 32 146 54 Z',
  },
];

// ---------------------------------------------------------------------------
// MEMORIAL QUOTES
// ---------------------------------------------------------------------------

export const MEMORIAL_QUOTES: MemorialQuote[] = [
  {
    id: 'quote-1',
    text: 'Not all those who wander are lost — but you always found your way home.',
  },
  {
    id: 'quote-2',
    text: 'Until one has loved an animal, a part of one\'s soul remains unawakened.',
    author: 'Anatole France',
  },
  {
    id: 'quote-3',
    text: 'The bond with a dog is as lasting as the ties of this earth can ever be.',
    author: 'Konrad Lorenz',
  },
  {
    id: 'quote-4',
    text: 'No longer by my side, but forever in my heart.',
  },
  {
    id: 'quote-5',
    text: 'What we have once enjoyed, we can never lose. All that we love deeply becomes a part of us.',
    author: 'Helen Keller',
  },
  {
    id: 'quote-6',
    text: 'Heaven is a place where all the dogs you have ever loved come to greet you.',
  },
  {
    id: 'quote-7',
    text: 'A dog is the only thing on earth that loves you more than you love yourself.',
    author: 'Josh Billings',
  },
  {
    id: 'quote-8',
    text: 'The one best place to bury a good dog is in the heart of his master.',
    author: 'Ben Hur Lampman',
  },
  {
    id: 'quote-9',
    text: 'Dogs come into our lives to teach us about love. They depart to teach us about loss.',
  },
  {
    id: 'quote-10',
    text: 'Grief is just love with nowhere to go. Fill this space with memory.',
  },
];

// ---------------------------------------------------------------------------
// SIZE VARIANTS
// ---------------------------------------------------------------------------

export const SIZE_VARIANTS: SizeVariant[] = [
  {
    size: '8x10',
    label: '8\u00d710"',
    prices: {
      'museum-canvas': 48,
      'framed-print': 65,
    },
    dimensionsCm: '20.3 \u00d7 25.4 cm',
  },
  {
    size: '12x16',
    label: '12\u00d716"',
    popularityLabel: 'Most Popular',
    prices: {
      'museum-canvas': 68,
      'framed-print': 89,
    },
    dimensionsCm: '30.5 \u00d7 40.6 cm',
  },
  {
    size: '18x24',
    label: '18\u00d724"',
    popularityLabel: 'Best Value',
    prices: {
      'museum-canvas': 98,
      'framed-print': 125,
    },
    dimensionsCm: '45.7 \u00d7 61.0 cm',
  },
  {
    size: '24x36',
    label: '24\u00d736"',
    prices: {
      'museum-canvas': 148,
      'framed-print': 185,
    },
    dimensionsCm: '61.0 \u00d7 91.4 cm',
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the top `n` breeds sorted by popularRank ascending.
 * Only breeds with a non-null popularRank are included.
 */
export function getTopBreeds(n: number): Breed[] {
  return BREEDS.filter((b) => b.popularRank !== null)
    .sort((a, b) => (a.popularRank as number) - (b.popularRank as number))
    .slice(0, n);
}

/**
 * Case-insensitive search across breed names.
 * Returns all matching breeds, sorted by popularRank (top breeds first).
 */
export function searchBreeds(query: string): Breed[] {
  const q = query.trim().toLowerCase();
  if (!q) return BREEDS;
  return BREEDS.filter((b) => b.name.toLowerCase().includes(q)).sort((a, b) => {
    if (a.popularRank !== null && b.popularRank !== null)
      return a.popularRank - b.popularRank;
    if (a.popularRank !== null) return -1;
    if (b.popularRank !== null) return 1;
    return a.name.localeCompare(b.name);
  });
}

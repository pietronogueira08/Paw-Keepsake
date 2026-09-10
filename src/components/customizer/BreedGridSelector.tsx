'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Search } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { BREEDS, getTopBreeds } from '@/lib/breeds-data';
import { cn, debounce } from '@/lib/utils';
import type { Breed } from '@/types/ecommerce';

const TOP_BREEDS = getTopBreeds(15);

interface BreedCardProps {
  breed: Breed;
  isSelected: boolean;
  onSelect: (breed: Breed) => void;
}

function BreedCard({ breed, isSelected, onSelect }: BreedCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(breed)}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 450, damping: 18 } }}
      className={cn(
        'relative flex flex-col items-center gap-1.5 rounded-card p-2.5 border transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-accent bg-accent/5 shadow-accent-ring'
          : 'border-border bg-surface hover:border-accent/40',
      )}
      aria-pressed={isSelected}
      aria-label={breed.name}
    >
      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
          >
            <Check size={10} strokeWidth={3} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breed SVG silhouette */}
      <svg
        viewBox="0 0 200 200"
        width="36"
        height="36"
        aria-hidden="true"
        className={cn('transition-opacity duration-200', isSelected ? 'opacity-100' : 'opacity-70')}
      >
        <path d={breed.svgPath} fill={isSelected ? '#B88A58' : '#736E65'} />
      </svg>

      <span
        className={cn(
          'text-[10px] font-jakarta leading-tight text-center line-clamp-2',
          isSelected ? 'text-accent font-medium' : 'text-muted',
        )}
      >
        {breed.name}
      </span>
    </motion.button>
  );
}

export function BreedGridSelector() {
  const { breed: selectedBreed, setBreed } = useCustomizerStore();
  const [query, setQuery] = useState('');

  // Debounced search to avoid rapid re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((q: string) => setQuery(q), 200),
    [],
  );

  const filtered = query.trim()
    ? BREEDS.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
    : null;

  const displayBreeds = filtered ?? TOP_BREEDS;
  const isSearching = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search all breeds…"
          onChange={(e) => handleSearch(e.target.value)}
          className={cn(
            'w-full pl-9 pr-4 py-2.5 rounded-card border border-border bg-surface',
            'text-sm font-jakarta text-foreground placeholder:text-muted',
            'focus:outline-none focus:border-accent focus:shadow-accent-ring transition-all duration-150',
          )}
          aria-label="Search dog breeds"
        />
      </div>

      {/* Section label */}
      <p className="text-xs font-medium text-muted uppercase tracking-wider font-jakarta">
        {isSearching
          ? `${displayBreeds.length} breed${displayBreeds.length !== 1 ? 's' : ''} found`
          : 'Popular Breeds'}
      </p>

      {/* Breed grid */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2"
        layout
      >
        <AnimatePresence mode="popLayout">
          {displayBreeds.map((breed) => (
            <motion.div
              key={breed.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <BreedCard
                breed={breed}
                isSelected={selectedBreed?.id === breed.id}
                onSelect={setBreed}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Show all breeds link when searching returns nothing */}
      {isSearching && displayBreeds.length === 0 && (
        <p className="text-sm text-muted text-center py-4 font-jakarta">
          No breeds matched "{query}". Try a different spelling or{' '}
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-accent underline underline-offset-2"
          >
            browse all
          </button>
          .
        </p>
      )}

      {/* Selected confirmation */}
      <AnimatePresence>
        {selectedBreed && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-trust flex items-center gap-1.5 font-jakarta"
          >
            <Check size={12} strokeWidth={2.5} aria-hidden="true" />
            {selectedBreed.name} selected
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, Pause, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cakes, categories, getCake, type CakeImage } from '@/lib/cakery';
import './home-gallery.css';

function shuffleCakes(list: CakeImage[]): CakeImage[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function HomeGallery() {
  const [activeSlug, setActiveSlug] = useState<string>('all');
  const [allMix, setAllMix] = useState<CakeImage[]>(cakes);
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [transitionCount, setTransitionCount] = useState(0);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // Randomise the initial mix of all categories after hydration without SSR mismatch
  useEffect(() => {
    setAllMix(shuffleCakes(cakes));
  }, []);

  const visibleUniqueItems = useMemo(() => {
    if (activeSlug === 'all') {
      return allMix;
    }
    const category = categories.find((c) => c.slug === activeSlug);
    if (!category) return allMix;
    return category.images.map(getCake);
  }, [activeSlug, allMix]);

  // Repeat filtered items inside each half so even 2-image categories fill wide viewports seamlessly
  const repeatedHalf = useMemo(() => {
    if (visibleUniqueItems.length === 0) return [];
    const minCardsPerHalf = 8;
    const repeats = Math.max(1, Math.ceil(minCardsPerHalf / visibleUniqueItems.length));
    const list: CakeImage[] = [];
    for (let r = 0; r < repeats; r++) {
      for (const item of visibleUniqueItems) {
        list.push(item);
      }
    }
    return list;
  }, [visibleUniqueItems]);

  const durationSeconds = Math.max(28, Math.round(repeatedHalf.length * 4.2));

  const handleSelectCategory = (slug: string) => {
    if (slug === activeSlug) return;
    setSelected(null);
    setActiveSlug(slug);
    setTransitionCount((c) => c + 1);
  };

  const prev = () =>
    setSelected((v) =>
      v === null ? 0 : (v - 1 + visibleUniqueItems.length) % visibleUniqueItems.length
    );

  const next = () =>
    setSelected((v) => (v === null ? 0 : (v + 1) % visibleUniqueItems.length));

  useEffect(() => {
    if (selected === null) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelected((v) => (v === null ? 0 : (v + 1) % visibleUniqueItems.length));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelected((v) =>
          v === null ? 0 : (v - 1 + visibleUniqueItems.length) % visibleUniqueItems.length
        );
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [selected, visibleUniqueItems.length]);

  const isMarqueePaused = paused || selected !== null;

  const renderCard = (c: CakeImage, key: string, isDuplicate = false) => (
    <button
      key={key}
      type="button"
      className="cake-photo hg-card"
      tabIndex={isDuplicate ? -1 : 0}
      aria-label={`View ${c.title}`}
      onClick={(e) => {
        openerRef.current = e.currentTarget;
        const idx = visibleUniqueItems.findIndex((x) => x.id === c.id);
        setSelected(idx >= 0 ? idx : 0);
      }}
    >
      <img
        src={`/images/${c.id}.webp`}
        srcSet={`/images/${c.id}-small.webp 360w, /images/${c.id}.webp 720w`}
        sizes="(max-width: 900px) 230px, (max-width: 1180px) 270px, 315px"
        width="600"
        height="770"
        alt={c.alt}
        loading="eager"
        decoding="async"
      />
      <span className="photo-overlay">
        <span>{c.title}</span>
        <Expand aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <section className="section home-gallery" aria-labelledby="home-gallery-heading">
      <div className="hg-layout">
        {/* Left column (30%): heading, description, category filters */}
        <div className="hg-left">
          <div className="eyebrow">MADE BY US. IMAGINED BY YOU.</div>
          <h2 id="home-gallery-heading">For moments like these.</h2>
          <p className="hg-description">
            A few of the lovely cakes that have left our little Leeds cakery. What will yours look
            like?
          </p>

          <div className="hg-filters" role="group" aria-label="Filter cakes by category">
            <button
              type="button"
              className={`hg-filter-btn ${activeSlug === 'all' ? 'is-active' : ''}`}
              aria-pressed={activeSlug === 'all'}
              onClick={() => handleSelectCategory('all')}
            >
              All Cakes
            </button>
            {categories.map((c) => {
              const isActive = activeSlug === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  className={`hg-filter-btn ${isActive ? 'is-active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => handleSelectCategory(c.slug)}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="hg-left-actions">
            <a className="text-link" href="/gallery">
              <span>View Full Gallery</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <button
              type="button"
              className="motion-control"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? 'Play gallery' : 'Pause gallery'}
            >
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              <span>{paused ? 'Play gallery' : 'Pause gallery'}</span>
            </button>
          </div>
        </div>

        {/* Right column (70%): full-bleed continuously scrolling image marquee */}
        <div className="hg-right">
          <div className={`hg-marquee-viewport ${isMarqueePaused ? 'is-paused' : ''}`}>
            <div
              key={activeSlug}
              className={`hg-track-stage ${transitionCount > 0 ? 'is-animated' : ''}`}
            >
              <div
                className="hg-marquee-track"
                style={{ '--hg-duration': `${durationSeconds}s` } as React.CSSProperties}
              >
                <div className="hg-marquee-half">
                  {repeatedHalf.map((c, idx) => renderCard(c, `${activeSlug}-a-${idx}`, false))}
                </div>
                <div className="hg-marquee-half is-duplicate" aria-hidden="true">
                  {repeatedHalf.map((c, idx) => renderCard(c, `${activeSlug}-b-${idx}`, true))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Enlarged Cake Inspection */}
      <Dialog
        open={selected !== null}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
      >
        <DialogContent
          className="cake-lightbox"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            openerRef.current?.focus();
          }}
        >
          {selected !== null && visibleUniqueItems[selected] && (
            <>
              <DialogTitle className="lightbox-title">
                {visibleUniqueItems[selected].title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                A real cake by Aryana Cakery. Use the arrow keys or buttons to browse. Press
                Escape to close.
              </DialogDescription>
              <img
                className="lightbox-image"
                src={`/images/${visibleUniqueItems[selected].id}.webp`}
                alt={visibleUniqueItems[selected].alt}
              />
              <div className="lightbox-controls">
                <button type="button" onClick={prev} aria-label="Previous cake">
                  <ArrowLeft aria-hidden="true" />
                </button>
                <p>
                  {selected + 1} of {visibleUniqueItems.length}
                </p>
                <a
                  href={`/order?inspiration=${encodeURIComponent(
                    visibleUniqueItems[selected].title
                  )}`}
                  className="text-link"
                >
                  Love this style? <ArrowUpRight aria-hidden="true" />
                </a>
                <button type="button" onClick={next} aria-label="Next cake">
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

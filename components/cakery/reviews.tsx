'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Pause, Play, Star, Quote } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { business } from '@/lib/cakery';
import { reviews } from '@/lib/reviews';

// Distribute all 20 genuine customer reviews across three columns
const col1Reviews = [
  reviews[0], // Sunpreet Chana
  reviews[1], // Charlotte
  reviews[2], // Saz
  reviews[4], // Paula Da Silva
  reviews[6], // Chris Cook
  reviews[8], // Alisha Fearn
  reviews[12], // Arzoo khan
];

const col2Reviews = [
  reviews[3], // CLIP - Legal & HR
  reviews[5], // Nasser
  reviews[7], // Faeza Erum
  reviews[9], // Farnoush Nikzad
  reviews[13], // Sonia Reuben
  reviews[15], // Charity buachie
  reviews[19], // Khashayar Mousazade
];

const col3Reviews = [
  reviews[10], // Sarah Perez
  reviews[11], // Ruben Rai
  reviews[14], // farah shames
  reviews[16], // Alireza Abbasi
  reviews[17], // Hafsa Akhtar
  reviews[18], // Aryana nejati
];

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function Reviews() {
  const [paused, setPaused] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<(typeof reviews)[number] | null>(null);

  const openReview = (review: (typeof reviews)[number], triggerElement?: HTMLElement) => {
    if (triggerElement) opener.current = triggerElement;
    setSelected(review);
  };

  const renderCard = (
    review: (typeof reviews)[number],
    isDuplicate = false,
    keyPrefix = ''
  ) => {
    const isLong = review.text.length > 210;
    const previewText = isLong
      ? review.text.slice(0, 205).replace(/\s+\S*$/, '') + '…'
      : review.text;

    return (
      <article
        key={`${keyPrefix}-${review.name}`}
        className="review-card-item group/card bg-white rounded-2xl p-7 sm:p-8 border border-[#F0D5DE] shadow-[0_5px_22px_rgba(107,31,59,0.06)] hover:shadow-[0_14px_34px_rgba(107,31,59,0.13)] hover:border-[#A23860]/50 transition-all duration-250 cursor-pointer flex flex-col justify-between text-left select-none"
        tabIndex={isDuplicate ? -1 : 0}
        role="button"
        aria-label={`Read full review by ${review.name}`}
        onClick={(e) => openReview(review, e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openReview(review, e.currentTarget);
          }
        }}
      >
        <div>
          {/* Header row: Star rating + Google badge + Quote indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5" aria-label="5 out of 5 stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              ))}
            </div>
            <Quote
              className="w-5 h-5 text-[#E7C7D4] group-hover/card:text-[#A23860] transition-colors shrink-0"
              aria-hidden="true"
            />
          </div>

          {/* Review body text - enlarged, comfortable font */}
          <blockquote className="text-[#3E2331] text-[1.02rem] sm:text-[1.06rem] leading-[1.78] m-0 font-normal">
            &ldquo;{previewText}&rdquo;
          </blockquote>

          {/* Functional Read full review action */}
          {isLong && (
            <div className="mt-3.5">
              <button
                type="button"
                tabIndex={isDuplicate ? -1 : 0}
                className="inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-[#A23860] hover:text-[#7A1F41] hover:underline transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openReview(review, e.currentTarget);
                }}
              >
                <span>Read full review</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Card footer: Author info + Google attribution */}
        <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-[#F8EBF0]">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-10 h-10 rounded-full bg-[#FBF0F4] border border-[#ECD1DC] text-[#8C3A5A] font-bold text-xs flex items-center justify-center shrink-0 uppercase tracking-wider"
              aria-hidden="true"
            >
              {review.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </span>
            <div className="min-w-0">
              <h3 className="text-[0.98rem] font-bold text-[#3B1F2D] truncate leading-tight">
                {review.name}
              </h3>
              <p className="text-[0.78rem] text-[#8C6C7A] m-0 flex items-center gap-1 leading-tight mt-0.5">
                Google review
              </p>
            </div>
          </div>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FCF8FA] border border-[#F2E0E7] shrink-0"
            title="Verified Google Review"
          >
            <GoogleIcon />
          </div>
        </div>
      </article>
    );
  };

  const isStreamPaused = paused || selected !== null;

  return (
    <section className="section reviews-section bg-[#FAF4F6] relative py-20 lg:py-24 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading Area */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="eyebrow justify-center tracking-[0.2em] text-[0.8rem] font-bold uppercase text-[#916176] mb-3">
            MADE WITH LOVE, LOVED BY YOU
          </div>
          <h2 className="text-[2.4rem] sm:text-[3.2rem] lg:text-[3.65rem] font-medium tracking-tight text-[#4A3039] leading-[1.08] mb-4">
            Sweet Words From Our Customers
          </h2>
          <p className="text-[1.02rem] sm:text-[1.12rem] text-[#775762] max-w-xl mx-auto leading-relaxed mb-6">
            Every cake has a story. Here&apos;s what our lovely customers have to say.
          </p>

          {/* Genuine Google Rating Summary Badge */}
          <div className="inline-flex items-center flex-wrap justify-center gap-2.5 px-5 py-2 rounded-full bg-white border border-[#EED9E2] shadow-[0_2px_12px_rgba(107,31,59,0.06)] text-xs sm:text-sm font-medium text-[#714053]">
            <div className="flex items-center gap-1" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#4A3039] text-[0.92rem]">5.0</span>
            <span className="text-[#CFB2BF]">•</span>
            <span>20 Five-Star Reviews</span>
            <span className="text-[#CFB2BF]">•</span>
            <a
              href={business.maps}
              target="_blank"
              rel="noreferrer"
              className="text-[#A23860] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              Find us on Google <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Dynamic Vertical Testimonial Waterfall Display Area */}
        <div className="relative">
          {/* Masked Display Container with very subtle 4% fade so reviews stay crystal-clear */}
          <div
            className="waterfall-viewport relative h-[640px] sm:h-[700px] lg:h-[760px] overflow-hidden rounded-2xl"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 4%, rgba(0,0,0,1) 96%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 4%, rgba(0,0,0,1) 96%, transparent 100%)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 h-full items-start">
              {/* Left Column: Continuously scrolls UPWARDS */}
              <div className="stream-col relative h-full overflow-hidden">
                <div
                  className={`reviews-stream animate-stream-left ${
                    isStreamPaused ? 'stream-paused' : ''
                  }`}
                >
                  <div className="reviews-set">
                    {col1Reviews.map((r, i) => (
                      <div key={`c1-${i}`} className="mb-6">
                        {renderCard(r, false, 'c1-orig')}
                      </div>
                    ))}
                  </div>
                  <div className="reviews-set stream-duplicate" aria-hidden="true">
                    {col1Reviews.map((r, i) => (
                      <div key={`c1-dup-${i}`} className="mb-6">
                        {renderCard(r, true, 'c1-dup')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column: Continuously scrolls DOWNWARDS (opposite direction) */}
              <div className="stream-col relative h-full overflow-hidden hidden md:block">
                <div
                  className={`reviews-stream animate-stream-center ${
                    isStreamPaused ? 'stream-paused' : ''
                  }`}
                >
                  <div className="reviews-set">
                    {col2Reviews.map((r, i) => (
                      <div key={`c2-${i}`} className="mb-6">
                        {renderCard(r, false, 'c2-orig')}
                      </div>
                    ))}
                  </div>
                  <div className="reviews-set stream-duplicate" aria-hidden="true">
                    {col2Reviews.map((r, i) => (
                      <div key={`c2-dup-${i}`} className="mb-6">
                        {renderCard(r, true, 'c2-dup')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Continuously scrolls UPWARDS */}
              <div className="stream-col relative h-full overflow-hidden hidden lg:block">
                <div
                  className={`reviews-stream animate-stream-right ${
                    isStreamPaused ? 'stream-paused' : ''
                  }`}
                >
                  <div className="reviews-set">
                    {col3Reviews.map((r, i) => (
                      <div key={`c3-${i}`} className="mb-6">
                        {renderCard(r, false, 'c3-orig')}
                      </div>
                    ))}
                  </div>
                  <div className="reviews-set stream-duplicate" aria-hidden="true">
                    {col3Reviews.map((r, i) => (
                      <div key={`c3-dup-${i}`} className="mb-6">
                        {renderCard(r, true, 'c3-dup')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Call to Action */}
        <div className="mt-12 sm:mt-14 text-center flex flex-col items-center justify-center gap-4">
          <p className="font-fredoka text-[1.4rem] sm:text-[1.75rem] text-[#64384A] font-medium tracking-tight">
            Your celebration could be next ♡
          </p>
          <a
            href="/order"
            className="btn btn-primary text-[1rem] font-semibold px-9 py-4 rounded-full inline-flex items-center gap-2.5 shadow-[0_8px_24px_rgba(162,56,96,0.22)] hover:shadow-[0_12px_28px_rgba(162,56,96,0.3)] hover:-translate-y-0.5 transition-all"
          >
            <span>Order Your Dream Cake</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            type="button"
            className="motion-control inline-flex items-center gap-2 text-xs sm:text-sm text-[#8B6677] hover:text-[#A23860] transition-colors mt-2"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? 'Resume review animation' : 'Pause review animation'}
            aria-pressed={paused}
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{paused ? 'Resume animation' : 'Pause animation'}</span>
          </button>
        </div>
      </div>

      {/* Full Review Modal Dialog */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="review-dialog max-w-xl p-8 bg-white rounded-3xl border border-[#F2D7DE] shadow-2xl"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCF8FA] border border-[#F2E0E7] text-xs text-[#714053] font-semibold">
              <GoogleIcon />
              <span>Google Review</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-[#3B1F2D]">
            {selected?.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8C6C7A] mb-3">
            Genuine customer review on Google
          </DialogDescription>
          <blockquote className="text-[#3E2331] text-[1.05rem] leading-[1.8] whitespace-pre-line my-5 font-normal">
            &ldquo;{selected?.text}&rdquo;
          </blockquote>
          <div className="pt-5 border-t border-[#F8EBF0] flex items-center justify-between">
            <a
              className="text-link text-sm font-bold text-[#A23860] inline-flex items-center gap-1.5 hover:underline"
              href={business.maps}
              target="_blank"
              rel="noreferrer"
            >
              <span>View on Google Maps</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scoped CSS animations rendered directly in DOM */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes streamUpLeft {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
            @keyframes streamDownCenter {
              0% { transform: translateY(-50%); }
              100% { transform: translateY(0); }
            }
            @keyframes streamUpRight {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }

            .reviews-stream {
              will-change: transform;
            }

            .animate-stream-left {
              animation: streamUpLeft 44s linear infinite;
            }

            .animate-stream-center {
              animation: streamDownCenter 52s linear infinite;
            }

            .animate-stream-right {
              animation: streamUpRight 38s linear infinite;
            }

            /* Hover and focus pause on column and cards */
            .stream-col:hover .animate-stream-left,
            .stream-col:hover .animate-stream-center,
            .stream-col:hover .animate-stream-right,
            .stream-col:focus-within .animate-stream-left,
            .stream-col:focus-within .animate-stream-center,
            .stream-col:focus-within .animate-stream-right,
            .stream-paused {
              animation-play-state: paused !important;
            }

            /* Card hover elevation */
            .review-card-item {
              transform: translateY(0);
              transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms ease;
            }

            .review-card-item:hover {
              transform: translateY(-4px);
              box-shadow: 0 14px 34px rgba(107, 31, 59, 0.13) !important;
              border-color: rgba(162, 56, 96, 0.5) !important;
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-stream-left,
              .animate-stream-center,
              .animate-stream-right {
                animation: none !important;
                transform: none !important;
              }
              .stream-duplicate {
                display: none !important;
              }
              .waterfall-viewport {
                mask-image: none !important;
                -webkit-mask-image: none !important;
                height: auto !important;
                max-height: 620px;
                overflow-y: auto !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}



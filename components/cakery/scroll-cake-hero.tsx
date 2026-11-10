'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowRight, ChefHat, Heart, MapPin, Pause, Play, Sparkles} from 'lucide-react';

const VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/aryana-cackery-leeds.firebasestorage.app/o/videos%2FScreen%20Recording%20-%2031%20Jul%202026%2C%20000524.mp4?alt=media&token=45cd3eeb-8494-45f4-bda8-4ca225629134';

export function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current || (document.getElementById('hero-video') as HTMLVideoElement | null);
    if (!video) return;

    const handlePlay = () => {
      if (userPausedRef.current) {
        video.pause();
        setIsPlaying(false);
        return;
      }
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handlePause);

    // Respect visitor motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      userPausedRef.current = true;
      video.pause();
      setIsPlaying(false);
    } else if (!userPausedRef.current) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!userPausedRef.current) {
              setIsPlaying(true);
            } else {
              video.pause();
              setIsPlaying(false);
            }
          })
          .catch(() => {
            if (!userPausedRef.current) {
              setIsPlaying(false);
            }
          });
      }
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handlePause);
    };
  }, []);

  const togglePlayback = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current || (document.getElementById('hero-video') as HTMLVideoElement | null);
    if (!video) return;

    // Determine current active playing state
    const isActivelyPlaying = !video.paused && !video.ended && video.readyState > 1;
    const shouldPause = isPlaying || isActivelyPlaying;

    if (shouldPause) {
      userPausedRef.current = true;
      video.pause();
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    }
  };

  return (
    <section id="hero" className="hero video-hero" aria-label="Aryana Cakery welcome">
      {/* Background Video Layer */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          id="hero-video"
          ref={videoRef}
          className="hero-video"
          src={VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-video-poster.jpg"
          aria-hidden="true"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />
      </div>

      {/* Main Hero Foreground Content */}
      <div className="wrap hero-main-content">
        <div className="hero-copy-video">
          <div className="hero-eyebrow-chip">
            <Sparkles aria-hidden="true" />
            <span>A Little Magic. A Lot of Cake.</span>
          </div>

          <h1>
            Bespoke cakes.
            <br />
            <em>Made for you.</em>
            <br />
            Made in Leeds.
          </h1>

          <p className="hero-lead">
            Celebration cakes, wedding cakes and all the lovely moments in between. Handmade with
            imagination, care and a little Aryana magic.
          </p>

          <div className="button-row">
            <a id="hero-order-btn" href="/order" className="btn btn-primary hero-btn-primary">
              <span>Order Your Cake</span>
              <ArrowRight aria-hidden="true" />
            </a>
            <a id="hero-cakes-btn" href="/cakes" className="btn hero-btn-secondary">
              <span>View Our Cakes</span>
            </a>
          </div>

          <div className="hero-note-video">
            <Heart aria-hidden="true" />
            <span>Your ideas, our icing. Something completely you.</span>
          </div>
        </div>
      </div>

      {/* Trust & Accreditations Foot Bar with Accessible Video Controls */}
      <div className="hero-trust-bar">
        <div className="wrap hero-trust-inner">
          <div className="hero-trust-items">
            <div className="hero-trust-item">
              <ChefHat aria-hidden="true" />
              <span>Level 2 &amp; 3 trained Pastry Chef</span>
            </div>
            <div className="hero-trust-divider" aria-hidden="true" />
            <div className="hero-trust-item">
              <Heart aria-hidden="true" />
              <span>Beautifully bespoke</span>
            </div>
            <div className="hero-trust-divider" aria-hidden="true" />
            <div className="hero-trust-item">
              <MapPin aria-hidden="true" />
              <span>Your local Leeds cakery</span>
            </div>
          </div>

          <button
            id="hero-video-toggle"
            type="button"
            onClick={togglePlayback}
            className="hero-video-toggle"
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
            title={isPlaying ? 'Pause background video' : 'Play background video'}
          >
            {isPlaying ? (
              <Pause className="size-3.5" aria-hidden="true" />
            ) : (
              <Play className="size-3.5" aria-hidden="true" />
            )}
            <span>{isPlaying ? 'Pause video' : 'Play video'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// Named alias export for compatibility with existing imports
export const ScrollCakeHero = VideoHero;

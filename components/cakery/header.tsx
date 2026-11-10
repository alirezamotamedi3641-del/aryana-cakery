'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Cake,
  PartyPopper,
  HeartHandshake,
  Sparkles,
  Heart,
  Building2,
  Gift,
  Phone,
  MapPin,
} from 'lucide-react';
import { categories } from '@/lib/cakery';

const icons = {
  Cake,
  PartyPopper,
  HeartHandshake,
  Sparkles,
  Heart,
  Building2,
  Gift,
};

export function CategoryIcon({ name, ...props }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] || Cake;
  return <Icon {...props} aria-hidden="true" />;
}

export function Header() {
  const [cakesOpen, setCakesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCakesOpen, setMobileCakesOpen] = useState(true);
  const path = usePathname();

  const megaWrapperRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menus automatically whenever pathname changes
  useEffect(() => {
    setCakesOpen(false);
    setMobileOpen(false);
  }, [path]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  // Close mega menu on outside click or escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaWrapperRef.current && !megaWrapperRef.current.contains(e.target as Node)) {
        setCakesOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setCakesOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setCakesOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setCakesOpen(false);
    }, 280);
  }, []);

  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setCakesOpen((prev) => !prev);
  }, []);

  // Safe navigation click handler that lets Next.js router dispatch without being interrupted
  const handleLinkClick = useCallback(() => {
    setTimeout(() => {
      setCakesOpen(false);
      setMobileOpen(false);
    }, 60);
  }, []);

  const isCakesActive = path === '/cakes' || path.startsWith('/cakes/');

  return (
    <>
      {/* Top Banner Notice */}
      <div className="top-note" id="top-note-banner">
        A little slice of happiness, handmade in Leeds <span>♡</span>{' '}
        <span className="hide-mobile">Bespoke cakes for your special moments</span>
      </div>

      {/* Main Header Bar */}
      <header className="site-header" id="site-header-navigation">
        <div className="wrap header-inner">
          {/* Logo Wordmark */}
          <Link href="/" className="wordmark" aria-label="Aryana Cakery home">
            aryana<small>CAKERY</small>
          </Link>

          {/* Desktop Navigation: Home | Cakes | About Us | Gallery | Order | Contact */}
          <nav className="desktop-nav" aria-label="Main navigation" id="desktop-main-navigation">
            <Link
              href="/"
              aria-current={path === '/' ? 'page' : undefined}
              id="desktop-nav-home"
            >
              Home
            </Link>

            {/* Cakes Mega Menu */}
            <div
              className="mega-menu-wrapper"
              ref={megaWrapperRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                id="cakes-mega-trigger"
                className={`nav-trigger-btn ${isCakesActive ? 'active' : ''}`}
                aria-expanded={cakesOpen}
                aria-haspopup="true"
                aria-controls="cakes-mega-dropdown"
                onClick={handleTriggerClick}
              >
                <span>Cakes</span>
                <ChevronDown
                  className={`nav-chevron ${cakesOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {/* Mega Dropdown */}
              <div
                id="cakes-mega-dropdown"
                role="region"
                aria-labelledby="cakes-mega-trigger"
                className={`mega-menu-dropdown ${cakesOpen ? 'is-open' : 'is-closed'}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="mega-grid">
                  <div>
                    <p className="eyebrow">FOR EVERY OCCASION</p>
                    <div className="mega-links">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/cakes/${c.slug}`}
                          className={`mega-link ${path === `/cakes/${c.slug}` ? 'active' : ''}`}
                          onClick={handleLinkClick}
                          id={`mega-link-${c.slug}`}
                        >
                          <CategoryIcon name={c.icon} />
                          <span>{c.name}</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/cakes"
                      className="text-link"
                      onClick={handleLinkClick}
                      id="mega-link-explore-all"
                      style={{ marginTop: '8px' }}
                    >
                      Explore all our cakes <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </div>

                  {/* Featured Wedding Cake Card */}
                  <Link
                    href="/cakes/wedding-cakes-leeds"
                    className="mega-feature"
                    onClick={handleLinkClick}
                    id="mega-feature-wedding"
                  >
                    <Image
                      src="/images/floral-wedding-cake-small.webp"
                      alt="White floral wedding cake handcrafted in Leeds"
                      width={273}
                      height={144}
                      style={{ width: '100%', height: '144px', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <h3>Your forever cake</h3>
                    <p>Beautifully bespoke, just like your day.</p>
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              aria-current={path === '/about' ? 'page' : undefined}
              id="desktop-nav-about"
            >
              About Us
            </Link>
            <Link
              href="/gallery"
              aria-current={path === '/gallery' ? 'page' : undefined}
              id="desktop-nav-gallery"
            >
              Gallery
            </Link>
            <Link
              href="/order"
              aria-current={path === '/order' ? 'page' : undefined}
              id="desktop-nav-order"
            >
              Order
            </Link>
            <Link
              href="/contact"
              aria-current={path === '/contact' ? 'page' : undefined}
              id="desktop-nav-contact"
            >
              Contact
            </Link>
          </nav>

          {/* Prominent Order a Cake CTA Button */}
          <Link
            href="/order"
            className="btn btn-primary header-order"
            id="header-order-cta"
            aria-label="Order a cake online from Aryana Cakery"
          >
            Order a Cake <ArrowUpRight aria-hidden="true" />
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-toggle"
            id="mobile-navigation-toggle"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer & Backdrop */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? 'is-open' : 'is-closed'}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal={mobileOpen}
        aria-label="Aryana Cakery navigation menu"
        className={`mobile-drawer-panel ${mobileOpen ? 'is-open' : 'is-closed'}`}
        tabIndex={-1}
      >
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <Link
            href="/"
            className="wordmark"
            onClick={handleLinkClick}
            aria-label="Aryana Cakery home"
          >
            aryana<small>CAKERY</small>
          </Link>
          <button
            type="button"
            className="mobile-close-btn"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Intro */}
        <div className="mobile-drawer-intro">
          <h2 className="display">A little cake magic.</h2>
          <p>Handmade bespoke celebration &amp; wedding cakes in Leeds</p>
        </div>

        {/* Primary Mobile Nav Links: Home | Cakes | About Us | Gallery | Order | Contact */}
        <nav aria-label="Mobile primary navigation" className="mobile-links" id="mobile-primary-links">
          {/* Home */}
          <Link
            href="/"
            aria-current={path === '/' ? 'page' : undefined}
            onClick={handleLinkClick}
            className="mobile-nav-link"
            id="mobile-nav-home"
          >
            <span>Home</span>
            <ArrowRight aria-hidden="true" />
          </Link>

          {/* Cakes Accordion Item */}
          <div className="mobile-cakes-accordion">
            <button
              type="button"
              className={`mobile-cakes-accordion-btn ${isCakesActive ? 'active' : ''}`}
              onClick={() => setMobileCakesOpen((prev) => !prev)}
              aria-expanded={mobileCakesOpen}
              aria-controls="mobile-cakes-sublist"
              id="mobile-cakes-toggle"
            >
              <span className="mobile-cakes-btn-title">
                <Cake className="w-4 h-4" aria-hidden="true" />
                <span>Cakes</span>
              </span>
              <div className="mobile-cakes-btn-meta">
                <span className="mobile-cakes-badge">7 Occasions</span>
                <ChevronDown
                  className={`nav-chevron ${mobileCakesOpen ? 'open' : ''}`}
                  aria-hidden="true"
                />
              </div>
            </button>

            {mobileCakesOpen && (
              <div className="mobile-subcategories" id="mobile-cakes-sublist">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cakes/${c.slug}`}
                    className={`mobile-category-item ${path === `/cakes/${c.slug}` ? 'active' : ''}`}
                    aria-current={path === `/cakes/${c.slug}` ? 'page' : undefined}
                    onClick={handleLinkClick}
                    id={`mobile-subcat-${c.slug}`}
                  >
                    <CategoryIcon name={c.icon} />
                    <span>{c.name}</span>
                  </Link>
                ))}
                <Link
                  href="/cakes"
                  className="mobile-category-item text-link mobile-explore-all"
                  onClick={handleLinkClick}
                  id="mobile-subcat-explore-all"
                >
                  <span>Explore all our cakes</span>
                  <ArrowRight aria-hidden="true" style={{ width: '15px', marginLeft: 'auto' }} />
                </Link>
              </div>
            )}
          </div>

          {/* About Us */}
          <Link
            href="/about"
            aria-current={path === '/about' ? 'page' : undefined}
            onClick={handleLinkClick}
            className="mobile-nav-link"
            id="mobile-nav-about"
          >
            <span>About Us</span>
            <ArrowRight aria-hidden="true" />
          </Link>

          {/* Gallery */}
          <Link
            href="/gallery"
            aria-current={path === '/gallery' ? 'page' : undefined}
            onClick={handleLinkClick}
            className="mobile-nav-link"
            id="mobile-nav-gallery"
          >
            <span>Gallery</span>
            <ArrowRight aria-hidden="true" />
          </Link>

          {/* Order */}
          <Link
            href="/order"
            aria-current={path === '/order' ? 'page' : undefined}
            onClick={handleLinkClick}
            className="mobile-nav-link"
            id="mobile-nav-order"
          >
            <span>Order</span>
            <ArrowRight aria-hidden="true" />
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            aria-current={path === '/contact' ? 'page' : undefined}
            onClick={handleLinkClick}
            className="mobile-nav-link"
            id="mobile-nav-contact"
          >
            <span>Contact</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </nav>

        {/* Drawer Footer CTA & Contact Details */}
        <div className="mobile-drawer-footer">
          <Link
            href="/order"
            className="btn btn-primary"
            onClick={handleLinkClick}
            id="mobile-drawer-order-cta"
          >
            Order a Cake <ArrowUpRight aria-hidden="true" />
          </Link>
          <div className="mobile-drawer-contact">
            <strong>Aryana Cakery Leeds</strong>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: 'var(--deep-pink, #a23860)', flexShrink: 0 }} aria-hidden="true" />
              <span>314 Stanningley Road, Leeds, LS13 3EG</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
              <Phone style={{ width: '14px', height: '14px', color: 'var(--deep-pink, #a23860)', flexShrink: 0 }} aria-hidden="true" />
              <a href="tel:07490284381" style={{ color: 'var(--deep-pink, #a23860)', fontWeight: 600 }}>
                07490 284381
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

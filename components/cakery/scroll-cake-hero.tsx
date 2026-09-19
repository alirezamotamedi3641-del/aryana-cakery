'use client';

import {useEffect, useRef} from 'react';
import {ArrowDown, ArrowRight, ChefHat, Heart, MapPin, Sparkles} from 'lucide-react';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function ScrollCakeHero() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const frame = root.querySelector<HTMLElement>('.cake-hero-sticky')!;
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-cake-tier]'));
    let raf = 0;
    const update = () => {
      raf = 0;
      const top = parseFloat(getComputedStyle(frame).top) || 0;
      const distance = Math.max(1, root.offsetHeight - frame.offsetHeight);
      const progress = reduced.matches ? 1 : clamp((top - root.getBoundingClientRect().top) / distance);
      layers.forEach((layer, index) => {
        const local = index === 0 ? 1 : smooth(clamp((progress - (index - 1) * .28 - .04) / .25));
        layer.style.setProperty('--tier-opacity', String(local));
        layer.style.setProperty('--tier-lift', `${(1 - local) * -150}px`);
        layer.style.setProperty('--tier-scale', String(.96 + local * .04));
      });
      root.style.setProperty('--cake-progress', String(progress));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(frame);
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    update();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', schedule);
    };
  }, []);

  return <section ref={section} className="hero cake-scroll-hero" aria-label="A cake coming together, tier by tier">
    <div className="cake-hero-sticky">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles/> A LITTLE MAGIC. A LOT OF CAKE.</div>
          <h1>Bespoke cakes.<br/><em>Made for you.</em><br/>Made in Leeds.</h1>
          <p>Celebration cakes, wedding cakes and all the lovely moments in between. Handmade with imagination, care and a little Aryana magic.</p>
          <div className="button-row"><a href="/order" className="btn btn-primary">Order Your Cake <ArrowRight/></a><a href="/cakes" className="btn btn-secondary">View Our Cakes</a></div>
          <div className="hero-note"><Heart/> Your ideas, our icing. Something completely you.</div>
        </div>
        <div className="cake-hero-visual">
          <div className="cake-stack" role="img" aria-label="A four-tier white cake decorated with delicate flowers, assembling from the base upwards as you scroll">
            {[0,1,2,3].map(tier=><div key={tier} data-cake-tier={tier} className={'cake-tier cake-tier-'+tier} aria-hidden="true"><div className={'cake-sprite cake-sprite-'+tier}/></div>)}
          </div>
          <div className="cake-scroll-cue"><ArrowDown aria-hidden="true"/><span>A little magic, tier by tier</span><div className="cake-progress" aria-hidden="true"><span/></div></div>
        </div>
      </div>
      <div className="wrap hero-foot"><span><ChefHat/> Level 2 &amp; 3 trained Pastry Chef</span><span><Heart/> Beautifully bespoke</span><span><MapPin/> Your local Leeds cakery</span></div>
    </div>
  </section>;
}

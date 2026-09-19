'use client';

import {useRef, useState} from 'react';
import {ArrowUpRight, Pause, Play} from 'lucide-react';
import {Dialog, DialogContent, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import {business} from '@/lib/cakery';
import {reviews} from '@/lib/reviews';

export function Reviews() {
  const [paused, setPaused] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<(typeof reviews)[number] | null>(null);
  return <section className="section reviews-section">
    <div className="wrap reviews-heading">
      <div><div className="eyebrow">A LITTLE CUSTOMER LOVE</div><h2>Sweet words. Happy people.</h2></div>
      <a href={business.maps} className="text-link" target="_blank" rel="noreferrer">Find us on Google <ArrowUpRight/></a>
    </div>
    <div className={'review-marquee '+(paused || selected ? 'is-paused' : '')}>
      <div className="marquee-track">
        {[false,true].map(duplicate=><div className="marquee-set" key={String(duplicate)} aria-hidden={duplicate || undefined}>
          {reviews.map(review=>{
            const long = review.text.length > 160;
            const preview = long ? review.text.slice(0,160).replace(/\s+\S*$/, '')+'…' : review.text;
            return <article className="review-card" key={review.name}>
              <div className="review-person">
                <span className="review-avatar" aria-hidden="true">{review.name.split(' ').slice(0,2).map(n=>n[0]).join('')}</span>
                <div><h3>{review.name}</h3><span>Google review</span></div>
                <span className="google-letter" aria-hidden="true">G</span>
              </div>
              <blockquote>{preview}</blockquote>
              <div className="review-card-action">{long && <button type="button" className="review-read-more" tabIndex={duplicate ? -1 : 0} aria-label={'Read full review by '+review.name} aria-haspopup="dialog" onClick={event=>{opener.current=event.currentTarget;setSelected(review);}}>Read more <ArrowUpRight aria-hidden="true"/></button>}</div>
            </article>;
          })}
        </div>)}
      </div>
    </div>
    <div className="wrap"><button className="motion-control" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play/>:<Pause/>}{paused?'Play reviews':'Pause reviews'}</button></div>
    <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null);}}>
      <DialogContent className="review-dialog" onCloseAutoFocus={event=>{event.preventDefault();opener.current?.focus();}}>
        <DialogTitle>{selected?.name}</DialogTitle>
        <DialogDescription>Customer review on Google</DialogDescription>
        <blockquote>{selected?.text}</blockquote>
        <a className="text-link" href={business.maps} target="_blank" rel="noreferrer">View reviews on Google <ArrowUpRight/></a>
      </DialogContent>
    </Dialog>
  </section>;
}

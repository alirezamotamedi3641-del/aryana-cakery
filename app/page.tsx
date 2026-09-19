import {OrderForm} from '@/components/cakery/order-form';
import {CakeGallery,Reviews} from '@/components/cakery/gallery';
import {WhyAryana,Process,CTA} from '@/components/cakery/sections';
import {FAQs} from '@/components/cakery/faq';
import {categories} from '@/lib/cakery';
import {ScrollCakeHero} from '@/components/cakery/scroll-cake-hero';
export default function Home(){return <main id="main"><ScrollCakeHero/><OrderForm/><Reviews/><section className="section home-gallery"><div className="wrap section-heading center"><div className="eyebrow">MADE BY US. IMAGINED BY YOU.</div><h2>For moments like these.</h2><p>A few of the lovely cakes that have left our little Leeds cakery. What will yours look like?</p><div className="category-chips">{categories.map(c=><a key={c.slug} href={"/cakes/"+c.slug}>{c.name}</a>)}</div></div><CakeGallery marquee/></section><WhyAryana/><Process/><FAQs/><CTA/></main>}

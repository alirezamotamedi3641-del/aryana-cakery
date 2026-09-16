import type {Metadata} from 'next';
import {CakeGallery} from '@/components/cakery/gallery';
import {CTA} from '@/components/cakery/sections';
import {business} from '@/lib/cakery';
import {Camera as Instagram,ArrowUpRight} from 'lucide-react';
export const metadata:Metadata={title:'Cake Gallery | Real Bespoke Cakes in Leeds',description:'Explore real wedding, birthday and celebration cakes handmade by Aryana Cakery in Leeds. Find inspiration for your own bespoke cake.',alternates:{canonical:'/gallery'}};
export default function GalleryPage(){return <main id="main"><section className="page-intro wrap"><div className="eyebrow">A LITTLE LOOK AT WHAT WE MAKE</div><h1>Good things<br/>come <em>in cake.</em></h1><p>From delicate florals to playful little dinosaurs. Every cake here was made by us, for someone’s special moment.</p><a className="text-link" href={business.instagram} target="_blank" rel="noreferrer"><Instagram/> More from the cakery <ArrowUpRight/></a></section><section className="wrap gallery-page"><CakeGallery/></section><CTA title="Spotted a style you love?" text="Tell us what caught your eye. We’ll talk about making a cake that’s personal to your occasion."/></main>}

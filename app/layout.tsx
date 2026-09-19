import type { Metadata } from 'next';
import {Header} from '@/components/cakery/header';
import {Footer} from '@/components/cakery/sections';
import {business} from '@/lib/cakery';
import './globals.css';
import './cloud-buttons.css';
import './reviews.css';
export const metadata:Metadata={metadataBase:new URL(business.origin),title:{default:'Aryana Cakery | Bespoke Celebration & Wedding Cakes Leeds',template:'%s | Aryana Cakery'},description:'Bespoke celebration and wedding cakes, handmade in Leeds. Explore real Aryana Cakery designs and share your cake ideas. Find us at 314 Stanningley Road.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'en_GB',siteName:'Aryana Cakery'},icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
const schema={'@context':'https://schema.org','@type':'Bakery',name:business.name,url:business.origin,description:'Bespoke wedding and celebration cakes in Leeds.',address:{'@type':'PostalAddress',streetAddress:'314 Stanningley Road',addressLocality:'Leeds',postalCode:'LS13 3EG',addressCountry:'GB'},sameAs:[business.instagram,business.weddingInstagram]};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en-GB"><body><a className="skip" href="#main">Skip to content</a><Header/>{children}<Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/></body></html>}

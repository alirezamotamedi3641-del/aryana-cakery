import type { Metadata } from 'next';
import {SiteShell} from '@/components/cakery/site-shell';
import {business} from '@/lib/cakery';
import './globals.css';
import './cloud-buttons.css';
import './reviews.css';
import './cake-hero.css';
import './footer-credit.css';
import './nav.css';
export const metadata:Metadata={metadataBase:new URL(business.origin),title:{default:'Aryana Cakery | Bespoke Celebration & Wedding Cakes Leeds',template:'%s | Aryana Cakery'},description:'Bespoke celebration and wedding cakes, handmade in Leeds. Explore real Aryana Cakery designs and share your cake ideas. Find us at 314 Stanningley Road.',alternates:{canonical:'/'},openGraph:{type:'website',locale:'en_GB',siteName:'Aryana Cakery'},icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
const schema={'@context':'https://schema.org','@type':'Bakery',name:business.name,url:business.origin,description:'Bespoke wedding and celebration cakes in Leeds.',address:{'@type':'PostalAddress',streetAddress:'314 Stanningley Road',addressLocality:'Leeds',postalCode:'LS13 3EG',addressCountry:'GB'},sameAs:[business.instagram,business.weddingInstagram]};
const schemaJson=JSON.stringify(schema).replace(/</g,'\\u003c');
export default function RootLayout({children}:{children:React.ReactNode}){const currentYear=new Date().getFullYear();return <html lang="en-GB" suppressHydrationWarning><body suppressHydrationWarning><SiteShell schemaJson={schemaJson} year={currentYear}>{children}</SiteShell></body></html>}

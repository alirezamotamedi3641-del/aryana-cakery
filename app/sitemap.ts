import type {MetadataRoute} from 'next';
import {categories,business} from '@/lib/cakery';
export default function sitemap():MetadataRoute.Sitemap{return ['','/cakes','/about','/gallery','/order','/contact','/privacy-policy','/terms-and-conditions',...categories.map(c=>'/cakes/'+c.slug)].map(path=>({url:business.origin+path,changeFrequency:'monthly',priority:path===''?1:path.startsWith('/cakes/')?.8:.6}));}

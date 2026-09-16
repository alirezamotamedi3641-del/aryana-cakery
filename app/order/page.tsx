import type {Metadata} from 'next';
import {OrderForm} from '@/components/cakery/order-form';
import {FAQs} from '@/components/cakery/faq';
import {homeFaqs} from '@/lib/cakery';
export const metadata:Metadata={title:'Order a Bespoke Cake in Leeds',description:'Send your bespoke cake enquiry to Aryana Cakery in Leeds. Share your date, inspiration and requirements. Please enquire at least two days in advance.',alternates:{canonical:'/order'}};
export default function OrderPage(){return <main id="main"><OrderForm standalone/><FAQs items={[homeFaqs[0],homeFaqs[3],homeFaqs[6],homeFaqs[7],homeFaqs[9]]} title="Before you send your little idea."/></main>}

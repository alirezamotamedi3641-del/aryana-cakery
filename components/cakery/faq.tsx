'use client';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion';
import {type FAQ,homeFaqs} from '@/lib/cakery';
import {ArrowUpRight} from 'lucide-react';
export function FAQs({items=homeFaqs,title='A few things you might be wondering.'}:{items?:FAQ[];title?:string}){return <section className="section faq-section"><div className="wrap faq-grid"><div><div className="eyebrow">GOOD TO KNOW</div><h2>{title}</h2><p>Something else on your mind?<br/>We’re happy to talk cake.</p><a className="text-link" href="/contact">Get in touch <ArrowUpRight/></a></div><Accordion type="single" collapsible className="faq-list">{items.map(([question,answer],i)=><AccordionItem key={question} value={'faq-'+i}><AccordionTrigger className="faq-question">{question}</AccordionTrigger><AccordionContent className="faq-answer">{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>;}

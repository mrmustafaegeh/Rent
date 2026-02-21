'use client';

import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/ui/Accordion";
import { useTranslations } from "next-intl";

export function FAQ() {
    const t = useTranslations('FAQ');
    const faqs = t.raw('items') as { question: string, answer: string }[];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12 sm:mb-16 space-y-4">
                    <span className="text-electric font-bold tracking-[0.2em] text-xs uppercase">{t('overline')}</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-navy">{t('title')}</h2>
                    <p className="text-gray-500 text-base md:text-lg font-body">{t('description')}</p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-100 shadow-sm">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-xl bg-white px-2 data-[state=open]:border-gold/50 data-[state=open]:shadow-md transition-all duration-500 ease-out">
                                <AccordionTrigger className="px-6 py-4 text-left font-heading font-bold text-lg text-navy hover:text-electric hover:no-underline transition-colors [&[data-state=open]]:text-electric">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 text-gray-500 font-body leading-relaxed text-base border-t border-gray-50 pt-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}

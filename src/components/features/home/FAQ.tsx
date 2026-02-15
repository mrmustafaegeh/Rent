'use client';

import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/ui/Accordion";

const faqs = [
    {
        question: "What documents do I need to rent a car in North Cyprus?",
        answer: "You will need a valid driver's license held for at least 2 years and a valid passport or ID card. International Driving Permits (IDP) are not typically required for tourists with licenses in English."
    },
    {
        question: "Is insurance included in the rental price?",
        answer: "Yes, basic Third Party Insurance is mandatory and included. Collision Damage Waiver (CDW) is often available as an optional extra for peace of mind."
    },
    {
        question: "Can I drive the rental car to South Cyprus?",
        answer: "Most North Cyprus rental cars cannot be driven to the South due to insurance limitations. Cross-border policies vary, so please check with the specific provider beforehand."
    },
    {
        question: "Do you offer airport delivery at Ercan Airport?",
        answer: "Absolutely! Most of our providers offer free or low-cost delivery to Ercan Airport (ECN). You can pick up your car immediately upon arrival."
    },
    {
        question: "Are there any hidden fees?",
        answer: "We pride ourselves on transparency. The price you see includes all mandatory taxes and fees. Any optional extras (child seats, additional drivers) are clearly listed."
    }
];

export function FAQ() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12 sm:mb-16 space-y-4">
                    <span className="text-electric font-bold tracking-[0.2em] text-xs uppercase">GOT QUESTIONS?</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-navy">Frequently Asked Questions</h2>
                    <p className="text-gray-500 text-base md:text-lg font-body">Everything you need to know about renting a car with us.</p>
                </div>

                <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-100 shadow-sm">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-xl bg-white px-2 data-[state=open]:border-gold/50 data-[state=open]:shadow-md transition-all duration-300">
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

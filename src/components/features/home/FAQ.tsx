'use client';

import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/components/ui/Accordion";

const faqs = [
    {
        question: "How do I rent a car through RENTALX?",
        answer: "Browse our extensive fleet, choose your perfect car, select dates, and book instantly. You can pick up at Ercan, Nicosia, Kyrenia, or have it delivered."
    },
    {
        question: "Is RENTALX free to use?",
        answer: "Yes, our platform is free for users. You pay the rental provider directly or through our secure payment gateway with no hidden booking fees from us."
    },
    {
        question: "What is the minimum age to rent a car in North Cyprus?",
        answer: "Typically 21-25 years depending on the vehicle category. Luxury cars may require 25+."
    },
    {
        question: "Do I need a credit card?",
        answer: "Most providers require a credit card for the security deposit, but some accept cash deposits. Filter by 'No Credit Card Required' to find suitable options."
    },
    {
        question: "Can I drive to South Cyprus?",
        answer: "Generally, rental cars from the North cannot be taken to the South due to insurance restrictions. Please check with the provider."
    }
];

export function FAQ() {
    return (
        <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground">Find answers to common questions about car rental in North Cyprus.</p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium text-lg hover:no-underline hover:text-primary transition-colors">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

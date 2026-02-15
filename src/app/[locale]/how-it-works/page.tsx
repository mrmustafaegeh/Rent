'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';

// Process Step Component
const ProcessStep = ({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center py-12 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-light)]/30 transition-colors rounded-xl px-4 md:px-8">
    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-[var(--surface-light)] rounded-2xl flex items-center justify-center text-[var(--accent)] border border-[var(--border)] relative overflow-hidden group">
         <span className="absolute -right-2 -bottom-4 text-6xl text-[var(--background)] font-bold opacity-50 z-0">{number}</span>
         <div className="relative z-10">{icon}</div>
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
        <span className="text-[var(--primary)] text-sm font-bold uppercase tracking-wider border border-[var(--primary)] px-2 py-0.5 rounded-full">Step {number}</span>
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{description}</p>
    </div>
  </div>
);

// FAQ Item Component
const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface-light)] mb-4">
      <button 
        className="w-full flex justify-between items-center p-6 text-left hover:bg-[var(--surface-lighter)] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-lg">{question}</span>
        <svg 
           className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
           fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-6 pt-0 text-[var(--text-secondary)] border-t border-[var(--border)]/50">
           {answer}
        </div>
      </div>
    </div>
  );
};

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pb-20 overflow-hidden">
             <div className="container mx-auto px-4 text-center">
                 <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black text-navy mb-6">How It Works</h1>
                 <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Your journey to driving the extraordinary is simple and seamless. Follow these steps to get behind the wheel.
                 </p>
             </div>
        </section>

        {/* Process Steps */}
        <section className="py-12 bg-[var(--surface)]">
            <div className="container mx-auto px-4 max-w-4xl">
                <ProcessStep 
                    number="1"
                    title="Choose Your Vehicle"
                    description="Browse our extensive fleet of premium luxury and sports cars. Filter by brand, category, or price to find the perfect match for your style and needs."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                />
                <ProcessStep 
                    number="2"
                    title="Select Dates & Book"
                    description="Choose your pick-up and drop-off dates. Our real-time availability system ensures you can secure your dream car instantly. Create an account for faster checkout."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />
                <ProcessStep 
                    number="3"
                    title="Provide Documentation"
                    description="Upload your driver's license and ID securely through our portal. For international visitors, a passport and international driving permit may be required."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}
                />
                <ProcessStep 
                    number="4"
                    title="Pick-up or Delivery"
                    description="Collect your car from our showroom or choose our premium delivery service to have it brought directly to your hotel or airport terminal."
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
            </div>
        </section>

        {/* Requirements Checklist */}
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="bg-[var(--surface-light)] rounded-2xl border border-[var(--border)] p-8 md:p-12 max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Requirements Checklist</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--primary)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                For Residents
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">Valid Driving License (min. 12 months old)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">National ID Card Copy</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">Credit Card for Security Deposit</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">Minimum Age: 21 (25 for Sports/Luxury)</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--accent)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                For International Visitors
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">Passport Copy</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">Entry Stamp (Visa) Copy</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">Home Country Driving License</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✔</span>
                                    <span className="text-[var(--text-secondary)]">International Driving Permit (IDP) If Needed</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[var(--surface)]">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <FAQItem 
                        question="Is insurance included in the rental price?"
                        answer="Yes, basic comprehensive insurance is included in the daily rental price. This covers damage to the vehicle in case of an accident where a police report is provided. Additional coverage options are available for peace of mind."
                    />
                    <FAQItem 
                        question="What is the daily mileage limit?"
                        answer="Most of our standard rentals come with a generous daily mileage limit of 250km. Excess mileage is charged at a minimal rate per km depending on the vehicle category."
                    />
                    <FAQItem 
                        question="Do I need to pay a security deposit?"
                        answer="Yes, a security deposit is required for all rentals. This amount is pre-authorized on your credit card and is fully refundable upon the safe return of the vehicle, usually released within 14-21 days."
                    />
                    <FAQItem 
                        question="Can I drive the car to other emirates?"
                        answer="Absolutely! You can drive our vehicles across all emirates in the UAE. However, taking the vehicle outside the UAE (e.g., to Oman or Saudi Arabia) requires special written permission and additional insurance."
                    />
                    <FAQItem 
                        question="What if the car breaks down?"
                        answer="We offer 24/7 roadside assistance. In the unlikely event of a breakdown, simply call our support line, and we will arrange for immediate assistance or a replacement vehicle."
                    />
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-6">Ready to hit the road?</h2>
                <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
                    Browse our premium fleet and book your dream car in minutes.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/fleet">
                        <Button size="lg" className="min-w-[200px]">Browse Fleet</Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" size="lg" className="min-w-[200px]">Contact Us</Button>
                    </Link>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

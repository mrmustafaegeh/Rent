'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', content: '' });
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-10" />
            <div className="container mx-auto px-4 relative z-10 text-center">
                <span className="text-gold font-bold uppercase tracking-widest text-xs mb-4 block">Here to Help</span>
                <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
                    Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500">Touch</span>
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto font-body font-light">
                    Have a question about our fleet or services? Our concierge team is available 24/7 to assist you.
                </p>
            </div>
        </section>

        <section className="py-20 bg-white -mt-16 relative z-20">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* Contact Info */}
                    <div className="lg:w-5/12 bg-navy p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-electric/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                         <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none" />
                         
                         <div className="relative z-10 space-y-12">
                             <div>
                                 <h3 className="text-2xl font-heading font-bold mb-2">Contact Information</h3>
                                 <p className="text-gray-400 font-body text-sm">Fill out the form and our team will get back to you within 24 hours.</p>
                             </div>
                             
                             <div className="space-y-8">
                                 <div className="flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold shrink-0">
                                         <Phone className="w-5 h-5" />
                                     </div>
                                     <div>
                                         <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Phone</p>
                                         <p className="font-heading font-medium text-lg">+90 533 000 00 00</p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold shrink-0">
                                         <Mail className="w-5 h-5" />
                                     </div>
                                     <div>
                                         <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Email</p>
                                         <p className="font-heading font-medium text-lg">hello@mediterraneandrive.com</p>
                                     </div>
                                 </div>
                                 
                                 <div className="flex items-start gap-4">
                                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gold shrink-0">
                                         <MapPin className="w-5 h-5" />
                                     </div>
                                     <div>
                                         <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Headquarters</p>
                                         <p className="font-heading font-medium text-lg">Kyrenia, North Cyprus</p>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         <div className="relative z-10 mt-12 pt-12 border-t border-white/10">
                              <div className="flex gap-4">
                                  {/* Social Icons Placeholder */}
                                  <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold hover:text-navy transition-colors cursor-pointer flex items-center justify-center">
                                      <span className="font-bold text-xs">IG</span>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold hover:text-navy transition-colors cursor-pointer flex items-center justify-center">
                                      <span className="font-bold text-xs">TW</span>
                                  </div>
                                   <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold hover:text-navy transition-colors cursor-pointer flex items-center justify-center">
                                      <span className="font-bold text-xs">FB</span>
                                  </div>
                              </div>
                         </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-7/12 p-10 md:p-14 bg-white">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input 
                                    label="First Name" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John" 
                                    className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200" 
                                    required
                                />
                                <Input 
                                    label="Last Name" 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe" 
                                    className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200" 
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input 
                                    label="Email Address" 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com" 
                                    className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200" 
                                    required
                                />
                                <Input 
                                    label="Phone Number" 
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 000-0000" 
                                    className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                                <textarea 
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full min-h-[150px] p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/5 transition-all text-black font-medium resize-none"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button disabled={loading} className="h-14 px-8 bg-navy text-gold hover:bg-navy/90 font-bold rounded-xl shadow-lg shadow-navy/20 flex items-center gap-2">
                                    <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

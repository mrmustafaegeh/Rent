'use client';

import { Link } from '@/navigation';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-[#0D3B66] text-white pt-20 pb-10 relative overflow-hidden">
            {/* Top gradient accent */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#0D3B66] via-[#00B4D8] to-[#0D3B66]" />

            {/* Dot texture */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">

                    {/* Brand */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="font-body font-black text-2xl tracking-tight text-white">
                                My<span className="text-[#00B4D8]">Island</span>
                            </span>
                        </Link>
                        <p className="font-body text-white/60 text-sm leading-relaxed max-w-sm">{t('about')}</p>
                        <div className="space-y-3 text-white/60 text-sm font-body">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-[#00B4D8] shrink-0" />
                                <span>{t('address')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[#00B4D8] shrink-0" />
                                <span>+90 533 000 00 00</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-[#00B4D8] shrink-0" />
                                <span>hello@mediterraneandrive.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="font-body font-semibold text-xs text-white tracking-widest uppercase">{t('company')}</h3>
                        <ul className="space-y-2.5 font-body text-sm text-white/60">
                            {[
                                { label: t('links.about'),      href: '/about' },
                                { label: t('links.howItWorks'), href: '/how-it-works' },
                                { label: t('links.careers'),    href: '/careers' },
                                { label: t('links.blog'),       href: '/blog' },
                                { label: t('links.contact'),    href: '/contact' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="hover:text-[#00B4D8] transition-colors duration-150 block py-0.5">{l.label}</Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/auth/partner-register" className="text-[#00B4D8] font-semibold hover:text-white transition-colors duration-150 block py-0.5">{t('links.partners')}</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Fleet */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="font-body font-semibold text-xs text-white tracking-widest uppercase">{t('fleet')}</h3>
                        <ul className="space-y-2.5 font-body text-sm text-white/60">
                            {[
                                { label: t('links.luxury'),   href: '/cars?category=LUXURY' },
                                { label: t('links.suv'),      href: '/cars?category=SUV' },
                                { label: t('links.economy'),  href: '/cars?category=ECONOMY' },
                                { label: t('links.sports'),   href: '/cars?category=SPORTS' },
                                { label: t('links.electric'), href: '/cars?category=ELECTRIC' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="hover:text-[#00B4D8] transition-colors duration-150 block py-0.5">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="font-body font-semibold text-xs text-white tracking-widest uppercase">{t('support')}</h3>
                        <ul className="space-y-2.5 font-body text-sm text-white/60">
                            {[
                                { label: t('links.help'),         href: '/faq' },
                                { label: t('links.terms'),        href: '/legal/terms' },
                                { label: t('links.privacy'),      href: '/legal/privacy' },
                                { label: t('links.insurance'),    href: '/legal/insurance' },
                                { label: t('links.sitemap'),      href: '/sitemap.xml' },
                                { label: t('links.touristRules') || 'Tourist Rules', href: '/legal/tourist-rules' },
                            ].map(l => (
                                <li key={l.href}>
                                    <Link href={l.href} className="hover:text-[#00B4D8] transition-colors duration-150 block py-0.5">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Get App */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="font-body font-semibold text-xs text-white tracking-widest uppercase">{t('getApp')}</h3>
                        <p className="font-body text-white/50 text-sm">{t('appDesc')}</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { icon: '', platform: t('downloadApple'), store: 'App Store' },
                                { icon: '▶', platform: t('downloadGoogle'), store: 'Google Play' },
                            ].map((app) => (
                                <button key={app.store} className="flex items-center gap-3 border border-white/20 rounded-xl p-3 hover:border-[#00B4D8] hover:bg-white/5 transition-all text-left w-full group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#00B4D8]/20 transition-colors shrink-0">
                                        <span className="font-bold text-xs text-white">{app.icon}</span>
                                    </div>
                                    <div>
                                        <div className="font-body text-[9px] text-white/40 uppercase tracking-widest">{app.platform}</div>
                                        <div className="font-body font-bold text-sm text-white">{app.store}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-5">
                    <p className="font-body text-sm text-white/40">
                        © {new Date().getFullYear()} {t('rights')}
                    </p>

                    <div className="flex items-center gap-4">
                        {[
                            { Icon: Facebook,  label: 'Facebook' },
                            { Icon: Instagram, label: 'Instagram' },
                            { Icon: Twitter,   label: 'Twitter' },
                            { Icon: Linkedin,  label: 'LinkedIn' },
                        ].map(({ Icon, label }) => (
                            <Link
                                key={label}
                                href="#"
                                aria-label={label}
                                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-[#00B4D8] hover:text-[#00B4D8] transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <Icon className="h-4 w-4" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

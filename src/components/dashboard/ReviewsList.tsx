'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ReviewsList({ initialReviews }: { initialReviews: any[] }) {
    const t = useTranslations('Reviews');
    const [reviews, setReviews] = useState(initialReviews);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update review status', error);
        }
    };

    const filteredReviews = reviews.filter(review => 
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')}
                        className="w-full h-12 pl-12 pr-4 bg-white rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy/20 transition-all font-medium text-navy placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-100 text-gray-600 font-bold hover:bg-white hover:text-navy hover:border-gray-200">
                    <Filter className="w-4 h-4 mr-2" /> {t('filter')}
                </Button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-navy">{t('noReviews')}</h3>
                        <p className="text-gray-400 text-sm mt-1">{t('noReviewsDesc')}</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* User & Vehicle Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                            {review.user.image ? (
                                                <Image src={review.user.image} alt={review.user.name || 'User'} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-navy text-white font-bold text-xs">
                                                    {(review.user.name?.[0] || 'U')}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-navy text-sm">{review.user.name || 'Anonymous'}</h4>
                                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="ml-auto flex gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-xl mb-4 relative">
                                        <div className="absolute -left-2 top-6 w-4 h-4 bg-gray-50 transform rotate-45 border-l border-b border-gray-50"></div>
                                        <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <span>Vehicle:</span>
                                        <span className="text-navy">{review.vehicle.brand} {review.vehicle.vehicleModel}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                    <Button 
                                        onClick={() => handleAction(review.id, 'approve')}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex-1 shadow-lg shadow-emerald-500/20"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> {t('actions.approve')}
                                    </Button>
                                    <Button 
                                        onClick={() => handleAction(review.id, 'reject')}
                                        variant="outline"
                                        className="border-red-100 text-red-500 hover:bg-red-50 font-bold rounded-xl flex-1"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> {t('actions.reject')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import { MessageSquare } from 'lucide-react';

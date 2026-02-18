'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export interface ReviewDialogProps {
    bookingId: string;
    vehicleId: string;
    vehicleName: string;
    existingReview?: boolean;
}

export function ReviewDialog({ bookingId, vehicleId, vehicleName, existingReview = false }: ReviewDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const t = useTranslations('Reviews');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    comment,
                    vehicleId,
                    bookingId
                })
            });

            if (res.ok) {
                setIsOpen(false);
                router.refresh();
                alert(t('success'));
            } else {
                alert(t('error'));
            }
        } catch (error) {
            console.error(error);
            alert(t('error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (existingReview) {
        return (
            <Button variant="outline" disabled className="w-full md:w-auto opacity-50 cursor-not-allowed">
                {t('givenReview')}
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto border-navy text-navy hover:bg-navy hover:text-white">
                    {t('rateVehicle')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description', { vehicleName })}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-6 space-y-6">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star 
                                    className={`w-10 h-10 ${star <= rating ? 'fill-gold text-gold' : 'text-gray-300'}`} 
                                />
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full min-h-[120px] p-3 rounded-xl border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-navy/20"
                        placeholder={t('placeholder')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        {t('cancel')}
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !comment.trim()}
                        className="bg-navy hover:bg-navy/90 text-white"
                    >
                        {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

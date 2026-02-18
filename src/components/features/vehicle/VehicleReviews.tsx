'use client';

import React, { useEffect, useState } from 'react';
import { Star, User, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

interface Review {
  id: string;
  user: {
    name: string | null;
    image: string | null;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export function VehicleReviews({ vehicleId }: { vehicleId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?vehicleId=${vehicleId}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) fetchReviews();
  }, [vehicleId]);

  if (isLoading) {
    return (
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm animate-pulse">
            <div className="h-8 w-48 bg-gray-100 rounded-lg mb-8" />
            <div className="space-y-8">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-gray-100 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-100 rounded" />
                                <div className="h-3 w-20 bg-gray-100 rounded" />
                            </div>
                        </div>
                        <div className="h-20 w-full bg-gray-100 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-heading font-black text-navy italic">Patient <span className="text-gold">Stories</span></h2>
          <p className="text-gray-500 mt-2 italic">What our clients say about their experience with this vehicle.</p>
        </div>
        <div className="flex items-center gap-4 bg-navy/5 p-4 rounded-3xl">
          <div className="text-4xl font-heading font-black text-navy italic">{averageRating}</div>
          <div>
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 fill-current ${i < Math.round(Number(averageRating)) ? '' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Based on {reviews.length || 0} Reviews</div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-100" />

      {reviews.length === 0 ? (
        <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 italic font-medium">No reviews yet for this vehicle.</p>
        </div>
      ) : (
        <div className="space-y-10">
            {reviews.map((review) => (
            <div key={review.id} className="space-y-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-black text-xs">
                    {review.user?.image ? (
                        <img src={review.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                        (review.user?.name || 'G').split(' ').map(n => n[0]).join('')
                    )}
                    </div>
                    <div>
                    <h4 className="font-bold text-navy">{review.user?.name || 'Anonymous User'}</h4>
                    <div className="flex text-gold">
                        {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 fill-current ${i < review.rating ? '' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    </div>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                <div className="flex items-center gap-4 pt-2">
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-navy transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" /> Helpful (0)
                </button>
                </div>
            </div>
            ))}
        </div>
      )}

      {reviews.length > 5 && (
        <div className="pt-6">
            <Button variant="outline" className="w-full md:w-auto h-12 px-10 rounded-full border-navy text-navy font-black hover:bg-navy hover:text-white transition-all text-sm uppercase tracking-widest">
            Load More Reviews
            </Button>
        </div>
      )}
    </div>
  );
}

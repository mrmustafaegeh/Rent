'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface Review {
  id: string;
  user: {
    name: string;
    image?: string;
  };
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  vehicleId: string;
}

export default function ReviewsSection({ vehicleId }: ReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [vehicleId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, rating, comment })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage('Review submitted successfully!');
        setComment('');
        setRating(5);
        fetchReviews(); // Refresh list
        setShowReviewForm(false);
      } else {
        setMessage(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setMessage('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for stars
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-600'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-8 bg-[var(--surface-light)] p-8 rounded-xl border border-[var(--border)] mt-12">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
           <p className="text-[var(--text-secondary)]">
             {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} based on actual rentals
           </p>
        </div>
        
        {isAuthenticated && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)} variant="outline">
            Write a Review
          </Button>
        )}
      </div>

      {/* Write Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--surface-lighter)] p-6 rounded-lg border border-[var(--border)] animate-fadeIn">
          <div className="mb-4">
             <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Rating</label>
             <div className="flex gap-2">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   key={star}
                   type="button"
                   onClick={() => setRating(star)}
                   className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                 >
                   ★
                 </button>
               ))}
             </div>
          </div>
          
          <div className="mb-4">
             <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Comment</label>
             <textarea 
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 text-white focus:ring-[var(--primary)] focus:border-[var(--primary)] min-h-[100px]"
               placeholder="Share your experience..."
               required
             />
          </div>
          
          {message && (
             <p className={`text-sm mb-4 ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
          )}

          <div className="flex justify-end gap-3">
             <Button type="button" variant="ghost" onClick={() => setShowReviewForm(false)}>Cancel</Button>
             <Button type="submit" isLoading={isSubmitting}>Submit Review</Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-[var(--text-muted)] text-center py-8">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">No reviews yet. Be the first to share your experience!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-[var(--border)] last:border-0 pb-6 last:pb-0">
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[var(--surface-lighter)] overflow-hidden">
                       {review.user.image ? (
                          <OptimizedImage 
                            src={review.user.image} 
                            alt={review.user.name} 
                            fill
                            className="object-cover w-full h-full"
                            sizes="40px"
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--primary)] font-bold">
                            {review.user.name ? review.user.name.charAt(0) : 'U'}
                          </div>
                       )}
                     </div>
                     <div>
                        <h4 className="font-bold text-white">{review.user.name}</h4>
                        <p className="text-xs text-[var(--text-muted)]">{new Date(review.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex text-yellow-500">
                    {renderStars(review.rating)}
                  </div>
               </div>
               <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                 {review.comment}
               </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

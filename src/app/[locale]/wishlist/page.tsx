'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VehicleCard from '@/components/VehicleCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (response.ok) {
        setWishlist(data.data);
      } else {
        if (response.status === 401) {
          router.push('/auth/login?redirect=/wishlist');
        }
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <Header />
        <main className="flex-1 pt-24 pb-12 px-4">
          <div className="container mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-[var(--surface-light)] rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-96 bg-[var(--surface-light)] rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="container mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Wishlist</h1>
              <p className="text-[var(--text-secondary)] mt-1">
                {wishlist?.vehicles?.length || 0} vehicle{wishlist?.vehicles?.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>

          {/* Vehicles Grid */}
          {wishlist?.vehicles && wishlist.vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.vehicles.map((vehicle: any) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[var(--surface-light)] rounded-xl border border-[var(--border)]">
              <Heart className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Your wishlist is empty</h3>
              <p className="text-[var(--text-muted)] mb-6">
                Start adding vehicles you love to your wishlist
              </p>
              <button
                onClick={() => router.push('/fleet')}
                className="px-6 py-3 bg-[var(--primary)] text-black font-semibold rounded-lg hover:bg-[var(--primary)]/90 transition-colors"
              >
                Browse Fleet
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

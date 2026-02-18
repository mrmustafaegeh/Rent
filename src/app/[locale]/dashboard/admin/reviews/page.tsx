import prisma from '@/lib/prisma';
import ReviewsList from '@/components/dashboard/ReviewsList';
import { MessageSquare, Star, CheckCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AdminReviewsPage() {
    const t = await getTranslations('Reviews');
    
    const reviews = await prisma.review.findMany({
        where: { isApproved: false },
        include: {
            user: true,
            vehicle: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    const approvedCount = await prisma.review.count({ where: { isApproved: true } });
    const pendingCount = reviews.length;

    return (
        <div className="space-y-12 pb-20 w-full max-w-[1400px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-amber-50 rounded-full w-fit border border-amber-100">
                        <MessageSquare className="w-3 h-3" />
                        {t('admin.badge')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        {t('admin.title')} <span className="text-electric">{t('admin.subtitle')}</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {t('admin.description')}
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('admin.pending')}</p>
                            <p className="text-lg font-black text-navy">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{t('admin.approved')}</p>
                            <p className="text-lg font-black text-navy">{approvedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewsList initialReviews={reviews} />
        </div>
    );
}

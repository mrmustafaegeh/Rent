import { getVehicles } from '@/services/vehicleService';
import ApprovalsList from '@/components/dashboard/ApprovalsList';
import { ShieldCheck, Activity } from 'lucide-react';

export default async function ApprovalsPage() {
    const { vehicles } = await getVehicles({ 
        type: 'sale', 
        status: 'pending',
        limit: 100 
    });

    return (
        <div className="space-y-12 pb-20 w-full max-w-[1400px] mx-auto animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-amber-50 rounded-full w-fit border border-amber-100">
                        <Activity className="w-3 h-3" />
                        Awaiting Verification
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        Listing <span className="text-electric">Approvals</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Perform quality assurance and authorize high-value vehicle assets for the marketplace.
                    </p>
                </div>

                <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-electric/5 text-electric flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Queue Status</p>
                        <p className="text-lg font-black text-navy">{vehicles.length} Units Pending</p>
                    </div>
                </div>
            </div>

            <ApprovalsList initialVehicles={vehicles} />

            {/* Strategy Footer */}
             {vehicles.length > 0 && (
                <div className="bg-navy rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl shadow-navy/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-electric/20 transition-all duration-1000"></div>
                    <div className="relative z-10">
                        <h4 className="text-3xl font-black mb-3 tracking-tight">Curation <span className="text-gold">Philosophy</span></h4>
                        <p className="text-white/60 text-sm font-medium max-w-xl leading-relaxed">
                            Every listing on RentalX must meet our premium standards. Ensure images are high-resolution, specifications are accurate, and price valuations align with market benchmarks.
                        </p>
                    </div>
                    <div className="relative z-10 flex gap-4 shrink-0">
                         <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                            <ShieldCheck className="w-8 h-8 text-gold" />
                         </div>
                    </div>
                </div>
             )}
        </div>
    );
}

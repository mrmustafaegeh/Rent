'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
    CheckCircle, 
    XCircle, 
    User, 
    Mail, 
    Phone, 
    Building2,
    Calendar,
    MapPin,
    ArrowUpRight,
    Briefcase,
    ShieldCheck,
    FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function PartnerApprovalsPage() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/companies?status=pending');
            const data = await res.json();
            setCompanies(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch pending companies", err);
            toast.error("Failed to load requests");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproval = async (id: string, approve: boolean) => {
        if (!approve && !confirm('Are you sure you want to reject this application?')) return;
        
        setActionLoading(id);
        try {
            if (approve) {
                const res = await fetch(`/api/companies/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isActive: true })
                });
                if (res.ok) {
                    setCompanies(companies.filter(c => c.id !== id));
                    toast.success("Partner Approved Successfully");
                }
            } else {
                // Rejection: Could delete or set a 'rejected' status if available
                const res = await fetch(`/api/companies/${id}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setCompanies(companies.filter(c => c.id !== id));
                    toast.success("Application Rejected");
                }
            }
        } catch (e) {
            console.error("Action failed", e);
            toast.error("Process failed");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-10 pb-20 w-full max-w-[1400px] mx-auto animate-in fade-in duration-700">
             {/* Premium Header */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-rose-50 rounded-full w-fit border border-rose-100">
                        <ShieldCheck className="w-3 h-3" />
                        Verification Pipeline
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        Partner <span className="text-electric">Approvals</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Onboard elite fleet partners and verify business credentials.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center font-black">
                        {companies.length}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Awaiting</p>
                        <p className="text-sm font-black text-navy uppercase tracking-tighter">Review</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[40vh] items-center justify-center bg-white rounded-[3rem] border border-gray-100">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                        <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Scanning applications</p>
                    </div>
                </div>
            ) : companies.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                     <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100/50">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-navy mb-3">All clear!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-medium">
                        Your verification queue is empty. New partner requests will appear here for security screening.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all p-8 flex flex-col md:flex-row gap-10 relative overflow-hidden">
                            {/* Accent Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-navy/[0.02] rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            
                            {/* Section 1: Business Identity */}
                            <div className="flex-1 space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-navy to-electric text-gold flex items-center justify-center font-black text-3xl shadow-xl shadow-navy/20 border border-white/10">
                                            {company.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-navy tracking-tight">{company.name}</h2>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-2.5 py-1 text-[9px] font-black uppercase tracking-wider">
                                                    Manual Verification
                                                </Badge>
                                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    Pending since {new Date(company.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Principal Executive</p>
                                        <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-navy shadow-sm">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-black text-navy truncate">
                                                {company.owner?.firstName} {company.owner?.lastName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Business Email</p>
                                        <a href={`mailto:${company.email}`} className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 hover:bg-white transition-colors group/link">
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover/link:text-electric shadow-sm">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-bold text-navy truncate group-hover/link:text-electric">
                                                {company.email}
                                            </div>
                                        </a>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">HQ Location</p>
                                        <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-gray-400 shadow-sm">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-bold text-navy truncate">
                                                {company.address?.city || 'Unassigned'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {company.description && (
                                    <div className="bg-navy/5 p-6 rounded-3xl border border-navy/5 relative group/desc">
                                        <Briefcase className="absolute top-4 right-4 w-12 h-12 text-navy/[0.02] -rotate-12 transition-transform group-hover/desc:rotate-0" />
                                        <p className="text-xs font-black text-navy/40 uppercase tracking-widest mb-2">Operational Vision</p>
                                        <p className="text-sm text-navy/80 leading-relaxed font-medium">
                                            "{company.description}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Administrative Actions */}
                            <div className="flex flex-col gap-4 md:w-56 justify-center border-l border-gray-50 pl-0 md:pl-10 space-y-2">
                                <div className="bg-emerald-50/30 p-2 rounded-2xl">
                                    <Button 
                                        onClick={() => handleApproval(company.id, true)} 
                                        isLoading={actionLoading === company.id}
                                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-2xl shadow-xl shadow-emerald-500/20 border-none transition-all hover:scale-[1.02] active:scale-98"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-3" /> Authorize
                                    </Button>
                                </div>
                                
                                <button 
                                    onClick={() => handleApproval(company.id, false)}
                                    disabled={!!actionLoading}
                                    className="w-full h-14 rounded-2xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-gray-100 hover:border-red-100"
                                >
                                    <XCircle className="w-5 h-5" /> Dismiss Request
                                </button>

                                <div className="pt-4 flex flex-col gap-2">
                                     <button className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-navy transition-colors">
                                        <FileText className="w-3 h-3" /> Audit Documents
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

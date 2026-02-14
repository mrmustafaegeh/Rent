'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
    CheckCircle, 
    XCircle, 
    User, 
    Link as LinkIcon, 
    Mail, 
    Phone, 
    Building2,
    Calendar,
    MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import OptimizedImage from '@/components/ui/OptimizedImage'; // Reusing for avatar if needed

export default function PartnerApprovalsPage() {
    const { user } = useAuth();
    const [companies, setCompanies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await fetch('/api/companies?status=pending');
                const data = await res.json();
                setCompanies(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch pending companies", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleApproval = async (id: string, approve: boolean) => {
        setActionLoading(id);
        try {
            // If approved, set isActive=true. If rejected, we might delete or flag as rejected. 
            // For now, let's just toggle isActive functionality. 
            // Often "Reject" means delete or set a status field. Assuming basic boolean active for now as per schema.
            
            if (approve) {
                const res = await fetch(`/api/companies/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isActive: true })
                });
                if (res.ok) {
                    setCompanies(companies.filter(c => c._id !== id));
                    alert("Partner Approved Successfully");
                }
            } else {
                // Determine rejection logic. For now, maybe just remove from list or delete?
                // Let's implementing delete for rejection to keep it clean, or update a status if schema had one.
                // Schema has isActive: boolean. 
                // We'll just alert for now as "Reject" might need more business logic (email notification etc)
                alert("Rejection logic pending - usually this would email the user.");
            }
        } catch (e) {
            console.error("Action failed", e);
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-navy"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-12 max-w-7xl mx-auto">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-black text-navy tracking-tight">Partner Requests</h1>
                    <p className="text-gray-500 font-medium">Review and approve new fleet partner applications.</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold">
                    {companies.length} Pending
                </div>
            </div>

            {companies.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-navy mb-2">All Caught Up!</h3>
                    <p className="text-gray-400 font-medium max-w-md">There are no pending partner applications at the moment. Check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {companies.map((company) => (
                        <div key={company._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row gap-8 hover:shadow-lg transition-all animate-in slide-in-from-bottom-4 duration-500">
                            {/* Company Info */}
                            <div className="flex-1 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-navy text-gold flex items-center justify-center font-black text-2xl shadow-lg shadow-navy/20">
                                            {company.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-navy">{company.name}</h2>
                                            <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
                                                <Calendar className="w-4 h-4" />
                                                Applied: {new Date(company.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100 px-3 py-1">
                                        Pending Review
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-gray-50">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person</label>
                                        <div className="flex items-center gap-3 text-navy font-bold">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            {company.owner?.firstName} {company.owner?.lastName}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                        <div className="flex items-center gap-3 text-navy font-medium">
                                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            {company.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                        <div className="flex items-center gap-3 text-navy font-medium">
                                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            {company.phone}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Office Location</label>
                                         <div className="flex items-center gap-3 text-navy font-medium">
                                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            {company.address?.city || 'Not specified'}
                                        </div>
                                    </div>
                                </div>

                                {company.description && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About Company</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                            {company.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 md:w-48 justify-center border-l border-gray-50 pl-0 md:pl-8">
                                <Button 
                                    onClick={() => handleApproval(company._id, true)} 
                                    isLoading={actionLoading === company._id}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-200"
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" /> Approve
                                </Button>
                                <Button 
                                    onClick={() => handleApproval(company._id, false)}
                                    disabled={!!actionLoading}
                                    variant="outline" 
                                    className="w-full border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold h-12 rounded-xl"
                                >
                                    <XCircle className="w-5 h-5 mr-2" /> Reject
                                </Button>
                                <Button variant="ghost" className="w-full text-gray-400 hover:text-navy font-bold text-xs h-10">
                                    View Documents
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

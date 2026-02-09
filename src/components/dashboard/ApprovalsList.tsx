'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, X, Eye, Info, User, Calendar, Settings, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ApprovalsList({ initialVehicles }: { initialVehicles: any[] }) {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setVehicles(initialVehicles);
    }, [initialVehicles]);

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/vehicles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                // Remove from local list
                setVehicles(prev => prev.filter(v => v._id !== id));
                router.refresh(); // Refresh server data
                alert(`Vehicle ${newStatus} successfully!`);
            } else {
                alert('Action failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setActionLoading(null);
        }
    };

    if (vehicles.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">All Caught Up!</h3>
                <p className="text-gray-500">There are no pending vehicle approvals at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-lg transition-all">
                    {/* Image */}
                    <div className="relative w-full sm:w-64 h-56 sm:h-auto bg-gray-100 shrink-0">
                        <Image 
                            src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                            alt={vehicle.model || 'Car'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                            {vehicle.condition || 'Used'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{vehicle.brand}</span>
                                    <h3 className="text-xl font-black text-navy">{vehicle.vehicleModel}</h3>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-navy">€{vehicle.salePrice?.toLocaleString()}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sale Price</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gold" /> {vehicle.year}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-gold" /> {vehicle.mileage?.toLocaleString()} km
                                </div>
                                <div className="flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-gold" /> {vehicle.transmission}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-gold"/></div>
                                    {vehicle.fuelType}
                                </div>
                            </div>

                            {vehicle.owner && (
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold bg-gray-50 p-2 rounded-lg w-fit">
                                    <User className="w-3 h-3" /> User ID: {vehicle.owner.toString().substring(0, 8)}...
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                            <Link href={`/vehicles/${vehicle._id}`} target="_blank" className="flex-1">
                                <Button variant="ghost" className="w-full text-xs font-bold border border-gray-200">
                                    <Eye className="w-3 h-3 mr-2" /> View
                                </Button>
                            </Link>
                            <Button 
                                onClick={() => handleAction(vehicle._id, 'rejected')} 
                                isLoading={actionLoading === vehicle._id}
                                disabled={!!actionLoading}
                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold border border-red-100"
                            >
                                <X className="w-3 h-3 mr-2" /> Reject
                            </Button>
                            <Button 
                                onClick={() => handleAction(vehicle._id, 'approved')}
                                isLoading={actionLoading === vehicle._id}
                                disabled={!!actionLoading}
                                className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 font-bold border border-green-100"
                            >
                                <Check className="w-3 h-3 mr-2" /> Approve
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

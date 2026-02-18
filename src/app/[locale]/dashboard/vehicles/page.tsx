'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useAuth } from '@/context/AuthContext';
import { 
    Plus, 
    Search, 
    Edit2, 
    Calendar, 
    Trash2, 
    Car,
    Fuel,
    Settings,
    MoreHorizontal,
    Power,
    Ban,
    AlertCircle,
    Activity,
    ShieldCheck,
    TrendingUp,
    Euro,
    Layers,
    ChevronRight,
    Zap,
    Wrench,
    ArrowUpRight,
    Box,
    Database,
    Trophy,
    Target
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

interface Vehicle {
  id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  category: string;
  dailyPrice: number;
  pricing?: { daily: number }; // Legacy fallback
  images: { url: string }[];
  available: boolean;
  status: string;
  transmission?: string;
  fuelType?: string;
  type?: 'rent' | 'sale';
  salePrice?: number;
}

export default function AdminVehiclesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const isLoading = authLoading || dataLoading;

  useEffect(() => {
    if (!authLoading && !user) {
      setDataLoading(false);
      return;
    }

    if (user && !authLoading) {
      fetchVehicles();
    }
  }, [user, authLoading, filterType]);

  const fetchVehicles = async () => {
    setDataLoading(true);
    try {
      const userRole = user?.role?.toLowerCase();
      const baseUrl = userRole === 'admin' 
        ? '/api/vehicles?limit=100&type=all' 
        : '/api/vehicles?my=true&limit=100&type=all';
        
      const typeParam = filterType !== 'all' ? `&type=${filterType}` : '';
      const url = `${baseUrl}${typeParam}`;
        
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error("Asset synchronization error");
    } finally {
      setDataLoading(false);
    }
  };

  const toggleAvailability = async (vehicleId: string, currentStatus: boolean) => {
      const toastId = toast.loading(currentStatus ? 'Deactivating lifecycle...' : 'Activating operational status...');
      const oldVehicles = [...vehicles];
      setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, available: !currentStatus } : v));

      try {
          const res = await fetch(`/api/vehicles/${vehicleId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ available: !currentStatus })
          });
          const data = await res.json();
          if (data.error) {
              setVehicles(oldVehicles);
              toast.error("Protocol execution failed", { id: toastId });
          } else {
              toast.success(currentStatus ? "Asset suspended" : "Asset reactivated", { id: toastId });
          }
      } catch(e) {
          setVehicles(oldVehicles);
          toast.error("Network synchronization interrupted", { id: toastId });
      }
  };

  const deleteVehicle = async (id: string) => {
      if (!confirm('Are you sure you want to retire this vehicle from the fleet? This action is IRREVERSIBLE.')) return;
      
      const toastId = toast.loading('Executing asset decommissioning...');
      try {
          const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
          if (res.ok) {
              setVehicles(vehicles.filter(v => v.id !== id));
              toast.success("Asset successfully liquidated", { id: toastId });
          } else {
              toast.error("Liquidation protocol failed", { id: toastId });
          }
      } catch (error) {
          toast.error("Decommissioning interrupted", { id: toastId });
      }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
      const matchesSearch =
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || vehicle.category.toLowerCase() === filterCategory.toLowerCase();

      return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(vehicles.map(v => v.category || 'Other')))];

  // Fleet Stats
  const activeCount = vehicles.filter(v => v.available).length;
  const totalValue = vehicles.reduce((acc, v) => acc + (v.type === 'sale' ? (v.salePrice || 0) : (v.dailyPrice || 0)), 0);

  return (
    <div className="space-y-12 pb-24 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3 px-3 py-1 bg-emerald-50 rounded-full w-fit border border-emerald-100/50">
            <Activity className="w-3 h-3" />
            Operational Readiness
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-black text-navy tracking-tight leading-none">
            Fleet <span className="text-electric">Intelligence</span>
          </h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">
            Strategic lifecycle management for the worlds most exclusive automotive assets.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto">
            <Link href="/dashboard/vehicles/new" className="w-full xl:w-auto">
                <Button className="w-full xl:w-auto bg-navy text-gold hover:bg-gold hover:text-navy h-16 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 flex items-center gap-4 transition-all active:scale-95 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                    ONBOARD ASSET
                </Button>
            </Link>
        </div>
      </div>

      {/* High-Fidelity Intelligence Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Service Status</p>
                  <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-navy">{activeCount}</span>
                      <span className="text-lg font-bold text-gray-300">/ {vehicles.length} Active</span>
                  </div>
              </div>
              <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${(activeCount / vehicles.length) * 100 || 0}%` }}
                  ></div>
              </div>
          </div>
          <div className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Category Spread</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-navy">{categories.length - 1}</span>
                    <span className="text-lg font-bold text-gray-300">Tiers</span>
                  </div>
              </div>
              <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mt-auto flex items-center gap-1.5">
                  <Target className="w-3 h-3" /> Diversified Portfolio
              </p>
          </div>
          <div className="group bg-white p-8 rounded-[3rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Euro className="w-7 h-7" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Portfolio Yield</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-navy whitespace-nowrap">€{(totalValue / (vehicles.length || 1)).toLocaleString()}</span>
                    <span className="text-xs font-bold text-gray-300 uppercase">Avg</span>
                  </div>
              </div>
              <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mt-auto flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Growth Metric Stable
              </p>
          </div>
          <div className="group bg-navy p-8 rounded-[3rem] shadow-2xl shadow-navy/30 text-white flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all duration-1000"></div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7" />
              </div>
              <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-2">Optimization Engine</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">ENABLED</span>
                  </div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-black text-gold uppercase tracking-widest">Protocol v4.2</span>
                  <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-navy/50 backdrop-blur-sm"></div>)}
                  </div>
              </div>
          </div>
      </div>

      {/* Strategic Control Bar */}
      <div className="bg-white/90 backdrop-blur-2xl p-4 rounded-[3rem] border border-gray-100 shadow-[0_15px_45px_rgba(0,0,0,0.04)] flex flex-col xl:flex-row justify-between items-center gap-8 sticky top-4 z-30">
          <div className="flex items-center gap-3 overflow-x-auto w-full xl:w-auto scrollbar-hide py-1">
               <div className="flex bg-gray-50/50 p-1.5 rounded-[1.5rem] border border-gray-100 mr-6">
                  {['all', 'rent', 'sale'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                            filterType === t 
                            ? 'bg-navy text-gold shadow-xl shadow-navy/20 active:scale-95' 
                            : 'text-gray-400 hover:text-navy'
                        }`}
                      >
                        {t}
                      </button>
                  ))}
               </div>

               <div className="h-10 w-px bg-gray-100 mx-2"></div>

               {categories.map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-6 py-3 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                          filterCategory === cat 
                          ? 'bg-electric text-white border-electric shadow-xl shadow-electric/20 active:scale-95' 
                          : 'bg-white text-gray-300 border-transparent hover:border-gray-200 hover:text-navy'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
          
          <div className="relative w-full xl:w-96">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-electric transition-colors">
                  <Search className="w-full h-full" />
              </div>
              <input 
                  placeholder="Query brand, model or manifest ID..." 
                  className="w-full h-14 pl-14 pr-4 rounded-[1.5rem] bg-gray-50/50 border-transparent focus:bg-white focus:border-gray-100 focus:ring-4 focus:ring-navy/5 transition-all text-[11px] font-black uppercase tracking-widest text-navy placeholder:text-gray-300 uppercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      {/* Advanced Manifest Registry */}
      <div className="space-y-8">
        {isLoading ? (
            <div className="flex h-[50vh] items-center justify-center bg-white rounded-[3rem] border border-gray-100 shadow-sm animate-pulse">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-navy/5 border-t-navy rounded-full animate-spin"></div>
                    <p className="text-navy font-black text-[10px] uppercase tracking-[0.3em] opacity-30">Decrypting Registry Manifest</p>
                </div>
            </div>
        ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-gray-100">
                <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-50 rotate-3 group hover:rotate-0 transition-transform duration-700">
                    <Box className="w-12 h-12 text-gray-200" />
                </div>
                <h3 className="text-3xl font-black text-navy mb-4 tracking-tight">Registry Underflow</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium text-sm leading-relaxed">
                    No matching assets detected within the current parameters. Adjust your query or onboard new inventory.
                </p>
                <Button 
                    onClick={() => {setSearchTerm(''); setFilterCategory('all'); setFilterType('all');}}
                    variant="ghost" 
                    className="mt-8 text-[10px] font-black text-electric uppercase tracking-widest hover:bg-electric/5"
                >
                    Clear All Constraints
                </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-8">
                {filteredVehicles.map((vehicle) => (
                    <div 
                        key={vehicle.id} 
                        className={`group bg-white rounded-[3.5rem] border transition-all p-6 pr-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 ${
                            !vehicle.available 
                            ? 'border-red-100/50 bg-gray-50/50 grayscale' 
                            : 'border-gray-100 hover:border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-1'
                        }`}
                    >
                        {/* High-Impact Visual Identification */}
                        <div className="w-full md:w-80 h-60 md:h-56 bg-gray-100 rounded-[2.5rem] overflow-hidden relative shrink-0 border border-gray-50 shadow-inner group/img">
                            <OptimizedImage 
                                src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                                alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                                fill 
                                className={`object-cover transition-all duration-1000 group-hover/img:scale-110 ${!vehicle.available ? 'opacity-40' : ''}`}
                            />
                            {!vehicle.available && (
                                <div className="absolute inset-0 bg-navy/60 backdrop-blur-[4px] flex items-center justify-center flex-col gap-3">
                                    <Ban className="w-10 h-10 text-white" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-heading">LOCKED / OFF-GRID</span>
                                </div>
                            )}
                            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl ${
                                    vehicle.type === 'sale' ? 'bg-gold text-navy' : 'bg-electric text-white'
                                }`}>
                                    {vehicle.type || 'RENTAL'}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-navy text-[9px] font-black uppercase tracking-widest shadow-xl border border-white/50">
                                    {vehicle.category}
                                </span>
                            </div>
                        </div>

                        {/* Operational Manifest Details */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-3xl font-black text-navy tracking-tight group-hover:text-electric transition-colors leading-none">
                                        {vehicle.brand} <span className="font-bold opacity-30 group-hover:opacity-100 transition-opacity">{vehicle.vehicleModel}</span>
                                    </h3>
                                    {vehicle.available && (
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-4 py-2 bg-gray-50 rounded-xl border border-gray-100/50">
                                        <Calendar className="w-3.5 h-3.5 text-gray-300" /> {vehicle.year} Production
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-4 py-2 bg-gray-50 rounded-xl border border-gray-100/50">
                                        <Zap className="w-3.5 h-3.5 text-gray-300" /> {vehicle.transmission || 'Automatic'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-4 py-2 bg-gray-50 rounded-xl border border-gray-100/50">
                                        <Fuel className="w-3.5 h-3.5 text-gray-300" /> {vehicle.fuelType || 'Petrol'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-end">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none">
                                        {vehicle.type === 'sale' ? 'Liquidation Value' : 'Yield Protocol / Day'}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-navy group-hover:text-electric transition-colors tracking-tighter">€{vehicle.type === 'sale' ? (vehicle.salePrice || 0).toLocaleString() : (vehicle.dailyPrice || 0).toLocaleString()}</span>
                                        {vehicle.type !== 'sale' && <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Eur</span>}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] leading-none">Global ID</p>
                                    <p className="text-xs font-black text-navy/40 font-mono tracking-widest leading-none">#{vehicle.id.toString().slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Lifecycle Control Interface */}
                        <div className="flex flex-row md:flex-col gap-4 justify-center md:border-l md:border-gray-50 md:pl-10 md:min-w-[200px] w-full md:w-auto">
                            <button 
                                onClick={() => toggleAvailability(vehicle.id, vehicle.available)}
                                className={`flex-1 md:flex-none h-14 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${
                                    vehicle.available 
                                    ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10' 
                                    : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10'
                                }`}
                            >
                                <Power className="w-4 h-4" /> {vehicle.available ? 'Lock Asset' : 'Unlock Asset'}
                            </button>
                            
                            <div className="grid grid-cols-3 gap-3">
                                <Link href={`/dashboard/vehicles/${vehicle.id}/edit`} className="h-14">
                                    <button className="w-full h-full rounded-2xl bg-gray-50 text-navy hover:bg-navy hover:text-white transition-all flex items-center justify-center group/btn shadow-sm" title="Modify Specs">
                                        <Edit2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </Link>
                                <Link href={`/dashboard/vehicles/${vehicle.id}/schedule`} className="h-14">
                                    <button className="w-full h-full rounded-2xl bg-gray-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center group/btn shadow-sm" title="Calendar Strategy">
                                        <Calendar className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                </Link>
                                <button 
                                    onClick={() => deleteVehicle(vehicle.id)}
                                    className="h-14 rounded-2xl bg-gray-50 text-gray-300 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center group/btn shadow-sm"
                                    title="Decommission Asset"
                                >
                                    <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Strategic Vision Context Area */}
      {!isLoading && filteredVehicles.length > 0 && (
          <div className="bg-navy rounded-[4rem] p-16 text-white flex flex-col xl:flex-row justify-between items-center gap-12 shadow-[0_40px_100px_rgba(0,0,0,0.15)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/[0.02] rounded-full -mr-[20rem] -mt-[20rem] group-hover:bg-white/[0.04] transition-all duration-1000 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-electric/[0.05] rounded-full -ml-[10rem] -mb-[10rem] transition-all duration-1000 blur-2xl"></div>
             
             <div className="relative z-10 space-y-6 max-w-2xl">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center border border-white/10">
                    <Trophy className="w-8 h-8 text-gold" />
                 </div>
                 <h4 className="text-4xl font-black tracking-tight leading-tight">Ecosystem <span className="text-gold">Sovereignty</span></h4>
                 <p className="text-white/40 text-lg font-medium leading-relaxed">
                     Your fleet manifest is the backbone of our operational excellence. 
                     Maintain a state of constant readiness by optimizing yield protocols and ensuring lifecycle transitions are executed with precision. 
                 </p>
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
                 <button className="flex-1 sm:flex-none px-12 py-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Database className="w-4 h-4" /> Export Manifest
                 </button>
                 <Link href="/dashboard/vehicles/new" className="flex-1 sm:flex-none">
                    <button className="w-full px-12 py-6 rounded-2xl bg-gold text-navy text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-gold/20 flex items-center justify-center gap-3">
                        Launch Expansion <ArrowUpRight className="w-4 h-4" />
                    </button>
                 </Link>
             </div>
          </div>
      )}
    </div>
  );
}

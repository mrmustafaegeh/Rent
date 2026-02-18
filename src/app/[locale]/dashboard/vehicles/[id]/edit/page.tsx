'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { 
    ChevronLeft, 
    Save, 
    Car, 
    Info, 
    DollarSign, 
    Image as ImageIcon, 
    Activity, 
    ShieldCheck, 
    Zap, 
    MapPin, 
    Navigation2, 
    Clock, 
    Key,
    Fuel,
    Settings2,
    CheckCircle2
} from 'lucide-react';
import { currencies, CurrencyCode } from '@/lib/currency';
import { toast } from 'react-hot-toast';

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
      brand: '',
      vehicleModel: '',
      year: new Date().getFullYear(),
      category: 'Luxury',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 2,
      priceDaily: '',
      priceWeekly: '',
      priceMonthly: '',
      currency: 'EUR' as CurrencyCode,
      location: '',
      type: 'rent' as 'rent' | 'sale',
      salePrice: '',
      images: [] as string[]
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const v = data;
        setFormData({
            brand: v.brand || '',
            vehicleModel: v.vehicleModel || '',
            year: v.year || new Date().getFullYear(),
            category: v.category || 'Luxury',
            transmission: v.transmission || 'Automatic',
            fuelType: v.fuelType || 'Petrol',
            seats: v.seats || 2,
            priceDaily: v.pricing?.daily || '',
            priceWeekly: v.pricing?.weekly || '',
            priceMonthly: v.pricing?.monthly || '',
            currency: v.currency || 'EUR',
            location: v.location || '',
            type: v.type || 'rent',
            salePrice: v.salePrice || '',
            images: v.images ? v.images.map((img: any) => img.url) : []
        });

      } catch (error) {
        console.error(error);
        toast.error('Asset registry retrieval failed');
        router.push('/dashboard/vehicles');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) fetchVehicle();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      if (e) e.preventDefault();
      setIsSaving(true);
      const toastId = toast.loading('Synchronizing asset modifications...');

      try {
          const payload = {
              brand: formData.brand,
              vehicleModel: formData.vehicleModel,
              year: Number(formData.year),
              category: formData.category,
              transmission: formData.transmission,
              fuelType: formData.fuelType,
              seats: Number(formData.seats),
              pricing: {
                  daily: Number(formData.priceDaily),
                  weekly: formData.priceWeekly ? Number(formData.priceWeekly) : undefined,
                  monthly: formData.priceMonthly ? Number(formData.priceMonthly) : undefined
              },
              currency: formData.currency,
              location: formData.location,
              images: formData.images.map((url, index) => ({
                 url,
                 isPrimary: index === 0 
              })),
              type: formData.type,
              salePrice: formData.type === 'sale' ? Number(formData.salePrice) : undefined,
          };

          const res = await fetch(`/api/vehicles/${params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              toast.success('Asset manifestation finalized', { id: toastId });
              router.push('/dashboard/vehicles');
          } else {
              toast.error('Database commitment failed', { id: toastId });
          }
      } catch (error) {
          console.error(error);
          toast.error('Logistics system error', { id: toastId });
      } finally {
          setIsSaving(false);
      }
  };

  if (isLoading) return (
       <div className="flex h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Decrypting Asset Specification</p>
            </div>
        </div>
  );

  return (
    <div className="space-y-12 pb-24 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
        {/* Persistent Premium Header */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 sticky top-0 z-40 bg-gray-50/80 backdrop-blur-xl py-6 -mx-4 px-4 border-b border-gray-100">
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => router.back()}
                    className="w-14 h-14 rounded-2xl bg-white border border-gray-200 hover:border-navy hover:text-navy transition-all flex items-center justify-center shadow-sm active:scale-95 group"
                >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-1 opacity-40">
                        <Settings2 className="w-3 h-3" />
                         Asset Configuration / {formData.brand}
                    </div>
                    <h1 className="text-4xl font-heading font-black text-navy tracking-tight leading-none">
                        Edit <span className="text-electric">{formData.vehicleModel}</span>
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-4 w-full xl:w-auto">
                <Button 
                    variant="ghost"
                    onClick={() => router.back()}
                    className="hidden xl:flex text-gray-400 font-black text-[11px] uppercase tracking-widest px-8 rounded-2xl border border-transparent hover:border-gray-200 hover:bg-white transition-all h-16"
                >
                    ABORT CHANGES
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    isLoading={isSaving}
                    className="flex-1 xl:flex-none bg-navy text-gold hover:bg-electric hover:text-white gap-3 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 px-10 h-16 rounded-2xl transition-all active:scale-95 border-none"
                >
                    <Save className="w-4 h-4" /> RE manifest ASSET
                </Button>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Core Blueprint & Technical Window */}
            <div className="lg:col-span-2 space-y-12">
                
                {/* Visual Identity Section */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] space-y-10">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-electric/5 flex items-center justify-center text-electric">
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-xl tracking-tight">Core Blueprint</h3>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">Primary asset identification data</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Brand</label>
                             <Input 
                                name="brand" 
                                value={formData.brand} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-14 rounded-2xl text-navy font-bold uppercase tracking-wider px-6"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Model Identifier</label>
                             <Input 
                                name="vehicleModel" 
                                value={formData.vehicleModel} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-14 rounded-2xl text-navy font-bold uppercase tracking-wider px-6"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Production Era</label>
                             <Input 
                                name="year" 
                                type="number" 
                                value={formData.year} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-14 rounded-2xl text-navy font-bold px-6"
                             />
                         </div>
                         
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Intelligence Category</label>
                             <div className="relative">
                                 <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    className="w-full h-14 px-6 bg-gray-50 border border-transparent rounded-2xl text-navy font-black appearance-none focus:outline-none focus:bg-white focus:border-gray-100 transition-all cursor-pointer uppercase text-[10px] tracking-widest"
                                 >
                                     {['Luxury', 'Sports', 'SUV', 'Sedan', 'Economy', 'Van', 'Electric', 'Convertible'].map(cat => (
                                         <option key={cat}>{cat}</option>
                                     ))}
                                 </select>
                                 <ChevronLeft className="w-4 h-4 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                             </div>
                         </div>
                         
                         <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Occupancy Capacity</label>
                             <Input 
                                name="seats" 
                                type="number" 
                                value={formData.seats} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-14 rounded-2xl text-navy font-bold px-6"
                             />
                         </div>
                    </div>
                    
                    <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Static Asset Location</label>
                         <div className="relative">
                             <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                             <Input 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="Terminal / Zone Identifier" 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-14 rounded-2xl text-navy font-bold uppercase tracking-wider pl-14"
                            />
                         </div>
                    </div>
                </div>

                {/* Technical Specification Window */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] space-y-10">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-xl tracking-tight">Performance Matrix</h3>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-0.5">Mechanical and powertrain configuration</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center block">Transmission Interface</label>
                             <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-2xl">
                                 {['Automatic', 'Manual'].map((t) => (
                                     <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData({...formData, transmission: t})}
                                        className={`h-11 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all uppercase ${
                                            formData.transmission === t 
                                            ? 'bg-white text-navy shadow-sm border border-gray-100' 
                                            : 'text-gray-400 hover:text-navy'
                                        }`}
                                     >
                                         {t}
                                     </button>
                                 ))}
                             </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center block">Propulsion Type</label>
                             <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-2xl">
                                 {['Petrol', 'EV', 'Hybrid', 'Diesel'].map((f) => (
                                     <button
                                        key={f}
                                        type="button"
                                        onClick={() => setFormData({...formData, fuelType: f})}
                                        className={`h-11 rounded-xl text-[9px] font-black tracking-[0.2em] transition-all uppercase ${
                                            formData.fuelType === f 
                                            ? 'bg-white text-navy shadow-sm border border-gray-100' 
                                            : 'text-gray-400 hover:text-navy'
                                        }`}
                                     >
                                         {f}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Value & Media Manifest */}
            <div className="space-y-12">
                
                {/* Financial Logistics */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] space-y-10">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-xl tracking-tight">Financial Yield</h3>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="space-y-4">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center block">Manifest Strategy</label>
                             <div className="grid grid-cols-2 gap-3">
                                 {['rent', 'sale'].map((t) => (
                                     <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData({...formData, type: t as 'rent' | 'sale'})}
                                        className={`h-14 rounded-2xl text-[10px] font-black transition-all border uppercase tracking-widest flex items-center justify-center gap-2 ${
                                            formData.type === t 
                                            ? 'bg-navy text-gold border-navy shadow-xl shadow-navy/20 active:scale-95' 
                                            : 'bg-white text-gray-300 border-gray-50 hover:border-gray-200 hover:text-navy'
                                        }`}
                                     >
                                         {t === 'rent' ? <Clock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                         {t}
                                     </button>
                                 ))}
                             </div>
                        </div>

                        {formData.type === 'rent' ? (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Diurnal Yield Rate</label>
                                <div className="flex gap-4">
                                    <div className="relative shrink-0 w-28">
                                        <select 
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="w-full h-16 px-4 bg-gray-50 border border-transparent rounded-2xl text-navy font-black appearance-none focus:outline-none focus:bg-white focus:border-gray-100 transition-all cursor-pointer text-xl text-center"
                                        >
                                            {Object.keys(currencies).map(code => (
                                                <option key={code} value={code}>{code}</option>
                                            ))}
                                        </select>
                                        <ChevronLeft className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                                    </div>
                                    <div className="relative flex-1">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 text-lg font-black">€</div>
                                        <Input 
                                            name="priceDaily" 
                                            type="number" 
                                            value={formData.priceDaily} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-16 rounded-2xl text-3xl font-black text-navy pl-12"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                     <div className="space-y-1.5">
                                         <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Weekly</label>
                                         <Input 
                                            name="priceWeekly" 
                                            type="number" 
                                            value={formData.priceWeekly} 
                                            onChange={handleChange} 
                                            className="bg-gray-50 border-transparent h-12 rounded-xl text-sm font-black text-navy px-4"
                                        />
                                     </div>
                                     <div className="space-y-1.5">
                                         <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1">Monthly</label>
                                         <Input 
                                            name="priceMonthly" 
                                            type="number" 
                                            value={formData.priceMonthly} 
                                            onChange={handleChange} 
                                            className="bg-gray-50 border-transparent h-12 rounded-xl text-sm font-black text-navy px-4"
                                        />
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Liquidation Valuation</label>
                                <div className="flex gap-4">
                                     <div className="relative shrink-0 w-28">
                                        <select 
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="w-full h-16 px-4 bg-gray-50 border border-transparent rounded-2xl text-navy font-black appearance-none focus:outline-none focus:bg-white focus:border-gray-100 transition-all cursor-pointer text-xl text-center"
                                        >
                                            {Object.keys(currencies).map(code => (
                                                <option key={code} value={code}>{code}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <Input 
                                        name="salePrice" 
                                        type="number" 
                                        value={formData.salePrice} 
                                        onChange={handleChange} 
                                        required 
                                        className="flex-1 bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all h-16 rounded-2xl text-3xl font-black text-navy px-8"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Media Manifest */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] space-y-10">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-50">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-xl tracking-tight">Media Manifest</h3>
                        </div>
                    </div>
                    
                    <div className="premium-dropzone">
                        <ImageUpload 
                           value={formData.images} 
                           onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
                           multiple 
                        />
                    </div>
                </div>

                {/* Integration Status Overlay */}
                <div className="bg-navy rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[64px] group-hover:bg-white/10 transition-all duration-1000"></div>
                    <div className="relative z-10 flex flex-col gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                             <CheckCircle2 className="w-6 h-6 text-gold" />
                         </div>
                         <div>
                             <h4 className="font-black text-lg mb-2">Manifest Verification</h4>
                             <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                                 Asset modifications are cross-referenced with fleet protocols. Ensure all financial data is accurate to maintain platform-wide integrity.
                             </p>
                         </div>
                         <button 
                            type="submit"
                            disabled={isSaving}
                            className="w-full h-14 bg-white text-navy font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold transition-all active:scale-95 disabled:opacity-50"
                        >
                            COMMIT MODIFICATIONS
                         </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
  );
}

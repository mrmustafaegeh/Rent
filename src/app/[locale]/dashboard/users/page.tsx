'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';
import { 
    Search, 
    User as UserIcon, 
    Shield, 
    Mail, 
    Phone, 
    CheckCircle,
    XCircle,
    BadgeCheck,
    Activity,
    Users as UsersIcon,
    Zap,
    Briefcase,
    ShieldCheck,
    ChevronRight,
    SearchX,
    Clock
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.success ? data.data : []);
      } else {
        toast.error("Security sync failed");
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error("Network protocol error");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'Deactivating' : 'Activating';
    const toastId = toast.loading(`${action} security credentials...`);
    
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
        toast.success(`User status updated`, { id: toastId });
      } else {
        toast.error("Authorization update failed", { id: toastId });
      }
    } catch (error) {
      toast.error("System override failed", { id: toastId });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (u.firstName?.toLowerCase() || '').includes(searchLower) || 
        (u.lastName?.toLowerCase() || '').includes(searchLower) ||
        (u.email?.toLowerCase() || '').includes(searchLower);
      
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const roles = ['all', 'CUSTOMER', 'ADMIN', 'PARTNER', 'STAFF'];

  // Summary stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    partners: users.filter(u => u.role === 'PARTNER').length,
    active: users.filter(u => u.isActive).length
  };

  if (loading && users.length === 0) {
      return (
          <div className="flex h-[70vh] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                  <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Decrypting User Registry</p>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-10 pb-20 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div>
             <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-gray-100 rounded-full w-fit border border-gray-200">
                <ShieldCheck className="w-3 h-3" />
                Administrative Oversight
             </div>
            <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                User <span className="text-electric">Intelligence</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
                Monitor platform access, role delegations, and security status.
            </p>
        </div>
        
        {/* Statistics Strip */}
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            {[
                { label: 'Total Base', value: stats.total, icon: UsersIcon, color: 'text-navy' },
                { label: 'Privileged', value: stats.admins, icon: Shield, color: 'text-purple-600' },
                { label: 'Entities', value: stats.partners, icon: Briefcase, color: 'text-blue-600' },
                { label: 'Operational', value: stats.active, icon: CheckCircle, color: 'text-emerald-600' },
            ].map((s, i) => (
                <div key={i} className="flex-1 min-w-[140px] bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <s.icon className={`w-4 h-4 ${s.color} opacity-40`} />
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{s.label}</span>
                    </div>
                    <div className="text-xl font-black text-navy leading-none">{s.value}</div>
                </div>
            ))}
        </div>
      </div>

      {/* Advanced Control Bar */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] flex flex-col xl:flex-row justify-between items-center gap-6 sticky top-6 z-30">
          <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto no-scrollbar py-1">
              {roles.map((role) => (
                  <button
                      key={role}
                      onClick={() => { setFilterRole(role); setCurrentPage(1); }}
                      className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap uppercase border ${
                          filterRole === role 
                          ? 'bg-navy text-gold border-navy shadow-xl shadow-navy/20 active:scale-95' 
                          : 'bg-white text-gray-400 border-gray-50 hover:border-gray-200 hover:text-navy'
                      }`}
                  >
                      {role.replace('_', ' ')}
                  </button>
              ))}
          </div>
          
          <div className="relative w-full xl:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              <Input 
                  placeholder="Reference identifier or metadata..." 
                  className="pl-14 h-14 bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 transition-all rounded-2xl text-xs font-bold text-navy uppercase tracking-wider placeholder:text-gray-300"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
          </div>
      </div>

      {/* Data Registry */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[600px]">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/30 border-b border-gray-50">
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Entity Identity</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">Interface & Channel</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role Allocation</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Logistics</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {paginatedUsers.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-40 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-50">
                                <SearchX className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="font-black text-navy text-2xl mb-3 tracking-tight leading-none">Identity Not Located</h3>
                            <p className="text-gray-400 font-medium max-w-sm mx-auto">Adjust your search parameters to locate specific entity records within the base.</p>
                        </td>
                    </tr>
                ) : (
                    paginatedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-all group duration-300">
                        <td className="p-8">
                            <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner transition-all duration-500 group-hover:scale-110
                                    ${u.role === 'ADMIN' ? 'bg-navy text-gold shadow-navy/10' : 'bg-gray-100 text-gray-400'}`}>
                                    {(u.firstName?.[0] || 'G')}{(u.lastName?.[0] || '')}
                                </div>
                                <div>
                                    <div className="font-black text-navy text-base tracking-tight leading-none mb-1.5">{u.firstName} {u.lastName}</div>
                                    <div className="flex items-center gap-2">
                                         <Clock className="w-3 h-3 text-gray-200" />
                                         <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Inbound: {new Date(u.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-8 hidden md:table-cell">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500">
                                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <span>{u.email}</span>
                                </div>
                                {u.phone && (
                                    <div className="flex items-center gap-2.5 text-[11px] font-bold text-gray-500">
                                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Phone className="w-3.5 h-3.5" />
                                        </div>
                                        <span>{u.phone}</span>
                                    </div>
                                )}
                            </div>
                        </td>
                        <td className="p-8">
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${
                                u.role === 'ADMIN'
                                ? 'bg-purple-50 text-purple-600 border-purple-100'
                                : u.role === 'PARTNER'
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : 'bg-gray-50 text-gray-500 border-gray-100'
                            }`}>
                                {u.role === 'ADMIN' && <Shield className="w-3 h-3 mr-2" />}
                                {u.role === 'PARTNER' && <Briefcase className="w-3 h-3 mr-2" />}
                                {u.role || 'GUEST'}
                            </span>
                        </td>
                        <td className="p-8">
                             <div className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest ${u.isActive ? 'text-emerald-500' : 'text-gray-300'}`}>
                                <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-gray-200'}`}></div>
                                {u.isActive ? 'Operational' : 'Restricted'}
                            </div>
                        </td>
                        <td className="p-8 text-right">
                            <button 
                                onClick={() => toggleUserStatus(u.id, u.isActive)}
                                className={`h-11 px-5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95 flex items-center gap-2 ml-auto ${
                                    u.isActive 
                                    ? 'bg-gray-50 text-red-400 border border-transparent hover:border-red-100 hover:bg-red-50 hover:text-red-500' 
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                                }`}
                            >
                                {u.isActive ? <XCircle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                                {u.isActive ? 'DEACTIVATE' : 'AUTHORIZE'}
                            </button>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
        
        {/* Registry Pagination */}
        <div className="bg-gray-50/30 p-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Manifest: <span className="text-navy">{paginatedUsers.length}</span> / <span className="text-navy">{filteredUsers.length}</span> Active Entities
             </div>
             <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      </div>

      {/* Intelligence Context */}
      <div className="bg-navy rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-12 group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-1000"></div>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                         <ShieldCheck className="w-10 h-10 text-gold" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black mb-3 tracking-tight">Security <span className="text-gold">Sovereignty</span></h4>
                        <p className="text-white/60 text-sm font-medium max-w-xl leading-relaxed">
                            Maintain the integrity of the ecosystem by auditing user roles periodically. Administrative deactivation should only occur following formal protocol breaches or account retirement.
                        </p>
                    </div>
                </div>
                <button className="h-14 px-10 rounded-2xl bg-white text-navy text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] duration-500 ease-out will-change-transform active:scale-95 transition-all shadow-xl shadow-white/5 relative z-10 shrink-0">
                    Security Logs
                </button>
            </div>
    </div>
  );
}

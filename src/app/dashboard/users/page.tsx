'use client';

import React, { useEffect, useState } from 'react';
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
    BadgeCheck
} from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface User {
  _id: string;
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
  const itemsPerPage = 8;

  useEffect(() => {
    // Only fetch if admin
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.success ? data.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const filteredUsers = users.filter(u => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (u.firstName?.toLowerCase() || '').includes(searchLower) || 
        (u.lastName?.toLowerCase() || '').includes(searchLower) ||
        (u.email?.toLowerCase() || '').includes(searchLower);
      
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      return matchesSearch && matchesRole;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const roles = ['all', 'customer', 'admin', 'company_owner'];

  return (
    <div className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-navy tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-1">Manage access and permissions for all registered users.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
            <span className="text-xl font-black text-navy">{users.length}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-20 layout-pixel-perfect">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
              {roles.map((role) => (
                  <button
                      key={role}
                      onClick={() => { setFilterRole(role); setCurrentPage(1); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
                          filterRole === role 
                          ? 'bg-navy text-white shadow-md transform scale-105' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-navy'
                      }`}
                  >
                      {role.replace('_', ' ')}
                  </button>
              ))}
          </div>
          
          <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                  placeholder="Search users..." 
                  className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all rounded-xl text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
          </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">User Profile</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Contact Info</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr>
                        <td colSpan={5} className="p-24 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading users...</p>
                        </td>
                    </tr>
                ) : paginatedUsers.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                <UserIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-2">No users found</h3>
                            <p className="text-gray-400">Try adjusting your filters.</p>
                        </td>
                    </tr>
                ) : (
                    paginatedUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-blue-50/20 transition-all group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-inner 
                                    ${u.role === 'admin' ? 'bg-navy text-gold' : 'bg-gray-100 text-gray-500'}`}>
                                    {(u.firstName?.[0] || '')}{(u.lastName?.[0] || '')}
                                </div>
                                <div>
                                    <div className="font-bold text-navy text-sm">{u.firstName} {u.lastName}</div>
                                    <div className="text-xs text-gray-400 mt-0.5 font-medium">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-6 hidden md:table-cell">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{u.email}</span>
                                </div>
                                {u.phone && (
                                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{u.phone}</span>
                                    </div>
                                )}
                            </div>
                        </td>
                        <td className="p-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${
                                u.role === 'admin' || u.role === 'super_admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                : u.role === 'company_owner'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                                {u.role === 'admin' && <Shield className="w-3 h-3 mr-1.5" />}
                                {u.role === 'company_owner' && <BadgeCheck className="w-3 h-3 mr-1.5" />}
                                {u.role.replace('_', ' ')}
                            </span>
                        </td>
                        <td className="p-6">
                             <div className={`flex items-center gap-2 text-xs font-bold ${u.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                                {u.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {u.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </td>
                        <td className="p-6 text-right">
                            <Button 
                                size="sm" 
                                variant={u.isActive ? 'outline' : 'default'}
                                className={`h-8 px-3 text-xs font-bold rounded-xl transition-all ${
                                    u.isActive 
                                    ? 'border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300' 
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 shadow-lg'
                                }`}
                                onClick={() => toggleUserStatus(u._id, u.isActive)}
                            >
                                {u.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="text-xs font-bold text-gray-500">
                Showing <span className="text-navy">{paginatedUsers.length}</span> of <span className="text-navy">{filteredUsers.length}</span> users
             </div>
             <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      </div>
    </div>
  );
}

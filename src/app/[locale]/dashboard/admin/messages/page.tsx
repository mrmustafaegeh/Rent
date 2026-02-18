'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { 
    Mail, 
    Phone, 
    Calendar, 
    Search, 
    Trash2, 
    CheckCircle, 
    Eye, 
    MessageSquare,
    Inbox,
    Clock,
    User
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error('Failed to load messages');
      }
    } catch (error) {
      toast.error('Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
        toast.success('Message marked as read');
      }
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        toast.success('Message deleted');
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(search.toLowerCase()) || 
      msg.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && msg.status === 'unread') ||
      (filter === 'read' && msg.status === 'read');

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="space-y-10 pb-20 w-full max-w-[1400px] mx-auto animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-electric uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-electric/5 rounded-full w-fit border border-electric/10">
            <Inbox className="w-3 h-3" />
            Communication Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
            Client <span className="text-electric">Inquiries</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage incoming messages and customer support requests.
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm sm:w-auto w-full">
            <button
                onClick={() => setFilter('all')}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    filter === 'all'
                        ? 'bg-navy text-gold shadow-lg shadow-navy/20'
                        : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                }`}
            >
                All
            </button>
            <button
                onClick={() => setFilter('unread')}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    filter === 'unread'
                        ? 'bg-navy text-gold shadow-lg shadow-navy/20'
                        : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                }`}
            >
                Unread {unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-gold text-navy flex items-center justify-center text-[10px]">{unreadCount}</span>}
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left: Quick Stats & Search (1 col) */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Quick Search</p>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                        type="text" 
                        placeholder="Search name or email..." 
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-navy p-6 rounded-[2rem] shadow-xl shadow-navy/20 text-white space-y-6">
                <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Response Target</p>
                    <div className="text-2xl font-black">24 Hours</div>
                </div>
                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white/60">Success Rate</span>
                        <span className="text-xs font-black text-gold">98%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold w-[98%] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Messages List (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
             <div className="flex h-[40vh] items-center justify-center bg-white rounded-[3rem] border border-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                    <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Decrypting correspondences</p>
                </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                    <Inbox className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-navy mb-3">No messages yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto font-medium">
                    When clients contact you through the portal, their inquiries will appear here for review.
                </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
                {filteredMessages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`group bg-white rounded-[2.5rem] border transition-all p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 ${
                            msg.status === 'unread' 
                            ? 'border-electric shadow-[0_20px_50px_rgba(59,130,246,0.1)]' 
                            : 'border-gray-100 hover:border-gray-200 shadow-sm'
                        }`}
                    >
                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                            msg.status === 'unread' ? 'bg-electric' : 'bg-gray-100'
                        }`}></div>

                        <div className="flex-1 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${
                                        msg.status === 'unread' 
                                        ? 'bg-electric text-white' 
                                        : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {msg.name?.[0] || '?' }
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black text-navy">{msg.name}</h3>
                                            {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-electric animate-pulse"></div>}
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-1">
                                            <a href={`mailto:${msg.email}`} className="text-xs font-bold text-gray-400 hover:text-electric transition-colors flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5" /> {msg.email}
                                            </a>
                                            {msg.phone && (
                                                <a href={`tel:${msg.phone}`} className="text-xs font-bold text-gray-400 hover:text-electric transition-colors flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5" /> {msg.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-400 bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100/50 h-fit self-start">
                                    <Clock className="w-3.5 h-3.5" />
                                    {format(new Date(msg.createdAt), 'MMM d, yyyy • HH:mm')}
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50 text-gray-700 text-sm leading-relaxed relative group/text">
                                <MessageSquare className="absolute -top-3 -right-3 w-10 h-10 text-gray-100 -rotate-12 transition-transform group-hover/text:rotate-0" />
                                <div className="relative z-10 whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-3 justify-center">
                            {msg.status === 'unread' && (
                                <button 
                                    onClick={() => markAsRead(msg.id)}
                                    className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                    title="Mark as Read"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                onClick={() => deleteMessage(msg.id)}
                                className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                title="Delete Inquire"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

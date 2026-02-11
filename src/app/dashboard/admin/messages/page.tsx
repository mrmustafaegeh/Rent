'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Message {
  _id: string;
  firstName: string;
  lastName: string;
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
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

  const filteredMessages = messages.filter(msg => 
    msg.firstName.toLowerCase().includes(search.toLowerCase()) || 
    msg.lastName.toLowerCase().includes(search.toLowerCase()) ||
    msg.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-navy">Messages</h1>
          <p className="text-gray-500 mt-1">View and manage inquiries from the contact form.</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search messages..." 
             className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/10 text-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading messages...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
           <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-500 font-medium">No messages found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map((msg) => (
            <div key={msg._id} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-bold shrink-0">
                      {msg.firstName[0]}{msg.lastName[0]}
                   </div>
                   <div>
                      <h3 className="font-bold text-navy text-lg">{msg.firstName} {msg.lastName}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {msg.email}</span>
                          {msg.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {msg.phone}</span>}
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 shrink-0">
                   <Calendar className="w-3.5 h-3.5" />
                   {format(new Date(msg.createdAt), 'PPP p')}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

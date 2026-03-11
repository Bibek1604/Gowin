import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, User, Search, UserCheck } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch subscribers');
    } else {
      setSubscribers(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this subscriber?')) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) toast.error('Delete failed');
      else {
        toast.success('Subscriber removed');
        fetchSubscribers();
      }
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-12 font-sans min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] tracking-tight">Newsletter Subscribers</h1>
            <p className="text-gray-500 text-lg mt-1">Manage your mailing list for promotions</p>
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 px-6 py-4 shadow-[0_4px_25px_rgb(0,0,0,0.02)]">
            <span className="text-3xl font-bold text-[#0F4C5C]">{subscribers.length}</span>
            <span className="text-gray-400 text-sm font-medium ml-2 uppercase tracking-widest">Active</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by email..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
             <Mail className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             <p className="text-gray-400 font-medium">No active subscribers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 hover:shadow-lg transition-all duration-300 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2A9D8F]/10 flex items-center justify-center text-[#2A9D8F]">
                     <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0F4C5C] leading-none mb-2">{subscriber.email}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <Calendar className="w-3 h-3" />
                       Subscribed {new Date(subscriber.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleDelete(subscriber.id)}
                     className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribers;

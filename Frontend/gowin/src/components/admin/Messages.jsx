import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, User, MessageSquare, MapPin, Search } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch messages');
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) toast.error('Delete failed');
      else {
        toast.success('Message deleted');
        fetchMessages();
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-12 font-sans min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] tracking-tight">Contact Messages</h1>
            <p className="text-gray-500 text-lg mt-1">Direct inquiries from your travel site</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 px-6 py-3 shadow-sm">
            <span className="text-2xl font-bold text-[#0F4C5C]">{messages.length}</span>
            <span className="text-gray-400 text-sm font-medium ml-2">Total Inquiries</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email or message..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-[#FF7F50] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse border border-gray-100" />)}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
             <MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             <p className="text-gray-400">No messages found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#0F4C5C]/5 flex items-center justify-center text-[#0F4C5C]">
                         <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F4C5C] text-lg leading-tight">{msg.name}</h3>
                        <p className="text-sm text-gray-400">{msg.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mb-6">
                       <div className="flex items-center gap-2 text-xs font-bold text-[#FF7F50] bg-[#FF7F50]/10 px-3 py-1.5 rounded-xl">
                          <MapPin className="w-3.5 h-3.5" />
                          {msg.destination || 'General Inquiry'}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(msg.created_at).toLocaleDateString()}
                       </div>
                    </div>

                    <p className="text-gray-500 leading-relaxed text-sm bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                       {msg.message}
                    </p>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2">
                    <a href={`mailto:${msg.email}`} className="p-3 rounded-xl bg-[#FF7F50]/10 text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest px-6 md:px-3">
                       <Mail className="w-4 h-4" /> <span className="md:hidden">Reply</span>
                    </a>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest px-6 md:px-3"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="md:hidden">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

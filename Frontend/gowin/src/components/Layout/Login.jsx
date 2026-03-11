import React, { useState } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import gowinLogo from '../../assets/gowin.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Access Granted!');
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } else {
      toast.error('Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB] p-6 font-sans relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F4C5C]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF7F50]/5 rounded-full -ml-32 -mb-32 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-[#0F4C5C]/5 overflow-hidden mx-auto mb-6">
             <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0F4C5C] tracking-tight">
            Gowin<span className="text-[#FF7F50]">.</span>
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Administrative Portal</p>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100">
          <div className="flex items-center gap-3 mb-8 bg-[#0F4C5C]/5 p-4 rounded-2xl border border-[#0F4C5C]/10">
             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0F4C5C]">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-[#0F4C5C]">Secure Access</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Restricted to Staff</p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-widest pl-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/10 focus:bg-white transition-all font-medium text-[#0F4C5C] placeholder-gray-300"
                placeholder="admin@travels.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-widest pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/10 focus:bg-white transition-all font-medium text-[#0F4C5C] placeholder-••••••••"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#0F4C5C] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0a3845] transition-all shadow-xl shadow-[#0F4C5C]/20 mt-4 active:scale-95 disabled:opacity-75`}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-gray-400 text-xs font-medium uppercase tracking-widest bg-white/50 py-3 px-6 rounded-full w-fit mx-auto border border-white">
           System Monitoring Active
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

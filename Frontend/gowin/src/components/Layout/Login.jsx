import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminStore } from '../Store/AdminStore';
import { Field, Input } from '../ui/FormField';
import { useSEO } from '../../lib/seo';
import gowinLogo from '../../assets/gowin.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, isAdmin, isLoading } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/admin';

  useSEO({ title: 'Staff sign in', path: '/login', noindex: true });
  useEffect(() => { if (!isLoading && isAdmin) navigate(redirectTo, { replace: true }); }, [isAdmin, isLoading, navigate, redirectTo]);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    const res = await login(email, password);
    setBusy(false);
    if (res.success) navigate(redirectTo, { replace: true });
    else setError(res.error || 'Sign in failed.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-[#1E3A8A]/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-[#10B981]/5 rounded-full blur-3xl" aria-hidden="true" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <img src={gowinLogo} alt="GoWin Travels" width="72" height="72" className="w-18 h-18 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
          <h1 className="text-2xl font-black text-[#1E3A8A]">GoWin Travels</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Website administration</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(15,23,42,0.06)] border border-gray-100 p-8 space-y-5">
          <div className="flex items-center gap-3 bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-2xl p-3">
            <span className="w-9 h-9 rounded-xl bg-white shadow-sm text-[#1E3A8A] flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></span>
            <p className="text-xs text-gray-500">Staff accounts only. Access is limited to approved email addresses.</p>
          </div>
          <Field label="Email" htmlFor="login-email"><Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="you@gowintravels.com" /></Field>
          <Field label="Password" htmlFor="login-password"><Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required placeholder="••••••••" /></Field>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">{error}</p>}
          <button type="submit" disabled={busy} className="btn-secondary w-full justify-center !py-3.5 disabled:opacity-60">{busy ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}</button>
        </form>
        <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1E3A8A]"><ArrowLeft className="w-3.5 h-3.5" /> Back to website</Link>
      </motion.div>
    </div>
  );
};

export default Login;

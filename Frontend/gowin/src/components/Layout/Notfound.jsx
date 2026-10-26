import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { useSEO } from '../../lib/seo';

const NotFound = () => {
  useSEO({ title: 'Page not found', noindex: true });
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 pt-20">
      <div className="max-w-md text-center">
        <span className="w-20 h-20 rounded-3xl bg-white shadow-lg flex items-center justify-center text-[#1E3A8A] mx-auto mb-6"><Compass className="w-9 h-9" /></span>
        <p className="text-6xl font-black text-[#1E3A8A] tracking-tight">4<span className="text-[#10B981]">0</span>4</p>
        <h1 className="text-2xl font-bold text-[#0F172A] mt-3 mb-2">That page doesn't exist</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">The link may be out of date or the page may have moved. Head back home or browse our destinations.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary justify-center">Home <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/destinations" className="btn-secondary justify-center">Destinations</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

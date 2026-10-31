import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const onPackage = useLocation().pathname.startsWith('/places/'); // sticky enquiry bar below on small screens
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      {visible && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className={`animate-popIn fixed ${onPackage ? 'bottom-24 lg:bottom-8' : 'bottom-5 sm:bottom-8'} right-5 sm:right-8 z-[90] w-11 h-11 rounded-xl bg-[#1E3A8A] text-white shadow-xl shadow-[#1E3A8A]/30 hover:bg-[#172554] flex items-center justify-center`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;

import React from 'react';

export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton rounded-2xl ${className}`} aria-hidden="true" />
);

export const CardSkeleton = ({ count = 4, className = 'h-[380px]' }) => (
  <>
    {Array.from({ length: count }).map((_, i) => <Skeleton key={i} className={`w-full ${className}`} />)}
  </>
);

/** Full-page loading state used while the admin session is being restored. */
export const PageSpinner = ({ label = 'Loading…', full = false }) => (
  <div className={`${full ? 'min-h-screen' : 'min-h-[60vh]'} flex flex-col items-center justify-center gap-3 text-gray-500`} role="status">
    <div className="w-10 h-10 rounded-full border-[3px] border-[#1E3A8A]/15 border-t-[#1E3A8A] animate-spin" />
    <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
  </div>
);

export default Skeleton;

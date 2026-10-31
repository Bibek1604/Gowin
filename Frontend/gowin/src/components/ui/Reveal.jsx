import React, { useEffect, useRef, useState } from 'react';

/**
 * Fade-and-rise once when the element scrolls into view (replaces framer-motion's
 * whileInView, ~39 kB gzipped, for the same effect). Content is visible without
 * JavaScript support for IntersectionObserver, and reduced-motion users get no
 * movement (see .reveal in index.css).
 */
const Reveal = ({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setShown(true); return undefined; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setShown(true); io.disconnect(); }
    }, { rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-shown' : ''} ${className}`} style={delay ? { ...style, transitionDelay: `${delay}s` } : style} {...rest}>
      {children}
    </Tag>
  );
};

export default Reveal;

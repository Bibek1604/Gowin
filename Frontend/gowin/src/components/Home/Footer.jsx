import React, { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Branding */}
        <div className="space-y-4">
          <img src="/logo.svg" alt="Company Logo" className="h-10 w-auto" />
          <p className="text-sm text-gray-300">Empowering businesses with innovative solutions since 2020.</p>
          <p className="text-xs text-gray-500">&copy; 2025 Company Name. All rights reserved.</p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            {['About', 'Careers', 'Contact'].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-blue-400 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            {['Blog', 'Guides', 'Case Studies'].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-300 hover:text-blue-400 transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay in the Loop</h4>
          <p className="text-sm text-gray-300 mb-4">Get weekly tips, updates, and exclusive offers.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>
          {submitted && (
            <p className="text-sm text-green-400 mt-2">Thanks for subscribing!</p>
          )}
          <p className="text-xs text-gray-400 mt-2">
            We respect your privacy.{' '}
            <a href="/privacy" className="underline hover:text-blue-400">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Social Media */}
      <div className="mt-10 flex justify-center gap-6">
        {[
          { href: 'https://x.com', label: 'X', icon: 'M18 6L6 18M6 6l12 12' },
          { href: 'https://linkedin.com', label: 'LinkedIn', icon: 'M16 8a6 6 0 00-12 0v7h4v-7a2 2 0 014 0v7h4V8zM8 0a2 2 0 100 4 2 2 0 000-4z' },
          { href: 'https://instagram.com', label: 'Instagram', icon: 'M12 2a10 10 0 00-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm0 3a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7zm0 2a5 5 0 00-5 5 5 5 0 005 5 5 5 0 005-5 5 5 0 00-5-5zm5.5-1a1 1 0 110 2 1 1 0 010-2z' },
        ].map(({ href, label, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${label}`}
            className="text-gray-300 hover:text-blue-400 transition-transform transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d={icon} />
            </svg>
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;

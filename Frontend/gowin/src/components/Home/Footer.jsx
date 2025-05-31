import React from 'react';
import gowin from '../../assets/gowin.jpg';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Branding */}
        <div className="space-y-3">
          <img src={gowin} alt="Gowin Travel" className="h-10 w-auto" />
          <p className="text-sm text-gray-300">
            Gowin International-Explore Beyond Borders , Win Every Journey with Gowin .
          </p>
          <p className="text-sm text-gray-300">📍 Location: Kathmandu, Nepal (Shankhamul)</p>
          <p className="text-sm text-gray-300">📞 Phone: +977-9851410966</p>
          <p className="text-sm text-gray-300">✉️ Email: info@gowintravel.com</p>
          <p className="text-xs text-gray-500">© 2025 Gowin International. All rights reserved.</p>
        </div>

        {/* Company Links */}
{/* Company Links */}
<div>
  <h4 className="text-lg font-semibold mb-4">Company</h4>
  <ul className="space-y-2">
    <li>
      <a
        href="/aboutus"
        className="text-sm text-gray-300 hover:text-blue-400 transition"
      >
        About
      </a>
    </li>
    <li>    </li>
    <li>
      <a
        href="/contactus"
        className="text-sm text-gray-300 hover:text-blue-400 transition"
      >
        Contact
      </a>
    </li>
  </ul>
</div>


        {/* Embedded Google Map */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mb-4">Find Us on Map</h4>
          <iframe
            title="Gowin Travel Location"
            className="w-full h-64 rounded-lg border-2 border-gray-700"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.222211266228!2d85.33676327452445!3d27.709755325740768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199f2782b155%3A0xf0c9c78d248b062d!2sBig%20Mart%20Shankhamul!5e0!3m2!1sen!2snp!4v1716551892004!5m2!1sen!2snp"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="mt-10 text-center text-xs text-gray-500">
        Developed with ❤️ by{' '}
        <a
          href="https://www.linkedin.com/in/bibek-pandey-43313723b/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
           (Bibek Pandey)
        </a>
      </div>
    </footer>
  );
}

export default Footer;

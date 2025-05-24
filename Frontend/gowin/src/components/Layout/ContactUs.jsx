// src/pages/Contact.jsx
import React from 'react';
import Contact from '../../assets/Contact.png'; // adjust to actual filename

const ContactUs = () => {
  return (
    <div className="bg-white text-gray-600 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h1>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Image Section */}
          <img
            src={Contact}
            alt="Go Win Travels"
            className="w-full md:w-1/2 rounded-xl shadow-md"
          />

          {/* Contact Info */}
          <div className="space-y-4 md:w-1/2">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">📍 Location</h2>
              <p>Kathmandu, Shankhamul</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">📞 Phone</h2>
              <a href="tel:+9779851410966" className="text-blue-600 hover:underline">
                +977 9851410966
              </a>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">🕒 Available Hours</h2>
              <p>Sunday to Friday</p>
              <p>10:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

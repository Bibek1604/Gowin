// src/pages/AboutUs.jsx
import React from 'react';
import visaImage from '../../assets/visaImage.png'; // replace with actual filename

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-600 px-4 py-10">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg mb-8">
          At Gowin Travels, we specialize in offering expert travel solutions, visa assistance, and guided holiday planning for destinations around the globe. With our experienced team and top-notch support, we ensure that your travel experience is smooth, stress-free, and memorable.
        </p>
        
        {/* Image and Info */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={visaImage}
            alt="Visa Guidance"
            className="w-full md:w-1/2 rounded-lg shadow-md object-cover"
          />

          <div className="space-y-4 md:w-1/2">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Visa Expert</h2>
              <p>Get expert advice on visa requirements and document preparation for any country.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Visa Guidance</h2>
              <p>Step-by-step guidance throughout the visa application process to ensure approval.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Travel Support</h2>
              <p>Comprehensive support from flight booking to hotel accommodations and itinerary planning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

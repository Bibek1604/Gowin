import React from 'react';
import { Camera, Instagram, Play } from 'lucide-react';

const Gallery = () => {
  const images = [
    { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", span: "lg:col-span-2 lg:row-span-2", label: "Desert Sands" },
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "lg:col-span-1", label: "Blue Waters" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "lg:col-span-1", label: "Mountain Peaks" },
    { url: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", span: "lg:col-span-2", label: "Sky Drifting" },
    { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "lg:col-span-1", label: "Urban Lights" },
    { url: "https://images.unsplash.com/photo-1499678329028-101435549a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", span: "lg:col-span-1", label: "Coastal Roads" }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="text-left max-w-xl">
             <div className="flex items-center gap-2 mb-4 text-[#FF7F50]">
                <Camera className="w-5 h-5" />
                <span className="font-bold uppercase tracking-[0.3em] text-xs">Visual Journeys</span>
             </div>
             <h2 className="text-5xl font-extrabold text-[#0F4C5C] mb-6 tracking-tighter">Capturing the Essence</h2>
             <p className="text-gray-500 text-lg leading-relaxed">
               A mosaic of moments from our global wanderers. High-definition memories of the places that took our breath away.
             </p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-[#0F4C5C] text-white rounded-[2rem] font-bold hover:bg-[#0a3845] transition-all shadow-xl shadow-[#0F4C5C]/20 group">
             <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             Follow Our Lens
          </button>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px] lg:auto-rows-[250px]">
          {images.map((img, i) => (
            <div 
              key={i} 
              className={`group relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] shadow-[0_10px_40px_rgb(0,0,0,0.05)] border-4 border-white cursor-pointer ${img.span}`}
            >
              <img 
                src={img.url} 
                alt={img.label} 
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C5C]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 text-left">
                 <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-1 translate-y-4 group-hover:translate-y-0 transition-transform">Explorer Series</p>
                 <h4 className="text-white text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform delay-75">{img.label}</h4>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500">
                    <Play className="w-5 h-5 text-white fill-white" />
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Stat or Label */}
        <div className="mt-20 inline-flex items-center gap-3 bg-[#F8FAFB] px-8 py-4 rounded-[2rem] border border-gray-100">
           <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <img 
                  key={i} 
                  src={`https://i.pravatar.cc/100?img=${i+10}`} 
                  className="w-10 h-10 rounded-full border-4 border-white shadow-sm" 
                  alt="Reviewer" 
                />
              ))}
           </div>
           <p className="text-[#0F4C5C] font-bold text-sm tracking-tight">
             Join <span className="text-[#FF7F50]">1,200+</span> daily explorers sharing their stories.
           </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;

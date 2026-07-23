import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Star, Check, Clock, ArrowLeft,
  Shield, Globe, Map, Users, Phone, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';
import usePlaceStore from '../Store/PlaceStore';
import useDetailsStore from '../Store/DetailStore';

const ItineraryDay = ({ day, title, desc, index }) => {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0F4C5C] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {day}
          </div>
          <span className="text-sm font-semibold text-[#0F4C5C]">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="pl-11 text-sm text-gray-500 leading-relaxed border-l-2 border-[#FF7F50]/30 ml-4">{desc}</div>
        </div>
      )}
    </div>
  );
};

function DestinationDetails() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { places, fetchPlaces, isLoading: placesLoading } = usePlaceStore();
  const { details, fetchDetails } = useDetailsStore();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const init = async () => {
      if (places.length === 0) await fetchPlaces();
      await fetchDetails(placeId);
    };
    init();
  }, [placeId, fetchPlaces, fetchDetails]);

  useEffect(() => {
    const place = places.find(p => String(p.id) === String(placeId));
    const detail = details.find(d => String(d.place_id) === String(placeId));
    if (!place && !placesLoading) { setLoading(false); return; }
    if (place) {
      setDestination({
        id: place.id,
        title: place.title || 'Destination',
        images: place.images?.length > 0
          ? place.images
          : ['https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?auto=format&fit=crop&w=1200&q=80'],
        location: place.location || 'Nepal',
        rating: detail?.rating || 4.9,
        reviewCount: detail?.review_count || 48,
        description: place.description || 'A breathtaking destination curated exclusively for GoWin travelers.',
        price: place.price || 'Contact for pricing',
        duration: place.duration || '7 Days',
        destination_type: place.destination_type || 'National',
        highlights: detail?.highlights || [
          'Expert certified guides', 'Premium accommodation', 'All meals included',
          'Airport transfers', 'Travel insurance', '24/7 support',
        ],
        itinerary: detail?.itinerary || [
          { day: 1, title: 'Arrival & Welcome', desc: 'Airport pickup, hotel check-in, welcome briefing and orientation dinner.' },
          { day: 2, title: 'Exploration Begins', desc: 'Early start for the main highlight of your destination with your certified guide.' },
          { day: 3, title: 'Cultural Immersion', desc: 'Visit local markets, temples and interact with communities.' },
          { day: 4, title: 'Adventure Day', desc: 'Full day of outdoor activities tailored to your fitness level.' },
          { day: 5, title: 'Leisure & Relaxation', desc: 'Free morning to explore at your own pace. Afternoon optional excursion.' },
          { day: 6, title: 'Final Highlights', desc: 'Last key sights and farewell dinner with the team.' },
          { day: 7, title: 'Departure', desc: 'Breakfast, hotel checkout, and airport transfer.' },
        ],
      });
      setLoading(false);
    }
  }, [places, details, placeId, placesLoading]);

  if (loading || placesLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] pt-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="h-72 bg-gray-100 rounded-2xl animate-pulse mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center pt-20 font-sans text-center px-4">
        <Globe className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-[#0F4C5C] mb-2">Destination Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">This destination may have been removed or is unavailable.</p>
        <Link to="/details/all" className="btn-primary">Browse All Destinations</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFB] min-h-screen font-sans pt-16">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[480px] overflow-hidden bg-gray-200">
        <img
          src={destination.images[activeImg]}
          alt={destination.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f2b]/80 via-[#0F4C5C]/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Destination type */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
          <div className="flex items-center gap-1.5 bg-[#0F4C5C]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl text-white text-xs font-bold">
            {destination.destination_type === 'National' ? <Map className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
            {destination.destination_type === 'National' ? '🇳🇵 Nepal' : '🌍 International'}
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20">
          <div className="flex items-center gap-1.5 text-[#FF7F50] text-xs font-bold uppercase tracking-widest mb-2">
            <MapPin className="w-3.5 h-3.5" /> {destination.location}
          </div>
          <h1 className="heading-font text-2xl sm:text-3xl md:text-4xl text-white leading-tight">
            {destination.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-[#FFD23F] fill-[#FFD23F]" />
              <span className="text-white text-xs font-bold">{destination.rating}</span>
              <span className="text-white/60 text-xs">({destination.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <Clock className="w-3.5 h-3.5" /> {destination.duration}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {destination.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            {destination.images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#FF7F50]' : 'border-white/30 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Left — Details */}
          <div className="flex-1 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#0F4C5C] mb-3">About This Tour</h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{destination.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#0F4C5C] mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destination.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0F4C5C]/3 border border-[#0F4C5C]/5">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-[#0F4C5C] font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[#0F4C5C] mb-4">Day-by-Day Itinerary</h2>
              <div className="space-y-2">
                {destination.itinerary.map((item, i) => (
                  <ItineraryDay key={i} day={item.day} title={item.title} desc={item.desc} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Booking card */}
          <div className="lg:w-80 space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-20">
              <div className="bg-[#0F4C5C] p-5 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
                <p className="text-white/60 text-xs font-medium mb-1 relative z-10">Starting from</p>
                <div className="flex items-baseline gap-1 mb-1 relative z-10">
                  <span className="text-3xl sm:text-4xl font-black text-white">${destination.price}</span>
                  <span className="text-white/50 text-xs">/person</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs relative z-10">
                  <Clock className="w-3.5 h-3.5" /> {destination.duration}
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Star, label: 'Rating', val: `${destination.rating}/5` },
                    { icon: Users, label: 'Group Size', val: '2-15' },
                    { icon: Shield, label: 'Insurance', val: 'Included' },
                    { icon: Calendar, label: 'Availability', val: 'Year-round' },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                        <Icon className="w-3.5 h-3.5 text-[#FF7F50] mb-1" />
                        <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
                        <p className="text-xs font-bold text-[#0F4C5C]">{s.val}</p>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/booking"
                  state={{ preFilledDestination: destination.id }}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF7F50] hover:bg-[#e56a42] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#FF7F50]/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book This Tour <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-center text-[11px] text-gray-400 justify-center">
                  <Shield className="w-3.5 h-3.5" /> No payment required to request a booking
                </div>

                {/* Call CTA */}
                <a
                  href="tel:+9779851410966"
                  className="w-full flex items-center justify-center gap-2 border border-[#0F4C5C]/20 text-[#0F4C5C] py-3 rounded-xl text-sm font-semibold hover:bg-[#0F4C5C]/5 transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call to Enquire
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;

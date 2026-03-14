"use client"

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
   MapPin,
   Calendar,
   Star,
   Heart,
   ChevronDown,
   Plane,
   Sparkles,
   Check,
   Clock,
   ArrowLeft,
   ShieldCheck,
   Navigation,
   Globe
} from "lucide-react"
import usePlaceStore from "../Store/PlaceStore"
import useDetailsStore from "../Store/DetailStore"
import { Link } from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';

function DestinationDetails() {
   const { placeId } = useParams()
   const navigate = useNavigate()
   const { places, fetchPlaces, isLoading: storeLoading } = usePlaceStore()
   const { details, fetchDetails, isLoading: detailsLoading } = useDetailsStore()

   const [destination, setDestination] = useState(null)
   const [loading, setLoading] = useState(true)
   const [showItinerary, setShowItinerary] = useState(true)

   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      const initFetch = async () => {
         if (places.length === 0) {
            await fetchPlaces();
         }
         await fetchDetails(placeId);
      };
      initFetch();
   }, [placeId, fetchPlaces, fetchDetails]);

   useEffect(() => {
      const loadDestination = () => {
         const place = places.find((p) => String(p.id) === String(placeId));
         const placeDetail = details.find((d) => String(d.place_id) === String(placeId));

         if (!place && !storeLoading) {
            setLoading(false);
            return;
         }

         if (place) {
            setDestination({
               id: place.id,
               title: place.title || "Elite Destination",
               image: place.images?.[0] || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
               location: place.location || "Global Wonders",
               rating: placeDetail?.rating || 4.9,
               description: place.description || "A meticulously curated escape into the heart of the world's most breathtaking landscapes.",
               price: place.price || "Contact for pricing",
               duration: place.duration || "Flexible Days",
               highlights: placeDetail?.highlights || [
                  "Premium Accommodations",
                  "Certified Private Guides",
                  "Exclusive Cultural Access",
                  "Bespoke Logistics"
               ],
               itinerary: placeDetail?.itinerary || [
                  { day: 1, title: "Arrival & Reception", desc: "VIP greeting and transfer to your luxury residence." },
                  { day: 2, title: "Immersive Exploration", desc: "Private guided tour of hidden landmarks." },
                  { day: 3, title: "Leisure & Departure", desc: "Morning at leisure followed by executive transfer." }
               ]
            })
            setLoading(false)
         }
      };

      if (!storeLoading && !detailsLoading) {
         loadDestination()
      }
   }, [placeId, places, details, storeLoading, detailsLoading])

   const handleBooking = () => {
      navigate('/booking', {
         state: {
            preFilledDestination: destination?.id,
            destinationName: destination?.title
         }
      })
   }

   if (loading || storeLoading || detailsLoading) {
      return (
         <div className="flex justify-center items-center h-screen bg-white">
            <div className="flex flex-col items-center gap-6">
               <div className="h-16 w-16 rounded-full border-4 border-[#0F4C5C]/10 border-t-[#0F4C5C] animate-spin shadow-xl" />
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0F4C5C] animate-pulse">Mapping Your Odyssey...</p>
            </div>
         </div>
      )
   }

   if (!destination) {
      return (
         <div className="flex justify-center items-center min-h-screen bg-[#F8FAFB] px-6">
            <div className="text-center p-16 bg-white rounded-[3rem] shadow-2xl max-w-lg border border-gray-100">
               <div className="w-20 h-20 bg-[#FF7F50]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#FF7F50]">
                  <Navigation className="w-10 h-10 -rotate-45" />
               </div>
               <h2 className="text-4xl font-black tracking-tighter mb-4 text-[#0F4C5C]">Lost in Translation</h2>
               <p className="text-gray-400 mb-10 font-medium leading-relaxed">This destination hasn't been mapped in our elite collection yet.</p>
               <button
                  className="w-full bg-[#0F4C5C] py-5 rounded-2xl font-bold text-white shadow-xl shadow-[#0F4C5C]/20 hover:-translate-y-1 transition-all"
                  onClick={() => navigate('/')}
               >
                  Return to Exploration
               </button>
            </div>
         </div>
      )
   }

   return (
      <section className="min-h-screen bg-white font-sans text-[#0F4C5C] pb-32">
         <Toaster position="top-right" />

         {/* Dynamic Header / Navigation Control */}
         <div className="fixed top-24 left-10 z-[60] hidden lg:block">
            <button
               onClick={() => navigate(-1)}
               className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl flex items-center justify-center text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white transition-all group"
            >
               <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
         </div>

         <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 lg:pt-40">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

               {/* Main Visual Column */}
               <div className="lg:col-span-12">
                  <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-[12px] border-white group">
                     <img
                        src={destination.image}
                        className="w-full h-[500px] md:h-[700px] object-cover group-hover:scale-110 transition-transform duration-[3s]"
                        alt={destination.title}
                     />

                     {/* Floating Meta Info Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C5C]/80 via-transparent to-transparent flex flex-col justify-end p-12 md:p-20">
                        <div className="flex flex-wrap gap-4 mb-8">
                           <span className="px-5 py-2.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                              Official Selection 2026
                           </span>
                           <span className="px-5 py-2.5 bg-[#FF7F50] rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#FF7F50]/20 flex items-center gap-2">
                              <Globe className="w-3.5 h-3.5" /> Best Seller
                           </span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
                           {destination.title}
                        </h1>
                        <div className="flex items-center gap-8 text-white/80 font-bold uppercase tracking-widest text-xs">
                           <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#FF7F50]" /> {destination.location}
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#0F4C5C]" /> {destination.duration}
                           </div>
                           <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-[#FF7F50] fill-[#FF7F50]" /> {destination.rating} Rating
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Detailed Content Column */}
               <div className="lg:col-span-8 space-y-16">

                  {/* Brand Introduction */}
                  <div>
                     <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-[#0F4C5C]/10">
                        <Sparkles className="w-4 h-4" /> The Experience
                     </div>
                     <h2 className="text-5xl font-extrabold text-[#0F4C5C] mb-8 tracking-tighter">
                        Step into the <br /> <span className="text-[#FF7F50]">Exceptional.</span>
                     </h2>
                     <p className="text-gray-500 text-xl leading-relaxed font-medium">
                        {destination.description}
                     </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                     <h3 className="text-2xl font-bold mb-10 tracking-tight text-[#0F4C5C]">Signature Inclusions</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {destination.highlights.map((h, i) => (
                           <div key={i} className="flex gap-4 group">
                              <div className="w-12 h-12 bg-[#0F4C5C]/5 rounded-2xl flex items-center justify-center text-[#0F4C5C] shadow-sm transform group-hover:rotate-6 transition-transform">
                                 <Check className="w-6 h-6 stroke-[3]" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-[#0F4C5C] text-lg mb-1">{h}</h4>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Itinerary Accordion */}
                  <div className="border-t border-gray-100 pt-16">
                     <div className="flex justify-between items-end mb-12">
                        <div>
                           <h3 className="text-3xl font-extrabold text-[#0F4C5C] mb-2 tracking-tight">The Odyssey Itinerary</h3>
                           <p className="text-gray-400 font-medium">A day-by-day sequence of high-end exploration.</p>
                        </div>
                        <button
                           onClick={() => setShowItinerary(!showItinerary)}
                           className="p-4 bg-gray-50 rounded-2xl hover:bg-[#0F4C5C] hover:text-white transition-all"
                        >
                           <ChevronDown className={`w-6 h-6 transition-transform ${showItinerary ? 'rotate-180' : ''}`} />
                        </button>
                     </div>

                     <AnimatePresence>
                        {showItinerary && (
                           <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-8 overflow-hidden"
                           >
                              {destination.itinerary.map((day, i) => (
                                 <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex gap-8">
                                    <div className="w-16 h-16 bg-[#0F4C5C] text-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-lg">
                                       <span className="text-[10px] font-bold uppercase opacity-60">Day</span>
                                       <span className="text-2xl font-black leading-none">{day.day}</span>
                                    </div>
                                    <div>
                                       <h4 className="text-xl font-bold text-[#0F4C5C] mb-2">{day.title}</h4>
                                       <p className="text-gray-400 font-medium leading-relaxed">{day.desc}</p>
                                    </div>
                                 </div>
                              ))}
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>

               {/* Booking Sidebar Column */}
               <div className="lg:col-span-4 lg:pl-10">
                  <div className="sticky top-40 bg-white p-10 rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.06)] border border-gray-100 text-[#0F4C5C] relative overflow-hidden group">
                     {/* Subtle Decorative Accents */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8FAFB] rounded-full -mr-16 -mt-16 blur-2xl" />

                     <div className="relative z-10">
                        <div className="w-16 h-16 bg-[#0F4C5C]/5 rounded-2xl flex items-center justify-center text-[#0F4C5C] mb-8">
                           <ShieldCheck className="w-8 h-8" />
                        </div>

                        <p className="text-[#0F4C5C]/40 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Investment in Memories</p>
                        <div className="flex items-baseline gap-2 mb-10">
                           <span className="text-5xl font-black tracking-tighter text-[#0F4C5C]">${destination.price}</span>
                           <span className="text-[#0F4C5C]/30 text-[10px] font-bold uppercase tracking-widest">/ Per Person</span>
                        </div>

                        <button
                           onClick={handleBooking}
                           className="w-full bg-[#0F4C5C] text-white py-6 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-[#0F4C5C]/20 hover:bg-[#0a3845] active:scale-95 group/btn flex items-center justify-center gap-3"
                        >
                           Book Departure
                           <Navigation className="w-5 h-5 rotate-45 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>

                        <div className="mt-8 flex items-center justify-center gap-2 text-[#FF7F50] text-[10px] font-black uppercase tracking-widest bg-[#FF7F50]/5 py-4 px-4 rounded-2xl border border-[#FF7F50]/10">
                           <ShieldCheck className="w-4 h-4" />
                           Protected by Secure ${destination.price} Checkout
                        </div>
                     </div>
                  </div>


               </div>

            </div>

         </div>
      </section>
   )
}

export default DestinationDetails


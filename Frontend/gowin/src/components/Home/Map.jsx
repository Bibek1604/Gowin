"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import React from "react"

// Define sample locations
const locations = [
  { name: "Kathmandu, Nepal", lat: 27.6264, lng: 83.3789, color: "#4A8EBC", isHighlighted: true },
  { name: "New York", lat: 40.7128, lng: -74.006, color: "#3B5488" },
  { name: "London", lat: 51.5074, lng: -0.1278, color: "#5A9ECC" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: "#6AAEDC" },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, color: "#7ABCEC" },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241, color: "#8ACAFC" },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, color: "#5A9ECC" },
  { name: "Moscow", lat: 55.7558, lng: 37.6173, color: "#6AAEDC" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, color: "#7ABCEC" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, color: "#8ACAFC" },
]

export default function WorldMap() {
  const mapRef = useRef(null)
  const leafletMap = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !leafletMap.current) {
      // Initialize the map
      leafletMap.current = L.map(mapRef.current, {
        center: [27.4051, 85.203], // Center on Rupandehi, Nepal
        zoom: 3,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: false,
      })

      // Add a custom styled map
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap.current)

      // Custom marker icon
      const createCustomIcon = (color, isHighlighted = false) => {
        const size = isHighlighted ? 18 : 12
        const pulseAnimation = isHighlighted
          ? `animation: pulse 2s infinite; @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }`
          : ""

        return L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            box-shadow: 0 0 ${isHighlighted ? "15px 5px" : "10px 2px"} ${color};
            ${pulseAnimation}
          "></div>`,
          iconSize: [size, size],
        })
      }

      // Add markers for each location
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: createCustomIcon(location.color, location.isHighlighted),
        }).addTo(leafletMap.current)

        marker.bindTooltip(location.name, {
          permanent: location.isHighlighted,
          direction: "top",
          className: location.isHighlighted ? "highlighted-tooltip" : "location-tooltip",
        })
      })

      // Draw curved lines between locations
      const Kathmandu = locations[0]
      for (let i = 1; i < locations.length; i++) {
        const start = [Kathmandu.lat, Kathmandu.lng]
        const end = [locations[i].lat, locations[i].lng]
        const latlngs = createCurvedLine(start, end)

        L.polyline(latlngs, {
          color: `${Kathmandu.color}`,
          weight: 2,
          opacity: 0.8,
          className: "nepal-flight-path",
        }).addTo(leafletMap.current)
      }

      // Additional connections
      for (let i = 1; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          if (Math.random() > 0.7) {
            const start = [locations[i].lat, locations[i].lng]
            const end = [locations[j].lat, locations[j].lng]
            const latlngs = createCurvedLine(start, end)

            L.polyline(latlngs, {
              color: `${locations[i].color}50`,
              weight: 1,
              opacity: 0.5,
              className: "flight-path",
            }).addTo(leafletMap.current)
          }
        }
      }

      setIsLoaded(true)
    }

    // Cleanup
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [])

  // Curved line calculation
  function createCurvedLine(start, end) {
    const latlngs = []
    const midLat = (start[0] + end[0]) / 2
    const midLng = (start[1] + end[1]) / 2
    const distance = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2))
    const curveHeight = distance * 0.2

    const dx = end[0] - start[0]
    const dy = end[1] - start[1]
    const perpX = -dy
    const perpY = dx
    const length = Math.sqrt(perpX * perpX + perpY * perpY)
    const controlLat = midLat + (perpX / length) * curveHeight
    const controlLng = midLng + (perpY / length) * curveHeight

    const steps = 20
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const lat = Math.pow(1 - t, 2) * start[0] + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * end[0]
      const lng = Math.pow(1 - t, 2) * start[1] + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * end[1]
      latlngs.push([lat, lng])
    }
    return latlngs
  }

  return (
    <div className="w-full bg-[#F5FAFF] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative elements with low opacity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#4A8EBC]/5 animate-pulse-slow"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-[#3B5488]/5 animate-pulse-slow"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(#4A8EBC 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#4A8EBC]/20 animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-[#3B5488]/20 animate-pulse-slow"></div>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1A2A44] to-[#4A8EBC]">
              Global Presence
            </h2>
          </div>
          <p className="mt-4 text-lg text-[#2B4066]/80 max-w-2xl mx-auto">
            Connecting Peopl across the world with innovative digital solutions.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative">
          <div
            className="map-container bg-[#0a1a2d] rounded-2xl overflow-hidden shadow-xl border border-[#4A8EBC]/20"
            style={{
              width: "100%",
              height: "600px",
              position: "relative",
            }}
          >
            {/* Loading overlay */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-[#0a1a2d] flex items-center justify-center z-20">
                <div className="w-16 h-16 border-4 border-[#4A8EBC]/20 border-t-[#4A8EBC] rounded-full animate-spin"></div>
              </div>
            )}

            {/* Map */}
            <div
              ref={mapRef}
              style={{
                width: "100%",
                height: "100%",
                background: "#0a1a2d",
                borderRadius: "1rem",
              }}
            />

            {/* Map overlay decorations */}
            <div className="absolute top-4 left-4 bg-[#1A2A44]/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-[#4A8EBC]/30 z-10">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#4A8EBC] mr-2 animate-pulse"></div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 bg-[#1A2A44]/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-[#4A8EBC]/30 z-10 text-xs">
              Serving clients in 10+ countries
            </div>
          </div>


        </div>


      </div>

      <style jsx global>{`
        .leaflet-container {
          background-color: #0a1a2d;
          font-family: inherit;
          border-radius: 1rem;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          margin: 15px !important;
        }
        
        .leaflet-control-zoom a {
          background-color: rgba(26, 42, 68, 0.8) !important;
          color: white !important;
          border: 1px solid rgba(74, 142, 188, 0.3) !important;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        
        .leaflet-control-zoom a:hover {
          background-color: rgba(74, 142, 188, 0.8) !important;
        }
        
        .location-tooltip {
          background-color: rgba(26, 42, 68, 0.8);
          border: 1px solid rgba(74, 142, 188, 0.3);
          color: white;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-family: inherit;
        }
        
        .custom-marker {
          transition: transform 0.3s ease;
        }
        
        .custom-marker:hover {
          transform: scale(1.5);
          z-index: 1000 !important;
        }
        
        .flight-path {
          animation: glow 3s infinite alternate;
        }
        
        @keyframes glow {
          from {
            opacity: 0.3;
            stroke-width: 1px;
          }
          to {
            opacity: 0.8;
            stroke-width: 1.5px;
          }
        }
        
        .highlighted-tooltip {
          background-color: rgba(26, 42, 68, 0.9);
          border: 1px solid #4A8EBC;
          color: white;
          font-size: 14px;
          font-weight: bold;
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(74, 142, 188, 0.3);
          backdrop-filter: blur(4px);
          font-family: inherit;
        }
        
        .nepal-flight-path {
          animation: nepalGlow 2s infinite alternate;
          stroke-dasharray: 5, 5;
        }
        
        @keyframes nepalGlow {
          from {
            opacity: 0.6;
            stroke-width: 2px;
          }
          to {
            opacity: 1;
            stroke-width: 3px;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}


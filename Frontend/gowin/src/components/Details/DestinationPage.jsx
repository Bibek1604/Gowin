```jsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Calendar } from "lucide-react"
import { Button } from "../../components/Button"
import { Badge } from "../../components/Badge"

const destination = {
  id: 1,
  name: "Santorini, Greece",
  description: "Experience the breathtaking views of white-washed buildings against the deep blue Aegean Sea. Enjoy romantic sunsets, explore ancient ruins, and relax on pristine beaches.",
  image: "/placeholder.svg?height=600&width=800",
  location: "Mediterranean",
  rating: 4.9,
  price: "$1,899",
  category: "Islands",
  highlights: ["Sunset views in Oia", "Volcanic beaches", "Ancient Thera", "Winery tours"],
}

export default function DestinationDetails() {
  const [formData, setFormData] = useState({ name: "", email: "", date: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Booking submitted:", formData)
  }

  const renderRating = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-lg font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
              {destination.name}
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <MapPin className="h-5 w-5 text-teal-300" />
              <span className="text-lg">{destination.location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Details */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0">
                {destination.category}
              </Badge>
              {renderRating(destination.rating)}
            </div>
            <p className="text-gray-600 mb-6">{destination.description}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h3>
            <ul className="list-disc list-inside text-gray-600">
              {destination.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
            <div className="mt-6 text-2xl font-bold text-blue-600">{destination.price}</div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Your Trip</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Travel Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="mt-1 w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
```
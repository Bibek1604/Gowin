import React, { useMemo } from 'react';
import usePlaceStore from '../Store/PlaceStore';
import useBookingStore from '../Store/BookingStore';
import useCategoryStore from '../Store/CategoryStore';
import colors from '../../theme/colors';
import { Card, IconBadge } from '../ui';

function Dashboard() {
  const { places } = usePlaceStore();
  const { bookings } = useBookingStore();
  const { categories } = useCategoryStore();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, booking) => {
      const amount = parseFloat(booking.amount || 0);
      return sum + amount;
    }, 0);

    const recentBookings = bookings.slice(-5).reverse();

    // Group places by continent
    const placesByContinent = places.reduce((acc, place) => {
      const continent = place.continent || 'Other';
      acc[continent] = (acc[continent] || 0) + 1;
      return acc;
    }, {});

    // Popular destinations (most bookings)
    const destinationBookings = bookings.reduce((acc, booking) => {
      const placeId = booking.placeId;
      acc[placeId] = (acc[placeId] || 0) + 1;
      return acc;
    }, {});

    return {
      totalPlaces: places.length,
      totalBookings: bookings.length,
      totalCategories: categories.length,
      totalRevenue,
      recentBookings,
      placesByContinent,
      destinationBookings,
    };
  }, [places, bookings, categories]);

  const statCards = [
    {
      title: 'Total Places',
      value: stats.totalPlaces,
      icon: 'fas fa-map-marked-alt',
      gradient: 'vibrant',
      color: colors.accent.orange,
      change: '+12%',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: 'fas fa-calendar-check',
      gradient: 'primary',
      color: colors.primary.teal,
      change: '+23%',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: 'fas fa-tags',
      gradient: 'warm',
      color: colors.accent.yellow,
      change: '+5%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: 'fas fa-dollar-sign',
      gradient: 'cool',
      color: colors.accent.skyBlue,
      change: '+18%',
    },
  ];

  return (
    <div 
      className="min-h-screen p-6"
      style={{ 
        background: `linear-gradient(135deg, ${colors.neutral.white} 0%, ${colors.neutral.offWhite} 100%)`,

        fontFamily: 'Poppins, Montserrat, sans-serif'
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl font-bold mb-2 heading-font flex items-center gap-3"
          style={{ color: colors.primary.teal, fontFamily: 'Pacifico, cursive' }}
        >
          <i className="fas fa-chart-line" style={{ color: colors.accent.orange }}></i>
          Dashboard
        </h1>
        <p style={{ color: colors.neutral.gray }}>
          Welcome to your admin dashboard. Here's an overview of your travel platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} hover={true} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: colors.neutral.gray }}>
                  {stat.title}
                </p>
                <p 
                  className="text-3xl font-bold subheading-font mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <div className="flex items-center gap-1">
                  <i className="fas fa-arrow-up text-sm" style={{ color: colors.accent.orange }}></i>
                  <span className="text-sm font-medium" style={{ color: colors.accent.orange }}>
                    {stat.change}
                  </span>
                  <span className="text-xs" style={{ color: colors.neutral.lightGray }}>vs last month</span>
                </div>
              </div>
              <IconBadge icon={stat.icon} gradient={stat.gradient} size="lg" />
            </div>
            
            {/* Decorative gradient bar */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ background: colors.gradients[stat.gradient] }}
            />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <IconBadge icon="fas fa-receipt" gradient="vibrant" />
            <h2 
              className="text-2xl font-bold subheading-font"
              style={{ color: colors.primary.teal }}
            >
              Recent Bookings
            </h2>
          </div>

          {stats.recentBookings.length > 0 ? (
            <div className="space-y-3">
              {stats.recentBookings.map((booking, index) => {
                const place = places.find(p => p.id === booking.placeId);
                return (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border-2 hover:shadow-md transition-all"
                    style={{ 
                      borderColor: colors.neutral.lightGray,
                      background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.05) 0%, rgba(86, 207, 225, 0.05) 100%)'
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold mb-1" style={{ color: colors.neutral.darkGray }}>
                          {booking.name || 'Guest'}
                        </p>
                        <p className="text-sm mb-1" style={{ color: colors.neutral.gray }}>
                          <i className="fas fa-map-marker-alt mr-2" style={{ color: colors.accent.orange }}></i>
                          {place?.placeName || 'Unknown Destination'}
                        </p>
                        <p className="text-xs" style={{ color: colors.neutral.gray }}>
                          <i className="fas fa-calendar mr-2"></i>
                          {booking.date || 'No date'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold" style={{ color: colors.accent.orange }}>
                          ${booking.amount || '0'}
                        </p>
                        <span 
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ 
                            background: colors.gradients.warm,
                            color: 'white'
                          }}
                        >
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-6xl mb-4" style={{ color: colors.neutral.lightGray }}></i>
              <p style={{ color: colors.neutral.gray }}>No bookings yet</p>
            </div>
          )}
        </Card>

        {/* Places by Continent */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <IconBadge icon="fas fa-globe-americas" gradient="primary" />
            <h2 
              className="text-2xl font-bold subheading-font"
              style={{ color: colors.primary.teal }}
            >
              Places by Continent
            </h2>
          </div>

          {Object.keys(stats.placesByContinent).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.placesByContinent).map(([continent, count], index) => {
                const gradients = ['vibrant', 'primary', 'warm', 'cool'];
                const percentage = ((count / stats.totalPlaces) * 100).toFixed(0);
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-map" style={{ color: colors.accent.orange }}></i>
                        <span className="font-medium" style={{ color: colors.neutral.darkGray }}>
                          {continent}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: colors.primary.teal }}>
                          {count} {count === 1 ? 'place' : 'places'}
                        </span>
                        <span className="text-xs" style={{ color: colors.neutral.gray }}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          background: colors.gradients[gradients[index % gradients.length]]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-globe text-6xl mb-4" style={{ color: colors.neutral.lightGray }}></i>
              <p style={{ color: colors.neutral.gray }}>No places added yet</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <IconBadge icon="fas fa-rocket" gradient="warm" />
            <h2 
              className="text-2xl font-bold subheading-font"
              style={{ color: colors.primary.teal }}
            >
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'fas fa-plus-circle', text: 'Add Place', href: '/admin/add-place', color: colors.accent.orange },
              { icon: 'fas fa-calendar-plus', text: 'Add Booking', href: '/admin/add-booking', color: colors.primary.teal },
              { icon: 'fas fa-tag', text: 'Add Category', href: '/admin/add-category', color: colors.accent.yellow },
              { icon: 'fas fa-info-circle', text: 'Add Detail', href: '/admin/add-detail', color: colors.accent.skyBlue },
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="p-6 rounded-xl border-2 text-center hover:shadow-lg transition-all transform hover:-translate-y-1"
                style={{ 
                  borderColor: colors.neutral.lightGray,
                  background: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}10 0%, ${action.color}20 100%)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.neutral.lightGray;
                  e.currentTarget.style.background = 'white';
                }}
              >
                <i 
                  className={`${action.icon} text-4xl mb-3`}
                  style={{ color: action.color }}
                ></i>
                <p className="font-semibold" style={{ color: colors.neutral.darkGray }}>
                  {action.text}
                </p>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
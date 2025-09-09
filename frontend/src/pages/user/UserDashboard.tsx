import React from "react";
import { Calendar, Clock, MapPin, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const UserDashboard: React.FC = () => {
    // Mock data - will be replaced with real API calls
    const upcomingEvents = [
        {
            id:1,
            title: 'Tech Conference 2025',
            date: '2025-07-15',
            time: '09:00 AM',
            location: 'Silicon Valley Convention Center',
            price: 150,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
            category: 'Technology'
        },
        {
            id:2,
            title: 'Music Festival',
            date: '2025-08-12',
            time: '06:00 PM',
            location: 'Central',
            price: 75,
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            category: 'Music'
        },
        {
            id:3,
            title: 'Art Exhibition',
            date: '2025-09-20',
            time: '02:00 PM',
            location: 'Modern Art Museum',
            price: 25,
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            category: 'Art'
        }
    ];

    const categories = [
        { name: 'Technology', count: 8, icon: 'computer'},
        { name: 'Music', count: 12, icon: 'music'},
        { name: 'Art', count: 6, icon: 'art'},
        { name: 'Sports', count: 10, icon: 'football'},
        { name: 'Food', count: 15, icon: 'food'},
        { name: 'Business', count: 7, icon: 'business'},
    ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-dark-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Discover amazing events happening around you
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/events"
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105"
        >
          <Calendar className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">Browse Events</h3>
          <p className="text-primary-100">Discover new experiences</p>
        </Link>

        <Link
          to="/cart"
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <ShoppingCart className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">My Cart</h3>
          <p className="text-green-100">Review your selections</p>
        </Link>

        <Link
          to="/profile"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <Users className="w-8 h-8 mb-2" />
          <h3 className="text-lg font-semibold">My Profile</h3>
          <p className="text-purple-100">Manage your account</p>
        </Link>
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Event Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="text-center p-4 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer transition-colors"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {category.count} events
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Events
          </h2>
          <Link
            to="/events"
            className="text-primary-600 dark:text-primary-400 hover:text-primary-500 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 dark:border-dark-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    {event.category}
                  </span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    ${event.price}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                
                <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
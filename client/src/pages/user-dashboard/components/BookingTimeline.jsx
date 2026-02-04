import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingTimeline = ({ bookings }) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold font-accent text-slate-900">Recent Trips</h2>
          <p className="text-sm text-slate-500">Your travel history</p>
        </div>
        <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right" onClick={() => navigate('/dashboard/bookings')}>
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {(bookings || []).length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Icon name="Map" size={24} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">No trips yet</h3>
            <p className="text-slate-500 text-sm mb-4">Ready to start your first adventure?</p>
            <Button onClick={() => navigate('/vehicle-search')} variant="default" size="sm">
              Book Now
            </Button>
          </div>
        ) : (
          bookings.slice(0, 3).map((booking) => (
            <div key={booking._id} className="group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-accent/30 hover:shadow-lg transition-all duration-300 bg-white">
              <div className="w-full sm:w-24 h-16 rounded-xl overflow-hidden bg-slate-100 relative">
                <Image
                  src={booking.vehicle?.image}
                  alt={booking.vehicle?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900">{booking.vehicle?.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusStyle(booking.status)} font-medium uppercase tracking-wider`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="MapPin" size={12} />
                    {booking.pickupLocation}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal (Simplified for brevity, can reuse existing logic) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-accent">Trip Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            {/* ... details content ... */}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedBooking(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTimeline;
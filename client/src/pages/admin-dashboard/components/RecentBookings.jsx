import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecentBookings = ({ recentBookings = [] }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'CheckCircle';
      case 'active': return 'Play';
      case 'pending': return 'Clock';
      case 'completed': return 'Check';
      default: return 'Circle';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          <p className="text-sm text-gray-600">Latest customer reservations</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            View All
          </button>
          <Icon name="ExternalLink" size={16} className="text-gray-400" />
        </div>
      </div>
      <div className="space-y-4">
        {recentBookings.length === 0 ? (
           <p className="text-text-secondary text-center py-4">No recent bookings found.</p>
        ) : (
          recentBookings.map((booking) => (
            <div key={booking._id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={booking.user?.avatar}
                  alt={booking.user?.name || 'User'}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{booking.user?.firstName} {booking.user?.lastName}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                    <Icon name={getStatusIcon(booking.status)} size={12} />
                    <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{booking.user?.email}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span className="font-medium text-gray-900">{booking.vehicle?.name}</span>
                    <span>•</span>
                    <span className="font-semibold text-green-600">${booking.totalPrice?.toFixed(2)}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Pickup: {formatDate(booking.startDate)}</p>
                    <p className="text-xs text-gray-400">ID: {booking._id.substring(0, 8)}...</p>
                  </div>
                </div>
              </div>

              <Icon name="ChevronRight" size={16} className="text-gray-400" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBookings;
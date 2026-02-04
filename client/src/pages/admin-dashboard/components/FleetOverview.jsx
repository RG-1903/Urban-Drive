import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FleetOverview = ({ fleetData = [] }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':return 'bg-green-100 text-green-800 border-green-200';
      case 'rented':return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':return 'bg-orange-100 text-orange-800 border-orange-200';
      default:return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatMaintDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fleet Overview</h3>
          <p className="text-sm text-gray-600">Vehicle performance and status</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            View All
          </button>
          <Icon name="ExternalLink" size={16} className="text-gray-400" />
        </div>
      </div>
      <div className="space-y-4">
        {fleetData.length === 0 ? (
          <p className="text-text-secondary text-center py-4">No fleet data available.</p>
        ) : (
          fleetData.map((vehicle) => (
            <div key={vehicle._id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{vehicle.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{vehicle.category}</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Next Service</p>
                  <p className="text-xs font-medium text-gray-700">{formatMaintDate(vehicle.nextMaintenance)}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FleetOverview;
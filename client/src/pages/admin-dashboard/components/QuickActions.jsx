import React from 'react';
import Icon from '../../../components/AppIcon';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: "Add New Vehicle",
      description: "Register a new vehicle to the fleet",
      icon: "Plus",
      color: "blue",
      path: "/admin/vehicles"
    },
    {
      id: 2,
      title: "Manage Bookings",
      description: "View and update all bookings",
      icon: "Calendar",
      color: "green",
      path: "/admin/bookings"
    },
    {
      id: 3,
      title: "Manage Users",
      description: "View and edit user accounts",
      icon: "Users",
      color: "orange",
      path: "/admin/users"
    },
    {
      id: 4,
      title: "Generate Report",
      description: "Create custom analytics reports",
      icon: "FileText",
      color: "purple",
      path: "/admin/reports"
    },
    {
      id: 5,
      title: "Customer Support",
      description: "Access support ticket system",
      icon: "Headphones",
      color: "red",
      path: "/admin/support"
    },
    {
      id: 6,
      title: "Manage Locations",
      description: "Update pickup/dropoff locations",
      icon: "MapPin",
      color: "green",
      path: "/admin/locations"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
      green: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
      orange: "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100",
      purple: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
      red: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-sm text-gray-600">Frequently used admin functions</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <Link
            key={action?.id}
            to={action?.path}
            className={`p-4 rounded-xl border text-left transition-all duration-300 hover:shadow-cinematic ${getColorClasses(action?.color)}`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(action?.color)}`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{action?.title}</h4>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{action?.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">System Status</h4>
            <p className="text-xs text-gray-600">All systems operational</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-600">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
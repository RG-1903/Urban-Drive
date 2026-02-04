import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = ({ initialAlerts = [] }) => {
  const [alerts, setAlerts] = useState(initialAlerts);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'maintenance': return 'Wrench';
      case 'inventory': return 'Package';
      case 'payment': return 'CreditCard';
      case 'system': return 'Settings';
      case 'customer': return 'User';
      default: return 'Bell';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'maintenance': return 'text-orange-600';
      case 'inventory': return 'text-blue-600';
      case 'payment': return 'text-red-600';
      case 'system': return 'text-purple-600';
      case 'customer': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Settings">
            Settings
          </Button>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No alerts at this time</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-sm ${
                alert.isRead ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(alert.type)} bg-gray-100`}>
                  <Icon name={getTypeIcon(alert.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-semibold ${alert.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {alert.title}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${alert.isRead ? 'text-gray-600' : 'text-gray-700'}`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      {alert.action || 'View Details'}
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              View All Alerts
            </button>
            <button 
              onClick={() => setAlerts(alerts.map(alert => ({ ...alert, isRead: true })))}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
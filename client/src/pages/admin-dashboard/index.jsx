import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';
import FleetOverview from './components/FleetOverview';
import RecentBookings from './components/RecentBookings';
import QuickActions from './components/QuickActions';
import AlertsPanel from './components/AlertsPanel';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:8080/api/v1';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    revenueChart: [],
    fleet: [],
    bookings: [],
    alerts: []
  });
  
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchData = async (range) => {
      setLoading(true);
      try {
        const [statsRes, revenueRes, fleetRes, bookingsRes, alertsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/stats?range=${range}`),
          axios.get(`${API_URL}/admin/revenue-chart?range=${range}`),
          axios.get(`${API_URL}/admin/fleet-overview`),
          axios.get(`${API_URL}/admin/recent-bookings?range=${range}`),
          axios.get(`${API_URL}/admin/alerts`)
        ]);

        setDashboardData({
          stats: {
            totalRevenue: statsRes.data.data.totalRevenue,
            activeBookings: statsRes.data.data.activeBookings,
            fleetUtilization: `${statsRes.data.data.utilizationRate}%`,
            customerSatisfaction: `${statsRes.data.data.customerSatisfaction}/5`
          },
          revenueChart: revenueRes.data.data,
          fleet: fleetRes.data.data.fleet,
          bookings: bookingsRes.data.data.bookings,
          alerts: alertsRes.data.data.alerts
        });
        
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(selectedTimeRange);
    return () => clearInterval(timer);
  }, [selectedTimeRange]);

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const statsCardsData = [
    {
      title: "Total Revenue",
      value: `$${dashboardData.stats.totalRevenue?.toLocaleString() || '0'}`,
      icon: "DollarSign",
      color: "green"
    },
    {
      title: "Active Bookings",
      value: dashboardData.stats.activeBookings || '0',
      icon: "Calendar",
      color: "blue"
    },
    {
      title: "Fleet Utilization",
      value: dashboardData.stats.fleetUtilization || '0%',
      icon: "Car",
      color: "purple"
    },
    {
      title: "Customer Satisfaction",
      value: dashboardData.stats.customerSatisfaction || 'N/A',
      icon: "Star",
      color: "orange"
    }
  ];

  if (loading && !dashboardData.stats.totalRevenue) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-accent" size={64} />
      </div>
    );
  }

  return (
    <div className="relative p-6">
      {loading && (
         <div className="absolute inset-0 bg-gray-50/50 z-10 flex items-center justify-center">
           <Icon name="Loader2" className="animate-spin text-accent" size={48} />
         </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName}! Here's what's happening today.
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Icon name="Clock" size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  Last updated: {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedTimeRange(range.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      selectedTimeRange === range.value
                        ? 'bg-blue-600 text-white' :'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <Button variant="outline" iconName="Download">
                Export Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCardsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <RevenueChart data={dashboardData.revenueChart} />
          </div>
          
          <div>
            <QuickActions />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FleetOverview fleetData={dashboardData.fleet} />
          
          <RecentBookings recentBookings={dashboardData.bookings} />
        </div>

        <div className="mb-8">
          <AlertsPanel initialAlerts={dashboardData.alerts} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import DashboardHeader from './components/DashboardHeader';
import BookingTimeline from './components/BookingTimeline';
import LoyaltyProgram from './components/LoyaltyProgram';
import QuickActions from './components/QuickActions';
import FavoritesSection from './components/FavoritesSection';
import RecommendationsCard from './components/RecommendationsCard';
import AccountSettings from './components/AccountSettings';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    favorites: { vehicles: [], searches: [] },
    recommendations: [],
    loyalty: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/users/dashboard-overview`);
        const { bookings, favorites, loyalty, recommendations } = res.data.data;

        setDashboardData({
          bookings,
          favorites,
          loyalty,
          recommendations
        });

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        alert(`Failed to load dashboard data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, navigate]);

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'new-booking':
        navigate('/vehicle-search');
        break;
      case 'documents':
      case 'notifications':
        setActiveView('settings');
        break;
      case 'support':
        navigate('/support');
        break;
      case 'extend-rental':
        navigate('/support');
        break;
      case 'referral':
        alert('Referral system coming soon! You will be able to earn points by inviting friends.');
        break;
      default:
        console.log('Action clicked:', actionId);
    }
  };

  const handleUpdateProfile = async (formData) => {
    try {
      await axios.patch(`${API_URL}/users/updateMe`, formData);
      // Refetch full user data to ensure all fields (like favorites) are populated correctly
      const res = await axios.get(`${API_URL}/users/me`);
      setUser(res.data.data.user);
      alert('Profile updated successfully!');
      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile.';
      alert(errorMessage);
      return false;
    }
  };

  const handleRemoveFavorite = async (type, id) => {
    try {
      if (type === 'vehicle') {
        await axios.delete(`${API_URL}/users/my-favorites/vehicles/${id}`);
        setDashboardData(prev => ({
          ...prev,
          favorites: {
            ...prev.favorites,
            vehicles: prev.favorites.vehicles.filter(v => v._id !== id)
          }
        }));
      } else if (type === 'search') {
        await axios.delete(`${API_URL}/users/my-favorites/searches/${id}`);
        setDashboardData(prev => ({
          ...prev,
          favorites: {
            ...prev.favorites,
            searches: prev.favorites.searches.filter(s => s._id !== id)
          }
        }));
      }
    } catch (err) {
      console.error(`Failed to remove favorite ${type}:`, err);
    }
  };

  const handleBookFavorite = (vehicleId) => {
    navigate(`/booking-wizard?vehicleId=${vehicleId}`);
  };

  const handleRedeemPoints = async (rewardId) => {
    const reward = dashboardData.loyalty.availableRewards.find(r => r.id === rewardId);
    if (!reward) {
      alert('Please select a reward to redeem.');
      return;
    }

    console.log('Redeeming reward:', reward);
    console.log('User points:', dashboardData.loyalty.points);

    const userPoints = Number(dashboardData.loyalty.points || 0);
    const rewardPoints = Number(reward.points);

    if (userPoints < rewardPoints) {
      alert(`Not enough points to redeem ${reward.title}. You need ${rewardPoints} points but only have ${userPoints}.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to redeem ${reward.title} for ${reward.points} points?`)) return;

    try {
      const res = await axios.post(`${API_URL}/loyalty/redeem`, {
        rewardId: reward.id,
        pointsCost: reward.points
      });

      alert(`Successfully redeemed: ${reward.title}!`);

      // Update local state
      setDashboardData(prev => ({
        ...prev,
        loyalty: {
          ...prev.loyalty,
          points: res.data.data.points
        }
      }));

      // Update global user context if needed (optional, but good for consistency)
      setUser(prev => ({ ...prev, loyaltyPoints: res.data.data.points }));

    } catch (err) {
      console.error("Failed to redeem reward", err);
      alert(err.response?.data?.message || "Failed to redeem reward.");
    }
  };

  const handleRecommendationAction = (action, item) => {
    if (action === 'book') {
      navigate(`/booking-wizard?vehicleId=${item.vehicle._id}`);
    } else if (action === 'view') {
      navigate(`/vehicles/${item.vehicle._id}`);
    } else if (action === 'claim') {
      alert(`Offer claimed! Use code SPECIAL20 at checkout for ${item.vehicle.name}.`);
      navigate(`/booking-wizard?vehicleId=${item.vehicle._id}`);
    }
  };

  const dashboardNavigation = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'bookings', label: 'My Bookings', icon: 'Calendar' },
    { id: 'favorites', label: 'Favorites', icon: 'Heart' },
    { id: 'loyalty', label: 'Loyalty Program', icon: 'Crown' },
    { id: 'settings', label: 'Account Settings', icon: 'Settings' }
  ];

  if (loading || authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-accent" size={64} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader user={user} loyaltyData={dashboardData.loyalty} />

          <div className="flex flex-wrap gap-2 mb-8 bg-card rounded-xl p-2 shadow-cinematic">
            {dashboardNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeView === item.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-primary hover:bg-surface'
                  }`}
              >
                <Icon name={item.icon} size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>

          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <BookingTimeline bookings={dashboardData.bookings} />
                <QuickActions onActionClick={handleQuickAction} />
              </div>
              <div className="space-y-8">
                <RecommendationsCard
                  recommendations={dashboardData.recommendations}
                  onAction={handleRecommendationAction}
                />
                <LoyaltyProgram
                  loyaltyData={dashboardData.loyalty}
                  onRedeem={handleRedeemPoints}
                  compact={true}
                />
              </div>
            </div>
          )}

          {activeView === 'bookings' && (
            <div className="max-w-4xl mx-auto">
              <BookingTimeline bookings={dashboardData.bookings} />
            </div>
          )}

          {activeView === 'favorites' && (
            <div className="max-w-4xl mx-auto">
              <FavoritesSection
                favorites={dashboardData.favorites}
                onRemoveFavorite={handleRemoveFavorite}
                onBookFavorite={handleBookFavorite}
              />
            </div>
          )}

          {activeView === 'loyalty' && (
            <div className="max-w-4xl mx-auto">
              <LoyaltyProgram
                loyaltyData={dashboardData.loyalty}
                onRedeem={handleRedeemPoints}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="max-w-6xl mx-auto">
              <AccountSettings
                user={user}
                onUpdateProfile={handleUpdateProfile}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
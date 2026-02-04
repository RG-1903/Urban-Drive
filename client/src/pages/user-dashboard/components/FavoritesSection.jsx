import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FavoritesSection = ({ favorites, onRemoveFavorite, onBookFavorite }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vehicles');

  const tabs = [
    { id: 'vehicles', label: 'Vehicles', icon: 'Car', count: favorites?.vehicles?.length || 0 },
    { id: 'searches', label: 'Searches', icon: 'Search', count: favorites?.searches?.length || 0 }
  ];

  return (
    <div className="bg-card rounded-2xl p-6 shadow-cinematic">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-card-foreground">My Favorites</h2>
        <Button onClick={() => navigate('/vehicle-search')} variant="outline" size="sm" iconName="Heart" iconPosition="left">
          Manage All
        </Button>
      </div>

      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-primary'
              }`}
          >
            <Icon name={tab.icon} size={16} />
            <span>{tab.label}</span>
            <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          {favorites?.vehicles?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Heart" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No favorite vehicles yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start browsing and save vehicles you love for quick access
              </p>
              <Button onClick={() => navigate('/vehicle-search')} variant="default" iconName="Search" iconPosition="left">
                Browse Vehicles
              </Button>
            </div>
          ) : (
            favorites.vehicles.map((vehicle) => (
              <div key={vehicle._id} className="bg-surface rounded-xl p-4 border border-border hover:shadow-cinematic transition-all duration-300">
                <div className="flex gap-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.imageAlt || vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-surface-foreground truncate">
                        {vehicle.name}
                      </h3>
                      <button
                        onClick={() => onRemoveFavorite('vehicle', vehicle._id)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors duration-200"
                      >
                        <Icon name="Heart" size={16} fill="currentColor" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Icon name="DollarSign" size={14} />
                        {vehicle.pricePerDay}/day
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Users" size={14} />
                        {vehicle.seats} seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Fuel" size={14} />
                        {vehicle.fuelType}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        iconName="Calendar"
                        iconPosition="left"
                        onClick={() => onBookFavorite(vehicle._id)}
                      >
                        Book Now
                      </Button>
                      <Button onClick={() => navigate(`/vehicles/${vehicle._id}`)} variant="outline" size="sm" iconName="Eye" iconPosition="left">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'searches' && (
        <div className="space-y-4">
          {favorites?.searches?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No saved searches</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Save your search criteria for quick access later
              </p>
              <Button onClick={() => navigate('/vehicle-search')} variant="default" iconName="Plus" iconPosition="left">
                Create Search
              </Button>
            </div>
          ) : (
            favorites.searches.map((search) => (
              <div key={search._id} className="bg-surface rounded-xl p-4 border border-border hover:shadow-cinematic transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-surface-foreground">
                    {search.name}
                  </h3>
                  <button
                    onClick={() => onRemoveFavorite('search', search._id)}
                    className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors duration-200"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Icon name="MapPin" size={14} />
                    <span className="truncate">{search.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    <span className="truncate">{search.dates || 'Any Date'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Car" size={14} />
                    <span className="truncate">{search.category || 'Any'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="DollarSign" size={14} />
                    <span className="truncate">{search.priceRange || 'Any'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => navigate('/vehicle-search')} variant="default" size="sm" iconName="Search" iconPosition="left">
                    Run Search
                  </Button>
                  <Button variant="outline" size="sm" iconName="Edit" iconPosition="left">
                    Edit
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
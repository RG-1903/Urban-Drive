import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();

  // Initialize liked state from localStorage
  const [isLiked, setIsLiked] = useState(() => {
    const likedVehicles = JSON.parse(localStorage.getItem('likedVehicles') || '[]');
    return likedVehicles.includes(vehicle.id);
  });

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Get current liked vehicles from localStorage
    const likedVehicles = JSON.parse(localStorage.getItem('likedVehicles') || '[]');

    if (isLiked) {
      // Remove from liked vehicles
      const updatedLikes = likedVehicles.filter(id => id !== vehicle.id);
      localStorage.setItem('likedVehicles', JSON.stringify(updatedLikes));
      setIsLiked(false);
    } else {
      // Add to liked vehicles
      const updatedLikes = [...likedVehicles, vehicle.id];
      localStorage.setItem('likedVehicles', JSON.stringify(updatedLikes));
      setIsLiked(true);
    }
  };

  return (
    <div className="group bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-50">
        {vehicle.availability === 'available' && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              AVAILABLE
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:scale-110 active:scale-95 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}
          >
            <Icon name="Heart" size={16} className={`transition-all duration-300 ${isLiked ? 'fill-current scale-110' : 'scale-100'}`} />
          </button>
        </div>

        <Image
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 flex flex-col justify-between relative">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-wider mb-1">{vehicle.type}</p>
              <h3 className="text-lg font-bold text-primary font-accent leading-tight group-hover:text-primary/80 transition-colors">{vehicle.name}</h3>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">
              <Icon name="Star" size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-yellow-700">{vehicle.ratingAverage || vehicle.rating || 'N/A'}</span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Icon name="Users" size={14} className="text-primary/40" />
              <span className="text-[10px] font-medium">{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Icon name="Zap" size={14} className="text-primary/40" />
              <span className="text-[10px] font-medium">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Icon name="Fuel" size={14} className="text-primary/40" />
              <span className="text-[10px] font-medium">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Icon name="Gauge" size={14} className="text-primary/40" />
              <span className="text-[10px] font-medium">{vehicle.mileage}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-50">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 font-medium mb-0.5">Daily Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-primary">${vehicle.pricePerDay || vehicle.price}</span>
                <span className="text-[10px] text-gray-400 font-medium">/ day</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="default"
              fullWidth
              onClick={() => navigate(`/vehicle-details?id=${vehicle.id}`)}
              className="border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 font-semibold h-10 rounded-xl text-xs group/btn relative overflow-hidden"
            >
              <span className="relative z-10">Details</span>
            </Button>
            <Button
              variant="default"
              size="default"
              fullWidth
              disabled={vehicle.availability === 'unavailable'}
              onClick={() => navigate(`/booking-wizard?vehicleId=${vehicle.id}`)}
              className="bg-black text-white shadow-md hover:shadow-xl hover:bg-gray-900 hover:-translate-y-0.5 transition-all duration-300 font-bold h-10 rounded-xl border border-transparent text-xs group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out z-0"></div>
              <span className="relative z-10">{vehicle.availability === 'unavailable' ? 'Unavailable' : 'Book Now'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResults = ({ vehicles, isLoading, sortBy, onSortChange }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-[1.5rem] h-[400px] animate-pulse border border-gray-100 shadow-sm">
            <div className="h-48 bg-gray-100 rounded-t-[1.5rem]" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded" />
              </div>
              <div className="pt-4 flex gap-2">
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
                <div className="h-10 bg-gray-100 rounded-xl flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-primary font-accent">
            Available Vehicles <span className="text-gray-400 font-normal text-base ml-2">({vehicles.length})</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all shadow-sm hover:border-gray-300 hover:shadow-md cursor-pointer"
            >
              <option value="relevance">Best Match</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <Icon name="ChevronDown" size={16} />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <VehicleCard
                vehicle={vehicle}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {vehicles.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Search" size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">No vehicles found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your filters or search criteria to find available vehicles.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
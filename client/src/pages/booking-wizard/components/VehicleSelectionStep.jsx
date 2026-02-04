import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { API_URL } from '../../../utils/config';

const VehicleSelectionStep = ({ onNext, bookingData }) => {
  const [vehicles, setVehicles] = useState([]);
  const [category, setCategory] = useState('Luxury');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'Luxury', label: 'Luxury Class', icon: 'Crown' },
    { id: 'Sports', label: 'Sport & Exotic', icon: 'Zap' },
    { id: 'SUV', label: 'Premium SUVs', icon: 'Truck' },
    { id: 'Electric', label: 'Electric', icon: 'BatteryCharging' }
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/vehicles`, {
          params: { category, sort: 'pricePerDay' }
        });
        setVehicles(res.data.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [category]);

  const handleSelect = (vehicle) => {
    onNext({ vehicle });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Select Your Vehicle</h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Choose from our exclusive fleet of premium vehicles.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-nowrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 border ${category === cat.id
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
          >
            <Icon name={cat.icon} size={16} />
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <Icon name="Loader2" size={40} className="animate-spin text-primary" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 bg-surface/50 rounded-3xl border border-dashed border-border">
          <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No vehicles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              whileHover={{ y: -4 }}
              className={`group relative bg-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${bookingData.vehicle?.id === vehicle.id
                ? 'border-primary ring-1 ring-primary'
                : 'border-border hover:border-primary/30 hover:shadow-lg'
                }`}
              onClick={() => handleSelect(vehicle)}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center shadow-sm">
                  <Icon name="Star" size={12} className="text-yellow-400 mr-1.5 fill-current" />
                  {vehicle.ratingAverage}
                </div>

                <div className="absolute bottom-4 left-5 text-white">
                  <h3 className="text-xl font-bold mb-1">{vehicle.name}</h3>
                  <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest flex items-center gap-2">
                    <span className="bg-white/20 px-2 py-0.5 rounded">{vehicle.make}</span>
                    <span>•</span>
                    <span>{vehicle.year}</span>
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-muted-foreground">
                  <div className="flex flex-col items-center gap-1 p-2 bg-secondary/30 rounded-xl">
                    <Icon name="Users" size={18} className="text-primary" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-secondary/30 rounded-xl">
                    <Icon name="Briefcase" size={18} className="text-primary" />
                    <span>{vehicle.transmission}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 bg-secondary/30 rounded-xl">
                    <Icon name="Fuel" size={18} className="text-primary" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-3xl font-bold text-primary font-accent">${vehicle.pricePerDay}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Per Day</p>
                  </div>

                  <button className={`px-6 py-2.5 rounded-lg font-semibold text-xs transition-all duration-300 focus:outline-none ${bookingData.vehicle?.id === vehicle.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}>
                    {bookingData.vehicle?.id === vehicle.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleSelectionStep;
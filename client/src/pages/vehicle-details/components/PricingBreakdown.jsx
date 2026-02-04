import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

const PricingBreakdown = ({ vehicle, vehicleId }) => {
  const [selectedDuration, setSelectedDuration] = useState('daily');
  const [selectedInsurance, setSelectedInsurance] = useState('basic');
  const [viewers, setViewers] = useState(2);
  const navigate = useNavigate();
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth();

  // const isVehicleFavorited = isFavorited(vehicleId);

  // Simulate live viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const pricingOptions = {
    daily: { base: vehicle.pricePerDay, label: 'Daily', period: '/ day' },
    weekly: { base: Math.round(vehicle.pricePerDay * 7 * 0.85), label: 'Weekly', period: '/ week', discount: 15 },
    monthly: { base: Math.round(vehicle.pricePerDay * 30 * 0.70), label: 'Monthly', period: '/ month', discount: 30 }
  };

  const insuranceOptions = {
    basic: { price: 0, label: 'Basic', description: 'Standard coverage' },
    premium: { price: 29, label: 'Premium', description: 'Zero deductible' },
    comprehensive: { price: 49, label: 'Full', description: 'Complete peace of mind' }
  };

  const taxes = {
    salesTax: 8.25,
    facilityFee: 15,
    processingFee: 5
  };

  const calculateTotal = () => {
    if (!vehicle?.pricePerDay) return 0;
    const basePrice = pricingOptions[selectedDuration]?.base || 0;
    const insurancePrice = insuranceOptions[selectedInsurance]?.price || 0;
    const subtotal = basePrice + (insurancePrice * (selectedDuration === 'daily' ? 1 : selectedDuration === 'weekly' ? 7 : 30));
    const taxAmount = (subtotal * taxes.salesTax) / 100;
    const totalFees = taxes.facilityFee + taxes.processingFee;
    return subtotal + taxAmount + totalFees;
  };

  const total = calculateTotal();

  const handleBookNow = () => {
    navigate(`/booking-wizard?vehicleId=${vehicleId}`);
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      toggleFavorite(vehicleId);
    }
  };

  // Defensive check for auth context
  const safeIsFavorited = (id) => {
    try {
      return isFavorited && typeof isFavorited === 'function' ? isFavorited(id) : false;
    } catch (e) {
      console.error("Error checking favorite status:", e);
      return false;
    }
  };

  const isVehicleFavoritedSafe = safeIsFavorited(vehicleId);

  return (
    <div className="sticky top-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white/40 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

        <div className="relative z-10">
          {/* Header & Price */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-primary tracking-tight">${pricingOptions[selectedDuration].base}</span>
                <span className="text-text-secondary font-medium">{pricingOptions[selectedDuration].period}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-600 rounded-full text-xs font-bold animate-pulse">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {viewers} people viewing
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold">
                  <Icon name="ShieldCheck" size={12} />
                  Best Price
                </div>
              </div>
            </div>
          </div>

          {/* Duration Selector - Segmented Control */}
          <div className="bg-secondary/50 p-1.5 rounded-2xl flex mb-8 relative">
            <motion.div
              className="absolute bg-white shadow-sm rounded-xl inset-y-1.5"
              style={{
                left: selectedDuration === 'daily' ? '6px' : selectedDuration === 'weekly' ? '33.33%' : '66.66%',
                width: 'calc(33.33% - 4px)',
                x: selectedDuration === 'daily' ? 0 : selectedDuration === 'weekly' ? 4 : 8
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            {Object.entries(pricingOptions).map(([key, option]) => (
              <button
                key={key}
                onClick={() => setSelectedDuration(key)}
                className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-colors duration-300 relative z-10 ${selectedDuration === key ? 'text-primary' : 'text-text-secondary hover:text-primary'
                  }`}
              >
                {option.label}
                {option.discount && (
                  <span className="absolute -top-2 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
                    -{option.discount}%
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Insurance Selection */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Protection Plan</label>
              <button className="text-xs text-accent font-medium hover:underline">View Details</button>
            </div>
            <div className="space-y-3">
              {Object.entries(insuranceOptions).map(([key, option]) => (
                <div
                  key={key}
                  onClick={() => setSelectedInsurance(key)}
                  className={`group p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${selectedInsurance === key
                    ? 'border-accent bg-accent/5 shadow-lg shadow-accent/5'
                    : 'border-border hover:border-accent/30 hover:bg-white'
                    }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedInsurance === key ? 'border-accent' : 'border-gray-300 group-hover:border-gray-400'
                        }`}>
                        {selectedInsurance === key && <motion.div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{option.label}</div>
                        <div className="text-xs text-text-secondary">{option.description}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-primary">
                      {option.price === 0 ? 'Free' : `+$${option.price}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Actions */}
          <div className="space-y-4">
            <div className="flex justify-between items-end pb-4 border-b border-border/50">
              <span className="text-text-secondary font-medium">Estimated Total</span>
              <div className="text-right">
                <span className="text-3xl font-black text-primary">${total.toFixed(0)}</span>
                <span className="text-xs text-text-secondary block">Includes taxes & fees</span>
              </div>
            </div>

            <Button
              onClick={handleBookNow}
              variant="default"
              fullWidth
              size="lg"
              className="h-14 text-lg shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              iconName="ArrowRight"
              iconPosition="right"
            >
              Reserve Now
            </Button>

            <Button
              variant="outline"
              fullWidth
              size="lg"
              iconName={isVehicleFavoritedSafe ? "Heart" : "Heart"}
              iconPosition="left"
              onClick={handleFavoriteToggle}
              className={`h-12 border-2 ${isVehicleFavoritedSafe ? "text-red-500 border-red-200 bg-red-50" : "hover:bg-secondary"}`}
            >
              {isVehicleFavoritedSafe ? "Saved to Favorites" : "Save to Favorites"}
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Icon name="Lock" size={12} /> Secure
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="RotateCcw" size={12} /> Free Cancel
            </div>
          </div>
        </div>
      </motion.div>
    </div >
  );
};

export default PricingBreakdown;
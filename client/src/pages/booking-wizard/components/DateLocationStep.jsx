import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DateLocationStep = ({ onNext, onPrevious, bookingData }) => {
  const [pickupDate, setPickupDate] = useState(bookingData.dates?.pickup || '');
  const [pickupTime, setPickupTime] = useState(bookingData.dates?.pickupTime || '10:00');
  const [returnDate, setReturnDate] = useState(bookingData.dates?.return || '');
  const [returnTime, setReturnTime] = useState(bookingData.dates?.returnTime || '10:00');
  const [pickupLocation, setPickupLocation] = useState(bookingData.location?.pickup || 'Main Office');
  const [returnLocation, setReturnLocation] = useState(bookingData.location?.return || 'Main Office');

  const locations = [
    'Main Office',
    'Airport Terminal 1',
    'Airport Terminal 2',
    'Downtown Hub',
    'Westside Station'
  ];

  const handleContinue = () => {
    if (!pickupDate || !returnDate) return;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    onNext({
      dates: {
        pickup: pickupDate,
        pickupTime,
        return: returnDate,
        returnTime,
        days
      },
      location: {
        pickup: pickupLocation,
        return: returnLocation
      },
      availability: true // Mock availability check
    });
  };

  return (
    <div className="space-y-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2">Journey Details</h2>
        <p className="text-muted-foreground text-sm">Where and when should we meet you?</p>
      </div>

      <div className="space-y-12">
        {/* Pickup Section */}
        <div className="relative pl-8 border-l border-border">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-foreground shadow-[0_0_15px_rgba(0,0,0,0.1)]">
            <Icon name="MapPin" size={12} />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-6">Pickup</h3>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-semibold text-foreground mb-1.5">Pickup Location</label>
              <div className="relative">
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full h-11 px-3 bg-background border border-border rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-foreground cursor-pointer"
                >
                  {locations.map(loc => <option key={loc} value={loc} className="bg-background text-foreground">{loc}</option>)}
                </select>
                <Icon name="ChevronDown" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-foreground"
                />
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Time</label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Return Section */}
        <div className="relative pl-8 border-l border-border">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground">
            <Icon name="CornerDownLeft" size={12} />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-6">Return</h3>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-semibold text-foreground mb-1.5">Return Location</label>
              <div className="relative">
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="w-full h-11 px-3 bg-background border border-border rounded-lg appearance-none focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-foreground cursor-pointer"
                >
                  {locations.map(loc => <option key={loc} value={loc} className="bg-background text-foreground">{loc}</option>)}
                </select>
                <Icon name="ChevronDown" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-foreground"
                />
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-foreground mb-1.5">Time</label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-border">
        <button
          onClick={onPrevious}
          className="px-6 py-2.5 rounded-lg text-muted-foreground font-medium hover:bg-secondary hover:text-foreground transition-colors text-sm"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!pickupDate || !returnDate}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DateLocationStep;
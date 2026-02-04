import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const BookingSummary = ({ bookingData, currentStep, onNext, validateStep }) => {
  const days = bookingData.dates?.days || 0;
  const vehiclePrice = bookingData.vehicle?.pricePerDay || 0;
  const insurancePrice = bookingData.insurance?.price || 0;
  const extrasPrice = bookingData.extras?.reduce((acc, curr) => acc + curr.price, 0) || 0;

  const dailyTotal = vehiclePrice + insurancePrice + extrasPrice;
  const total = dailyTotal * (days || 1);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sticky top-8 shadow-sm">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Summary</h3>

      {/* Vehicle */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden">
          {bookingData.vehicle?.image && (
            <img src={bookingData.vehicle.image} alt={bookingData.vehicle.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <h4 className="font-bold text-foreground text-sm">{bookingData.vehicle?.name || 'Select Vehicle'}</h4>
          <p className="text-xs text-muted-foreground">{bookingData.vehicle?.category || 'Category'}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Duration</span>
          <span className="text-foreground">{days > 0 ? `${days} Days` : '-'}</span>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Vehicle Rate</span>
          <span className="text-foreground">${vehiclePrice}/day</span>
        </div>
        {insurancePrice > 0 && (
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Protection</span>
            <span className="text-foreground">+${insurancePrice}/day</span>
          </div>
        )}
        {extrasPrice > 0 && (
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Extras</span>
            <span className="text-foreground">+${extrasPrice}/day</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-6 border-t border-border mb-6">
        <div className="flex justify-between items-end">
          <span className="text-sm font-semibold text-muted-foreground">Total Estimated</span>
          <span className="text-2xl font-bold text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Button (Mobile Only - Desktop uses main flow) */}
      <div className="lg:hidden">
        <button
          onClick={() => onNext()}
          disabled={!validateStep(currentStep)}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
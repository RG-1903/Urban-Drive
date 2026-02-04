import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const InsuranceExtrasStep = ({ onNext, onPrevious, bookingData, onDataUpdate }) => {
  const [selectedInsurance, setSelectedInsurance] = useState(bookingData.insurance?.label || 'Basic');
  const [selectedExtras, setSelectedExtras] = useState(bookingData.extras || []);

  const insuranceOptions = [
    {
      id: 'basic',
      label: 'Basic',
      price: 0,
      description: 'Standard liability coverage.',
      features: ['Liability Coverage', 'Theft Protection (with deductible)', '24/7 Roadside Assistance']
    },
    {
      id: 'standard',
      label: 'Standard',
      price: 25,
      description: 'Reduced deductible and glass coverage.',
      features: ['Liability Coverage', 'Theft Protection (Low Deductible)', 'Glass & Tire Coverage', '24/7 Roadside Assistance'],
      recommended: true
    },
    {
      id: 'premium',
      label: 'Premium',
      price: 45,
      description: 'Zero deductible and full peace of mind.',
      features: ['Zero Deductible', 'Full Theft Protection', 'Glass, Tire & Undercarriage', 'Personal Accident Insurance', 'Priority Support']
    }
  ];

  const extrasOptions = [
    { id: 'gps', label: 'GPS Navigation', price: 15, icon: 'Map' },
    { id: 'child_seat', label: 'Child Safety Seat', price: 10, icon: 'Baby' },
    { id: 'wifi', label: 'Wi-Fi Hotspot', price: 12, icon: 'Wifi' },
    { id: 'concierge', label: 'Concierge Service', price: 50, icon: 'UserCheck' }
  ];

  const handleInsuranceSelect = (option) => {
    setSelectedInsurance(option.label);
    onDataUpdate({ insurance: option });
  };

  const handleExtraToggle = (extra) => {
    const isSelected = selectedExtras.find(e => e.id === extra.id);
    let newExtras;
    if (isSelected) {
      newExtras = selectedExtras.filter(e => e.id !== extra.id);
    } else {
      newExtras = [...selectedExtras, extra];
    }
    setSelectedExtras(newExtras);
    onDataUpdate({ extras: newExtras });
  };

  return (
    <div className="space-y-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2">Protection & Extras</h2>
        <p className="text-muted-foreground text-sm">Tailor your experience for peace of mind.</p>
      </div>

      {/* Insurance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insuranceOptions.map((option, index) => {
          const isSelected = selectedInsurance === option.label;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleInsuranceSelect(option)}
              className={`relative rounded-xl p-6 cursor-pointer transition-all duration-200 border group ${isSelected
                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                : 'bg-card border-border hover:border-primary/50'
                }`}
            >
              {option.recommended && !isSelected && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                  Recommended
                </div>
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-base font-bold mb-1">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  {isSelected && <Icon name="CheckCircle" className="text-primary" size={20} />}
                </div>

                <div className="mb-6">
                  <span className="text-2xl font-bold font-sans">
                    ${option.price}
                  </span>
                  <span className="text-xs text-muted-foreground">/day</span>
                </div>

                <ul className="space-y-2.5">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <Icon name="Check" size={14} className="text-primary mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Extras Section */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">Enhancements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {extrasOptions.map((extra) => {
            const isSelected = selectedExtras.find(e => e.id === extra.id);
            return (
              <div
                key={extra.id}
                onClick={() => handleExtraToggle(extra)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected
                  ? 'bg-primary/5 border-primary ring-1 ring-primary'
                  : 'bg-card border-border hover:border-primary/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                    <Icon name={extra.icon} size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{extra.label}</h4>
                    <p className="text-xs text-muted-foreground">${extra.price}/day</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-border'
                  }`}>
                  {isSelected && <Icon name="Check" size={12} className="text-primary-foreground" />}
                </div>
              </div>
            );
          })}
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
          onClick={() => onNext()}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default InsuranceExtrasStep;
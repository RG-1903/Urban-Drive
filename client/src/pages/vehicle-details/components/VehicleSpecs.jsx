import React from 'react';
import Icon from '../../../components/AppIcon';

const VehicleSpecs = ({ vehicle }) => {
  const specs = [
    { icon: 'Users', label: 'Passengers', value: `${vehicle.seats || 2} Seats` },
    { icon: 'Briefcase', label: 'Luggage', value: `${vehicle.luggage || 2} Bags` },
    { icon: 'Zap', label: 'Transmission', value: vehicle.transmission || 'Automatic' },
    { icon: 'Droplet', label: 'Fuel Type', value: vehicle.fuelType || 'Petrol' },
    { icon: 'Wind', label: 'AC', value: 'Climate Control' },
    { icon: 'MapPin', label: 'GPS', value: 'Included' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
      {specs.map((spec, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="text-slate-900 mt-1">
            <Icon name={spec.icon} size={24} />
          </div>
          <div>
            <p className="text-slate-900 font-medium text-base">{spec.value}</p>
            <p className="text-slate-500 text-sm">{spec.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleSpecs;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VehicleComparison = ({ comparedVehicles, onRemoveVehicle, onClearComparison }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!comparedVehicles || comparedVehicles.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-cinematic border border-border p-8 text-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="GitCompare" size={24} color="var(--color-text-secondary)" />
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">No Vehicles to Compare</h3>
        <p className="text-text-secondary mb-4">
          Select vehicles from the search results to compare their features and pricing.
        </p>
        <Button variant="outline" iconName="Search" iconPosition="left">
          Browse Vehicles
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Eye' },
    { id: 'specifications', label: 'Specifications', icon: 'Settings' },
    { id: 'features', label: 'Features', icon: 'Star' },
    { id: 'pricing', label: 'Pricing', icon: 'DollarSign' }
  ];

  const specifications = [
    { key: 'engine', label: 'Engine' },
    { key: 'horsepower', label: 'Horsepower' },
    { key: 'acceleration', label: '0-60 mph' },
    { key: 'topSpeed', label: 'Top Speed' },
    { key: 'fuelCapacity', label: 'Fuel Capacity' },
    { key: 'dimensions', label: 'Dimensions (L×W×H)' },
    { key: 'weight', label: 'Weight' },
    { key: 'drivetrain', label: 'Drivetrain' }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparedVehicles.map((vehicle) => (
          <div key={vehicle.id} className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src={vehicle.image}
                alt={vehicle.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => onRemoveVehicle(vehicle.id)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <Icon name="X" size={16} color="var(--color-text-secondary)" />
            </button>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-text-secondary">Vehicle</th>
              {comparedVehicles.map((vehicle) => (
                <th key={vehicle.id} className="text-left py-3 px-4 font-semibold text-primary min-w-48">
                  {vehicle.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="py-3 px-4 font-medium text-text-secondary">Category</td>
              {comparedVehicles.map((vehicle) => (
                <td key={vehicle.id} className="py-3 px-4 text-primary">{vehicle.category}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-text-secondary">Seating</td>
              {comparedVehicles.map((vehicle) => (
                <td key={vehicle.id} className="py-3 px-4 text-primary">{vehicle.seats} seats</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-text-secondary">Transmission</td>
              {comparedVehicles.map((vehicle) => (
                <td key={vehicle.id} className="py-3 px-4 text-primary">{vehicle.transmission}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-text-secondary">Fuel Type</td>
              {comparedVehicles.map((vehicle) => (
                <td key={vehicle.id} className="py-3 px-4 text-primary">{vehicle.fuelType}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-text-secondary">Rating</td>
              {comparedVehicles.map((vehicle) => (
                <td key={vehicle.id} className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} color="var(--color-warning)" className="fill-current" />
                    <span className="text-primary font-medium">{vehicle.ratingAverage}</span>
                    <span className="text-text-secondary">({vehicle.ratingQuantity})</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSpecificationsTab = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Specification</th>
            {comparedVehicles.map((vehicle) => (
              <th key={vehicle.id} className="text-left py-3 px-4 font-semibold text-primary min-w-48">
                {vehicle.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {specifications.map((spec) => (
            <tr key={spec.key}>
              <td className="py-3 px-4 font-medium text-text-secondary">{spec.label}</td>
              {comparedVehicles.map((vehicle) => (
                <td key={vehicle.id} className="py-3 px-4 text-primary">
                  {vehicle.specifications[spec.key] || 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      {comparedVehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-secondary/50 rounded-xl p-4">
          <h4 className="font-semibold text-primary mb-3">{vehicle.name}</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {vehicle.luxuryFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={14} color="var(--color-success)" />
                <span className="text-sm text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPricingTab = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-medium text-text-secondary">Pricing</th>
            {comparedVehicles.map((vehicle) => (
              <th key={vehicle.id} className="text-left py-3 px-4 font-semibold text-primary min-w-48">
                {vehicle.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <td className="py-3 px-4 font-medium text-text-secondary">Daily Rate</td>
            {comparedVehicles.map((vehicle) => (
              <td key={vehicle.id} className="py-3 px-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-primary">${vehicle.pricePerDay}</span>
                  <span className="text-sm text-text-secondary">per day</span>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 px-4 font-medium text-text-secondary">Weekly Rate</td>
            {comparedVehicles.map((vehicle) => (
              <td key={vehicle.id} className="py-3 px-4">
                <span className="text-lg font-semibold text-primary">
                  ${Math.round(vehicle.pricePerDay * 7 * 0.85)}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 px-4 font-medium text-text-secondary">Monthly Rate</td>
            {comparedVehicles.map((vehicle) => (
              <td key={vehicle.id} className="py-3 px-4">
                <span className="text-lg font-semibold text-primary">
                  ${Math.round(vehicle.pricePerDay * 30 * 0.7)}
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="py-3 px-4 font-medium text-text-secondary">Security Deposit</td>
            {comparedVehicles.map((vehicle) => (
              <td key={vehicle.id} className="py-3 px-4 text-primary">
                ${vehicle.securityDeposit || Math.round(vehicle.pricePerDay * 10)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-cinematic border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="GitCompare" size={18} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Vehicle Comparison</h3>
            <p className="text-sm text-text-secondary">
              Comparing {comparedVehicles.length} vehicle{comparedVehicles.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="Trash2"
          iconPosition="left"
          onClick={onClearComparison}
        >
          Clear All
        </Button>
      </div>
      
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent text-accent' :'border-transparent text-text-secondary hover:text-primary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'specifications' && renderSpecificationsTab()}
        {activeTab === 'features' && renderFeaturesTab()}
        {activeTab === 'pricing' && renderPricingTab()}
      </div>
    </div>
  );
};

export default VehicleComparison;
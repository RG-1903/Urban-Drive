import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SearchFilters = ({ filters, onFiltersChange, onClearFilters, variant }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const vehicleTypes = [
    { value: 'luxury', label: 'Luxury Cars' },
    { value: 'suv', label: 'SUVs' },
    { value: 'sports', label: 'Sports Cars' },
    { value: 'sedan', label: 'Sedans' },
    { value: 'convertible', label: 'Convertibles' },
    { value: 'electric', label: 'Electric Vehicles' }
  ];

  const transmissionTypes = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' }
  ];

  const fuelTypes = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'diesel', label: 'Diesel' }
  ];

  const luxuryFeatures = [
    { id: 'Leather Seats', label: 'Leather Seats' },
    { id: 'Sunroof', label: 'Sunroof' },
    { id: 'GPS Navigation', label: 'GPS Navigation' },
    { id: 'Premium Audio', label: 'Premium Audio' },
    { id: 'Heated Seats', label: 'Heated Seats' },
    { id: 'Parking Assist', label: 'Parking Assist' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleFeatureToggle = (featureId) => {
    const currentFeatures = filters.luxuryFeatures || [];
    const updatedFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];

    handleFilterChange('luxuryFeatures', updatedFeatures);
  };

  if (filters.variant === 'horizontal') {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            placeholder="Vehicle Type"
            options={vehicleTypes}
            value={filters.vehicleType || ''}
            onChange={(value) => handleFilterChange('vehicleType', value)}
            className="bg-white/50 border-gray-200"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            placeholder="Transmission"
            options={transmissionTypes}
            value={filters.transmission || ''}
            onChange={(value) => handleFilterChange('transmission', value)}
            className="bg-white/50 border-gray-200"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            placeholder="Fuel Type"
            options={fuelTypes}
            value={filters.fuelType || ''}
            onChange={(value) => handleFilterChange('fuelType', value)}
            className="bg-white/50 border-gray-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <Button
              variant="outline"
              iconName="SlidersHorizontal"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`border-gray-200 bg-white/50 ${isExpanded ? 'ring-2 ring-primary/20 border-primary' : ''}`}
            >
              More Filters
            </Button>
            {/* Dropdown for more filters */}
            {isExpanded && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="h-9 text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Features</label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {luxuryFeatures.map((feature) => (
                        <Checkbox
                          key={feature.id}
                          label={feature.label}
                          checked={(filters.luxuryFeatures || []).includes(feature.id)}
                          onChange={() => handleFeatureToggle(feature.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            iconName="RotateCcw"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-lg shadow-gray-100/50 border border-white/50 p-8 sticky top-24 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            <Icon name="Filter" size={20} />
          </div>
          <h3 className="text-xl font-bold text-primary font-accent tracking-tight">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        <Input
          label="Pickup Location"
          type="text"
          placeholder="Enter city or airport code"
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Pickup Date"
            type="date"
            value={filters.pickupDate || ''}
            onChange={(e) => handleFilterChange('pickupDate', e.target.value)}
          />
          <Input
            label="Return Date"
            type="date"
            value={filters.returnDate || ''}
            onChange={(e) => handleFilterChange('returnDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">Price Range (per day)</label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Min $"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max $"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <Select
          label="Vehicle Type"
          placeholder="Select vehicle type"
          options={vehicleTypes}
          value={filters.vehicleType || ''}
          onChange={(value) => handleFilterChange('vehicleType', value)}
        />
      </div>

      <div className="border-t border-border pt-4">
        <Button
          variant="ghost"
          fullWidth
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Advanced Filters
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
            <Select
              label="Transmission"
              placeholder="Select transmission type"
              options={transmissionTypes}
              value={filters.transmission || ''}
              onChange={(value) => handleFilterChange('transmission', value)}
            />

            <Select
              label="Fuel Type"
              placeholder="Select fuel type"
              options={fuelTypes}
              value={filters.fuelType || ''}
              onChange={(value) => handleFilterChange('fuelType', value)}
            />

            <div className="space-y-3">
              <label className="text-sm font-medium text-primary">Luxury Features</label>
              <div className="grid grid-cols-1 gap-2">
                {luxuryFeatures.map((feature) => (
                  <Checkbox
                    key={feature.id}
                    label={feature.label}
                    checked={(filters.luxuryFeatures || []).includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Seating Capacity</label>
              <div className="flex flex-wrap gap-2">
                {[2, 4, 5, 7, 8].map((seats) => (
                  <Button
                    key={seats}
                    variant={filters.seatingCapacity === seats ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange('seatingCapacity', seats)}
                  >
                    {seats} seats
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const API_URL = 'http://localhost:8080/api/v1';

const AdminVehicleForm = ({ vehicle, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Luxury',
    pricePerDay: 0,
    status: 'available',
    year: 2024,
    make: '',
    model: '',
    seats: 4,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    mileage: '10 MPG',
    image: '',
    vin: '',
    licensePlate: '',
    // location: '', // FIXED: Removed
    luxuryFeatures: [],
  });
  
  // const [locationOptions, setLocationOptions] = useState([]); // FIXED: Removed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // const fetchLocations = async () => { // FIXED: Removed this function
    // };
    // fetchLocations(); // FIXED: Removed this call

    // Set form data directly without location
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        category: vehicle.category || 'Luxury',
        pricePerDay: vehicle.pricePerDay || 0,
        status: vehicle.status || 'available',
        year: vehicle.year || 2024,
        make: vehicle.make || '',
        model: vehicle.model || '',
        seats: vehicle.seats || 4,
        transmission: vehicle.transmission || 'Automatic',
        fuelType: vehicle.fuelType || 'Gasoline',
        mileage: vehicle.mileage || '10 MPG',
        image: vehicle.image || '',
        vin: vehicle.vin || '',
        licensePlate: vehicle.licensePlate || '',
        // location: vehicle.location || '', // FIXED: Removed
        luxuryFeatures: vehicle.luxuryFeatures || [],
      });
    }
  }, [vehicle]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature) => {
    // ... (keep this function as-is)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (vehicle) {
        res = await axios.patch(`${API_URL}/vehicles/${vehicle.id}`, formData);
        onSave(res.data.data.vehicle, 'update');
      } else {
        res = await axios.post(`${API_URL}/vehicles`, formData);
        onSave(res.data.data.vehicle, 'create');
      }
      onClose();
    } catch (err) {
      console.error('Failed to save vehicle:', err);
      setError(err.response?.data?.message || 'Failed to save vehicle.');
    } finally {
      setLoading(false);
    }
  };

  const featuresList = [
    // ... (keep this array as-is)
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-cinematic w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          {/* ... (keep header as-is) ... */}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* ... (keep error, name, image, price, make, model, year, seats, category as-is) ... */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* FIXED: Changed grid-cols-3 to 2 */}
            <Select
              label="Transmission"
              value={formData.transmission}
              onChange={(val) => handleChange('transmission', val)}
              options={[
                { value: 'Automatic', label: 'Automatic' },
                { value: 'Manual', label: 'Manual' },
              ]}
            />
            <Select
              label="Fuel Type"
              value={formData.fuelType}
              onChange={(val) => handleChange('fuelType', val)}
              options={[
                { value: 'Gasoline', label: 'Gasoline' },
                { value: 'Electric', label: 'Electric' },
                { value: 'Hybrid', label: 'Hybrid' },
                { value: 'Diesel', label: 'Diesel' },
              ]}
            />
            {/* <Select
              label="Status"
              value={formData.status}
              onChange={(val) => handleChange('status', val)}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'rented', label: 'Rented' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
            /> 
            */}
            {/* FIXED: Moved Status to its own row */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="VIN"
              value={formData.vin}
              onChange={(e) => handleChange('vin', e.target.value)}
            />
            <Input
              label="License Plate"
              value={formData.licensePlate}
              onChange={(e) => handleChange('licensePlate', e.target.value)}
            />
            {/* FIXED: Removed Location Select */}
            {/* <Select
              label="Location"
              value={formData.location}
              onChange={(val) => handleChange('location', val)}
              options={locationOptions}
              placeholder="Select a location"
            /> */}
            <Select
              label="Status"
              value={formData.status}
              onChange={(val) => handleChange('status', val)}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'rented', label: 'Rented' },
                { value: 'maintenance', label: 'Maintenance' },
              ]}
            />
          </div>

          <div>
            {/* ... (keep luxury features as-is) ... */}
          </div>
        </form>

        <div className="flex items-center justify-end p-6 border-t border-border">
          {/* ... (keep footer buttons as-is) ... */}
        </div>
      </div>
    </div>
  );
};

export default AdminVehicleForm;
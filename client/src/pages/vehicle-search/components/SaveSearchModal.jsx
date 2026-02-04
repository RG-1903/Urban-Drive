import React, { useState } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const API_URL = 'http://localhost:8080/api/v1';

const SaveSearchModal = ({ filters, onClose, onSave }) => {
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFilterSummary = () => {
    const parts = [];
    if (filters.location) parts.push(`Location: ${filters.location}`);
    if (filters.vehicleType) parts.push(`Type: ${filters.vehicleType}`);
    if (filters.minPrice || filters.maxPrice) {
      parts.push(`Price: $${filters.minPrice || '0'} - $${filters.maxPrice || 'Any'}`);
    }
    return parts.join(' • ') || 'Current search';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchName) {
      setError('Please provide a name for your search.');
      return;
    }
    
    setLoading(true);
    setError(null);

    const searchData = {
      name: searchName,
      location: filters.location,
      dates: filters.pickupDate ? `${filters.pickupDate} to ${filters.returnDate}` : '',
      category: filters.vehicleType,
      priceRange: filters.minPrice ? `$${filters.minPrice} - $${filters.maxPrice || 'Any'}` : '',
      filters: filters, 
    };

    try {
      const res = await axios.post(`${API_URL}/users/my-favorites/searches`, searchData);
      onSave(res.data.data.favorites.searches);
      onClose();
    } catch (err) {
      console.error('Failed to save search:', err);
      setError(err.response?.data?.message || 'Failed to save search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-cinematic w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Save Search</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <Input
            label="Search Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="e.g., 'LAX Weekend SUVs'"
            required
          />
          <div className="p-3 bg-secondary rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">Search Summary</p>
            <p className="text-sm text-text-secondary">{getFilterSummary()}</p>
          </div>
          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              loading={loading}
              iconName="Bookmark"
              iconPosition="left"
            >
              {loading ? 'Saving...' : 'Save Search'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveSearchModal;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import SaveSearchModal from './SaveSearchModal';

const API_URL = 'http://localhost:8080/api/v1';

const SavedSearches = ({ currentFilters, onLoadSearch }) => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchSavedSearches = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users/my-favorites`);
      setSavedSearches(res.data.data.favorites.searches || []);
    } catch (err) {
      console.error('Failed to fetch saved searches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSearches();
  }, [isAuthenticated]);

  const handleDeleteSearch = async (searchId) => {
    try {
      await axios.delete(`${API_URL}/users/my-favorites/searches/${searchId}`);
      setSavedSearches((prev) => prev.filter((search) => search._id !== searchId));
    } catch (err) {
      console.error('Failed to delete saved search:', err);
    }
  };

  const handleSaveSuccess = (newSearches) => {
    setSavedSearches(newSearches.reverse());
    setIsModalOpen(false);
  };

  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters?.category) parts.push(filters.category.toUpperCase());
    if (filters?.priceRange) parts.push(filters.priceRange);
    return parts.join(' • ') || 'No filters';
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl shadow-cinematic border border-border p-8 text-center">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Bookmark" size={24} color="var(--color-text-secondary)" />
        </div>
        <h4 className="text-lg font-semibold text-primary mb-2">Sign In to View Saved Searches</h4>
        <p className="text-text-secondary mb-4">
          Log in to your account to save and access your frequent searches.
        </p>
        <Link to="/login">
          <Button variant="default" iconName="User" iconPosition="left">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-cinematic border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Bookmark" size={18} color="var(--color-accent)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Saved Searches</h3>
              <p className="text-sm text-text-secondary">Quick access to your frequent searches</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsModalOpen(true)}
          >
            Save Current
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-text-secondary">Loading saved searches...</p>
          ) : savedSearches.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Bookmark" size={24} color="var(--color-text-secondary)" />
              </div>
              <h4 className="text-lg font-semibold text-primary mb-2">No Saved Searches</h4>
              <p className="text-text-secondary mb-4">
                Save your frequent searches for quick access later.
              </p>
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsModalOpen(true)}
              >
                Save Your First Search
              </Button>
            </div>
          ) : (
            savedSearches.map((search) => (
              <div
                key={search._id}
                className="border border-border rounded-xl p-4 hover:shadow-cinematic transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4
                        className="font-semibold text-primary group-hover:text-accent transition-colors cursor-pointer"
                        onClick={() => onLoadSearch(search.filters)}
                      >
                        {search.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="MapPin" size={14} color="var(--color-text-secondary)" />
                      <span className="text-sm text-text-secondary">{search.location || 'Any Location'}</span>
                    </div>

                    <p className="text-sm text-text-secondary mb-3">
                      {getFilterSummary(search)}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={12} />
                        <span>{search.dates || 'Any date'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Search"
                      onClick={() => onLoadSearch(search.filters)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => handleDeleteSearch(search._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" iconName="TrendingUp">
              Popular Searches
            </Button>
            <Button variant="ghost" size="sm" iconName="History">
              Search History
            </Button>
            <Button variant="ghost" size="sm" iconName="Settings">
              Manage Alerts
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SaveSearchModal
          filters={currentFilters}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSuccess}
        />
      )}
    </>
  );
};

export default SavedSearches;
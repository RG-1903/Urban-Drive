import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchResults from './components/SearchResults';
import VehicleComparison from './components/VehicleComparison';
import SavedSearches from './components/SavedSearches';
import { Checkbox } from '../../components/ui/Checkbox';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:8080/api/v1';

const VehicleSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const baseFilters = {
    location: '',
    pickupDate: '',
    returnDate: '',
    vehicleType: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
    luxuryFeatures: [],
    seatingCapacity: null
  };

  const [filters, setFilters] = useState(baseFilters);
  const [vehicles, setVehicles] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [comparedVehicles, setComparedVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState('results');
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

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

  const updateURLParams = (newFilters) => {
    const searchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });
    navigate(`/vehicle-search?${searchParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};
    searchParams.forEach((value, key) => {
      if (key === 'luxuryFeatures') {
        urlFilters[key] = value.split(',');
      } else if (key === 'seatingCapacity' || key === 'minPrice' || key === 'maxPrice') {
        urlFilters[key] = value ? parseInt(value, 10) : null;
      } else {
        urlFilters[key] = value;
      }
    });
    setFilters((prev) => ({ ...prev, ...urlFilters }));
  }, [location.search]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        if (sortBy !== 'relevance') {
          searchParams.set('sort', sortBy);
        }

        const res = await axios.get(`${API_URL}/vehicles?${searchParams.toString()}`);

        // Update vehicles and clear loading state
        setVehicles(res.data.data.vehicles);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch vehicles:', err);
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [location.search, sortBy]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // Debounced price change handler for smooth transitions
  const [priceDebounceTimer, setPriceDebounceTimer] = useState(null);

  const handlePriceChange = (key, value) => {
    if (value < 0) return;

    // Update local state immediately for responsive UI
    setFilters({ ...filters, [key]: value });

    // Clear existing timer
    if (priceDebounceTimer) {
      clearTimeout(priceDebounceTimer);
    }

    // Set new timer to update URL and fetch results after 500ms
    const timer = setTimeout(() => {
      updateURLParams({ ...filters, [key]: value });
    }, 500);

    setPriceDebounceTimer(timer);
  };

  const handleFeatureToggle = (featureId) => {
    const currentFeatures = filters.luxuryFeatures || [];
    const updatedFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];

    handleFiltersChange({ ...filters, luxuryFeatures: updatedFeatures });
  };

  const handleClearFilters = () => {
    setFilters(baseFilters);
    navigate('/vehicle-search', { replace: true });
  };

  const handleAddToComparison = (vehicle) => {
    if (comparedVehicles.length < 3 && !comparedVehicles.find((v) => v.id === vehicle.id)) {
      setComparedVehicles((prev) => [...prev, vehicle]);
      setActiveTab('comparison');
    }
  };

  const handleRemoveFromComparison = (vehicleId) => {
    setComparedVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleClearComparison = () => {
    setComparedVehicles([]);
  };

  const handleLoadSavedSearch = (savedFilters) => {
    const newFilters = {
      ...baseFilters,
      ...savedFilters
    };
    setFilters(newFilters);
    updateURLParams(newFilters);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative pt-24 pb-12 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block py-1 px-3 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-primary/10"
            >
              Premium Fleet
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-primary mb-4 font-accent tracking-tight leading-tight"
            >
              Discover Your Perfect Drive
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Choose from our exclusive collection of luxury vehicles, sports cars, and premium SUVs.
              <span className="block mt-2 text-sm text-gray-500">
                Available for instant booking with flexible pickup locations and competitive daily rates
              </span>
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-primary/5 border border-white/50 p-8 relative z-30">
            <div className="space-y-6">
              {/* Row 1: Primary Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
                <div className="md:col-span-6 relative">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">Pickup Location</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon name="MapPin" size={20} className="text-primary/50 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter city or airport"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      onBlur={() => updateURLParams(filters)}
                      className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black transition-all placeholder:text-gray-400 font-medium text-base"
                    />
                  </div>
                  {/* Vertical Divider for larger screens */}
                  <div className="hidden md:block absolute right-[-12px] top-8 bottom-2 w-[1px] bg-gray-200"></div>
                </div>
                <div className="md:col-span-3 relative">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">Pickup Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.pickupDate}
                      onChange={(e) => handleFiltersChange({ ...filters, pickupDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black transition-all font-medium text-gray-600 text-base"
                    />
                  </div>
                  {/* Vertical Divider for larger screens */}
                  <div className="hidden md:block absolute right-[-12px] top-8 bottom-2 w-[1px] bg-gray-200"></div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filters.returnDate}
                      onChange={(e) => handleFiltersChange({ ...filters, returnDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black transition-all font-medium text-gray-600 text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Horizontal Divider */}
              <div className="w-full h-[1px] bg-gray-200"></div>

              {/* Row 2: Filters & Action */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative">
                <div className="md:col-span-3 relative">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">Vehicle Type</label>
                  <select
                    value={filters.vehicleType || ''}
                    onChange={(e) => handleFiltersChange({ ...filters, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black transition-all font-medium text-gray-600 appearance-none"
                  >
                    <option value="">All Types</option>
                    <option value="luxury">Luxury Cars</option>
                    <option value="suv">SUVs</option>
                    <option value="sports">Sports Cars</option>
                    <option value="sedan">Sedans</option>
                    <option value="convertible">Convertibles</option>
                    <option value="electric">Electric Vehicles</option>
                  </select>
                  {/* Vertical Divider for larger screens */}
                  <div className="hidden md:block absolute right-[-12px] top-2 bottom-2 w-[1px] bg-gray-200"></div>
                </div>

                <div className="md:col-span-4 relative">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2 ml-1">Price Range / Day</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                        className="w-full pl-7 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black transition-all font-medium"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                        className="w-full pl-7 pr-3 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black/20 focus:border-black transition-all font-medium"
                      />
                    </div>
                  </div>
                  {/* Vertical Divider for larger screens */}
                  <div className="hidden md:block absolute right-[-12px] top-2 bottom-2 w-[1px] bg-gray-200"></div>
                </div>

                <div className="md:col-span-2">
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
                      className={`group w-full h-[50px] rounded-xl flex items-center justify-between px-4 border transition-all duration-300 ${isMoreFiltersOpen
                        ? 'bg-black text-white border-black'
                        : 'bg-white/50 text-primary border-black/20 hover:bg-black hover:text-white hover:border-black'
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="SlidersHorizontal" size={18} />
                        <span className="font-medium">Filters</span>
                      </span>
                      <Icon
                        name={isMoreFiltersOpen ? "ChevronUp" : "ChevronDown"}
                        size={16}
                        className={isMoreFiltersOpen ? "text-white" : "text-gray-400 group-hover:text-white"}
                      />
                    </button>

                    {/* Dropdown */}
                    {/* Dropdown */}
                    {isMoreFiltersOpen && (
                      <div className="absolute top-full right-0 mt-4 w-[320px] md:w-[700px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-8 z-[100] animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-lg font-bold text-primary font-accent">Advanced Filters</h3>
                          <button
                            type="button"
                            onClick={() => setIsMoreFiltersOpen(false)}
                            className="h-8 w-8 rounded-full bg-gray-100 hover:bg-red-500 text-gray-500 hover:text-white transition-all duration-300 flex items-center justify-center group hover:scale-110 hover:rotate-90 shadow-md hover:shadow-lg"
                          >
                            <Icon name="X" size={16} className="transition-transform duration-300" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-8">
                            <div className="space-y-4">
                              <label className="flex items-center gap-2 text-xs font-bold text-primary/60 uppercase tracking-widest">
                                <Icon name="Zap" size={14} />
                                Transmission
                              </label>
                              <div className="relative group">
                                <select
                                  value={filters.transmission || ''}
                                  onChange={(e) => handleFiltersChange({ ...filters, transmission: e.target.value })}
                                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all text-sm font-medium appearance-none cursor-pointer text-primary"
                                >
                                  <option value="">Any Transmission</option>
                                  {transmissionTypes.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                  ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                  <Icon name="ChevronDown" size={16} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="flex items-center gap-2 text-xs font-bold text-primary/60 uppercase tracking-widest">
                                <Icon name="Fuel" size={14} />
                                Fuel Type
                              </label>
                              <div className="relative group">
                                <select
                                  value={filters.fuelType || ''}
                                  onChange={(e) => handleFiltersChange({ ...filters, fuelType: e.target.value })}
                                  className="w-full pl-4 pr-10 py-3.5 bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all text-sm font-medium appearance-none cursor-pointer text-primary"
                                >
                                  <option value="">Any Fuel Type</option>
                                  {fuelTypes.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                  ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                                  <Icon name="ChevronDown" size={16} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <label className="flex items-center gap-2 text-xs font-bold text-primary/60 uppercase tracking-widest">
                                <Icon name="Users" size={14} />
                                Seating Capacity
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {[2, 4, 5, 7, 8].map((seats) => (
                                  <button
                                    key={seats}
                                    onClick={() => handleFiltersChange({ ...filters, seatingCapacity: filters.seatingCapacity === seats ? null : seats })}
                                    className={`h-10 px-3 rounded-xl text-sm font-bold transition-all duration-300 border ${filters.seatingCapacity === seats
                                      ? 'bg-black text-white border-black shadow-lg shadow-black/20 transform scale-105'
                                      : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black hover:bg-gray-50'
                                      }`}
                                  >
                                    {seats}+
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="flex items-center gap-2 text-xs font-bold text-primary/60 uppercase tracking-widest mb-2">
                              <Icon name="Star" size={14} />
                              Luxury Features
                            </label>
                            <div className="grid grid-cols-1 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                              {luxuryFeatures.map((feature) => (
                                <div
                                  key={feature.id}
                                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${(filters.luxuryFeatures || []).includes(feature.id)
                                    ? 'bg-black/5 border-black/10'
                                    : 'bg-transparent border-transparent hover:bg-gray-50'
                                    }`}
                                  onClick={() => handleFeatureToggle(feature.id)}
                                >
                                  <Checkbox
                                    label={feature.label}
                                    checked={(filters.luxuryFeatures || []).includes(feature.id)}
                                    onChange={() => { }} // Handled by parent div
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                          <button
                            onClick={handleClearFilters}
                            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-wider"
                          >
                            Reset All
                          </button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setIsMoreFiltersOpen(false)}
                            className="bg-black text-white rounded-xl px-8"
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-3 flex gap-2">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1 h-[50px] rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-lg font-bold bg-black text-white hover:bg-gray-900"
                  >
                    Search
                  </Button>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    title="Clear All Filters"
                    className="h-[50px] w-[50px] rounded-xl bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    <Icon name="RotateCcw" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-4 relative z-20 -mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {activeTab === 'results' && (
              <motion.div
                key={sortBy + vehicles.length}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <SearchResults
                  vehicles={vehicles}
                  isLoading={isLoading}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onAddToComparison={handleAddToComparison}
                />
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <VehicleComparison
                comparedVehicles={comparedVehicles}
                onRemoveVehicle={handleRemoveFromComparison}
                onClearComparison={handleClearComparison}
              />
            )}

            {activeTab === 'saved' && (
              <SavedSearches
                currentFilters={filters}
                onLoadSearch={handleLoadSavedSearch}
              />
            )}
          </div>
        </div>
      </section>

      {comparedVehicles.length > 0 && activeTab !== 'comparison' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white rounded-2xl shadow-cinematic border border-border px-6 py-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="GitCompare" size={20} color="var(--color-accent)" />
              <span className="font-medium text-primary">
                {comparedVehicles.length} vehicle{comparedVehicles.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={() => setActiveTab('comparison')}
            >
              Compare Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleClearComparison}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;
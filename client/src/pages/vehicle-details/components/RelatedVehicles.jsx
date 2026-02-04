import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const RelatedVehicles = ({ currentVehicle }) => {
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentVehicle.category || !currentVehicle.id) return;
      
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/vehicles?category=${currentVehicle.category}&limit=5`);
        const filtered = res.data.data.vehicles.filter(v => v.id !== currentVehicle.id).slice(0, 4);
        setRelatedVehicles(filtered);
      } catch (err) {
        console.error('Failed to fetch related vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelated();
  }, [currentVehicle.id, currentVehicle.category]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={12}
        className={index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-primary">Similar Vehicles</h3>
          <p className="text-text-secondary mt-1">Other {currentVehicle.category}s you might like</p>
        </div>
        <Link to="/vehicle-search">
          <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      
      {loading ? (
         <div className="flex justify-center items-center h-48">
            <Icon name="Loader2" className="animate-spin text-accent" size={32} />
          </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {relatedVehicles.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-secondary rounded-xl overflow-hidden hover:shadow-cinematic transition-all duration-300"
            >
              <div className="absolute top-3 right-3 z-10">
                <div className={`w-3 h-3 rounded-full ${
                  vehicle.availability === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>

              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={vehicle.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-primary group-hover:text-accent transition-colors duration-300 truncate">
                      {vehicle.name}
                    </h4>
                    <p className="text-sm text-text-secondary">{vehicle.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">${vehicle.pricePerDay}</div>
                    <div className="text-xs text-text-secondary">per day</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(vehicle.ratingAverage)}
                  </div>
                  <span className="text-sm font-medium text-primary">{vehicle.ratingAverage}</span>
                  <span className="text-sm text-text-secondary">({vehicle.ratingQuantity})</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {vehicle.luxuryFeatures?.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white rounded-md text-xs text-text-secondary border border-border"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <Link to={`/vehicle-details?id=${vehicle.id}`} className="flex-1">
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      disabled={vehicle.availability === 'unavailable'}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      {vehicle.availability === 'available' ? 'View Details' : 'Unavailable'}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Heart"
                    className="px-3"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <div className="mt-8 p-6 bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-xl border border-accent/20">
        <div className="text-center">
          <h4 className="font-bold text-primary mb-2">Can't find what you're looking for?</h4>
          <p className="text-text-secondary mb-4">
            Browse our complete collection of luxury vehicles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/vehicle-search">
              <Button variant="default" iconName="Search" iconPosition="left">
                Browse All Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedVehicles;
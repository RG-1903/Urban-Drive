import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import axios from 'axios';
import { API_URL } from '../../../utils/config';

const FeaturedCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${API_URL}/vehicles/featured-collections`);
        setCollections(response.data.data.collections);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError('Failed to load collections');
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) return null; // Or show an error state

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Featured Collections</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-accent text-primary mb-6">
            Curated for Excellence
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Discover our handpicked vehicle collections, each designed to meet specific needs and exceed expectations.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8">

          {collections?.map((collection, index) => {

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-cinematic hover:shadow-cinematic-hover transition-all duration-500 flex flex-col h-full">

                {/* Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                    {collection.badge}
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <Image
                    src={collection.image}
                    alt={collection.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Overlay Content */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        {collection.count}+ Vehicles
                      </span>
                      <span className="text-lg font-bold">
                        ${collection.startingPrice}/day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {collection.name}
                  </h3>

                  <p className="text-text-secondary mb-4 font-medium">
                    {collection.subtitle}
                  </p>

                  <p className="text-text-secondary mb-6 leading-relaxed flex-grow">
                    {collection.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {collection.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Icon name="Check" size={16} className="text-accent" />
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-auto">
                    <Link to={`/vehicle-search?category=${collection.name}`} className="flex-1">
                      <Button
                        variant="default"
                        fullWidth
                        iconName="ArrowRight"
                        iconPosition="right"
                        className="group-hover:bg-accent group-hover:text-white transition-colors">
                        Explore
                      </Button>
                    </Link>

                    <Link to="/booking-wizard">
                      <Button
                        variant="outline"
                        iconName="Calendar"
                        className="group-hover:border-accent group-hover:text-accent transition-colors">
                        Book
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16">

          <Link to="/vehicle-search">
            <Button
              variant="outline"
              size="lg"
              iconName="Grid3X3"
              iconPosition="left"
              className="hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
              View All Collections
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
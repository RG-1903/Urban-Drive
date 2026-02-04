import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// Note: Header and Footer are now in MainLayout, not here.
import HeroSection from './components/HeroSection';
import BookingWidget from './components/BookingWidget';
import FeaturedCollections from './components/FeaturedCollections';
import TestimonialsSection from './components/TestimonialsSection';
import TrustSection from './components/TrustSection';
// Footer is also in MainLayout

const Homepage = () => {
  useEffect(() => {
    // Smooth scroll behavior for the page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set page title
    document.title = 'UrbanDrive - Premium Car Rental | Elevate Every Journey';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Experience luxury redefined with UrbanDrive\'s premium car rental fleet. From sleek sports cars to elegant sedans, discover vehicles that transform every drive into an extraordinary experience.');
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Header is now handled by MainLayout in Routes.jsx
      */}
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Trust & Safety Section */}
        <TrustSection />

        {/* Floating Booking Widget */}
        <BookingWidget />
      </main>

      {/* Footer is now handled by MainLayout in Routes.jsx
      */}
    </motion.div>
  );
};

export default Homepage;
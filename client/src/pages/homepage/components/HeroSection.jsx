import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const heroSlides = [
  {
    id: 1,
    title: "Elevate Every Journey",
    subtitle: "Experience luxury redefined with our premium fleet",
    description: "From sleek sports cars to elegant sedans, discover vehicles that transform every drive into an extraordinary experience.",
    image: "https://images.unsplash.com/photo-1630233854114-4292c73398ee",
    alt: "Luxury black sports car on mountain road at sunset with dramatic lighting",
    cta: "Explore Fleet",
    accent: "Premium Collection"
  },
  {
    id: 2,
    title: "Where Luxury Meets Reliability",
    subtitle: "Professional excellence for business travelers",
    description: "Streamlined booking, corporate rates, and vehicles that make the right impression at every business engagement.",
    image: "https://images.unsplash.com/photo-1653227230187-93bcb9a9a8ca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Professional businessman in suit standing next to luxury silver sedan in modern city setting",
    cta: "Business Solutions",
    accent: "Corporate Fleet"
  },
  {
    id: 3,
    title: "Your Perfect Drive Awaits",
    subtitle: "Celebrate life's special moments in style",
    description: "Make weddings, anniversaries, and milestone celebrations unforgettable with our curated selection of luxury vehicles.",
    image: "https://images.unsplash.com/photo-1714620554416-a536c7c5bbfd",
    alt: "Elegant white luxury convertible decorated with flowers for wedding celebration",
    cta: "Special Occasions",
    accent: "Celebration Ready"
  }];


  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides?.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides?.[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-white">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <motion.div
          key={currentSlide}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full h-full">

          <Image
            src={currentSlideData?.image}
            alt={currentSlideData?.alt}
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </motion.div>
      </div>
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white space-y-8">

            {/* Accent Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">

              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{currentSlideData?.accent}</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-5xl lg:text-7xl font-bold font-accent leading-tight">

                {currentSlideData?.title}
              </motion.h1>
              
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-xl lg:text-2xl font-medium text-white/90">

                {currentSlideData?.subtitle}
              </motion.h2>
            </div>

            {/* Description */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-lg text-white/80 leading-relaxed max-w-xl">

              {currentSlideData?.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4">

              <Link to="/vehicle-search">
                <Button
                  variant="default"
                  size="lg"
                  iconName="ArrowRight"
                  iconPosition="right"
                  className="bg-accent hover:bg-accent/90 text-white shadow-cinematic hover:shadow-cinematic-hover">

                  {currentSlideData?.cta}
                </Button>
              </Link>
              
              <Link to="/booking-wizard">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Calendar"
                  iconPosition="left"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-md">

                  Book Now
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex items-center space-x-6 pt-4">

              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-accent" />
                <span className="text-sm text-white/80">Fully Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-accent" />
                <span className="text-sm text-white/80">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Star" size={20} className="text-accent" />
                <span className="text-sm text-white/80">5-Star Rated</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Slide Navigation */}
          <div className="hidden lg:flex flex-col items-end space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Featured Collections</h3>
              <div className="space-y-3">
                {heroSlides?.map((slide, index) =>
                <button
                  key={slide?.id}
                  onClick={() => handleSlideChange(index)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                  index === currentSlide ?
                  'bg-accent text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`
                  }>

                    <div className="text-sm font-medium">{slide?.accent}</div>
                    <div className="text-xs opacity-80">{slide?.subtitle}</div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides?.map((_, index) =>
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentSlide ?
            'bg-accent scale-125' : 'bg-white/40 hover:bg-white/60'}`
            } />

          )}
        </div>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 right-8 flex flex-col items-center space-y-2 text-white/60">

        <span className="text-xs font-medium rotate-90 origin-center">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>

          <Icon name="ChevronDown" size={20} />
        </motion.div>
      </motion.div>
    </section>);

};

export default HeroSection;
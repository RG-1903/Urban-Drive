import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import axios from 'axios';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { API_URL } from '../../../utils/config';

// A component to handle the number animation
const AnimatedStat = ({ target, suffix }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;

      // Animate from 0 to the target number
      const controls = animate(0, target, {
        duration: 2.5, // Slower duration for a smoother feel
        ease: "easeOut", // Smooth stop
        onUpdate(value) {
          // Update the text content of the span
          node.textContent = Math.round(value).toLocaleString();
        }
      });

      return () => controls.stop();
    }
  }, [isInView, target]);

  return (
    <span className="inline-block">
      <span ref={nodeRef}>0</span>
      <span>{suffix}</span>
    </span>
  );
};


const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/reviews`);
        // Filter for featured reviews if you implemented that query param, 
        // or just take the ones marked isFeatured from the response
        const featuredReviews = res.data.data.reviews.filter(r => r.isFeatured);
        setTestimonials(featuredReviews.length > 0 ? featuredReviews : res.data.data.reviews.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const stats = [
    { label: "Happy Customers", target: 50000, suffix: "+", icon: "Users" },
    { label: "5-Star Reviews", target: 98, suffix: "%", icon: "Star" },
    { label: "Cities Served", target: 25, suffix: "+", icon: "MapPin" },
    { label: "Years Experience", target: 12, suffix: "+", icon: "Award" }];


  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  const currentTestimonial = testimonials?.[activeTestimonial];

  if (loading) return null; // Or a loading skeleton

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Icon name="MessageCircle" size={16} className="text-accent" />
            <span className="text-sm font-medium text-accent">Customer Stories</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-accent text-primary mb-6">
            Trusted by Thousands
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Real experiences from real customers who've made Urban Drive their trusted partner for premium transportation.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Testimonial Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6">

                {/* Quote */}
                <div className="relative">
                  <Icon
                    name="Quote"
                    size={48}
                    className="text-accent/20 absolute -top-4 -left-4" />

                  <blockquote className="text-2xl lg:text-3xl font-medium text-primary leading-relaxed pl-8">
                    "{currentTestimonial?.review}"
                  </blockquote>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(currentTestimonial?.rating)]?.map((_, i) =>
                    <Icon key={i} name="Star" size={20} className="text-amber-400 fill-current" />
                  )}
                </div>

                {/* Author Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-xl font-bold text-primary">
                      {currentTestimonial?.user?.firstName} {currentTestimonial?.user?.lastName}
                    </h4>
                    {/* Assuming verified is always true for featured reviews or add a field */}
                    <div className="flex items-center space-x-1 bg-blue-600/10 rounded-full px-2 py-1">
                      <Icon name="CheckCircle" size={14} className="text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Verified</span>
                    </div>
                  </div>
                  <p className="text-text-secondary">
                    {currentTestimonial?.userTitle} at {currentTestimonial?.userCompany}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{currentTestimonial?.userLocation}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Car" size={14} />
                      {/* Assuming experience maps to a category or similar, using static for now or add field */}
                      <span>Business Fleet</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevTestimonial}
                className="p-4 rounded-full bg-white/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:bg-slate-900 hover:border-slate-900 transition-all duration-300 group"
              >
                <Icon name="ChevronLeft" size={24} className="text-primary group-hover:text-white transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextTestimonial}
                className="p-4 rounded-full bg-white/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:bg-slate-900 hover:border-slate-900 transition-all duration-300 group"
              >
                <Icon name="ChevronRight" size={24} className="text-primary group-hover:text-white transition-colors" />
              </motion.button>

              <div className="flex space-x-2 ml-4">
                {testimonials?.map((_, index) =>
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-accent w-8' : 'bg-border w-2 hover:bg-accent/50'}`
                    } />

                )}
              </div>
            </div>
          </motion.div>

          {/* Customer Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative">

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="relative">

                <div className="relative w-full max-w-md mx-auto">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-cinematic">
                    <Image
                      src={currentTestimonial?.user?.avatar}
                      alt={`${currentTestimonial?.user?.firstName} ${currentTestimonial?.user?.lastName}`}
                      className="w-full h-full object-cover" />

                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-primary rounded-2xl p-4 shadow-cinematic">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-foreground">5.0</div>
                      <div className="text-xs font-bold text-primary-foreground">Rating</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {stats?.map((stat, index) =>
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name={stat?.icon} size={24} className="text-accent" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                <AnimatedStat target={stat.target} suffix={stat.suffix} />
              </div>
              <div className="text-text-secondary font-medium">{stat?.label}</div>
            </div>
          )}
        </motion.div>
      </div>
    </section>);

};

export default TestimonialsSection;
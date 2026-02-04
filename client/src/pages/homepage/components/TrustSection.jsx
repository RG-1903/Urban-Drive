import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSection = () => {
  const trustIndicators = [
    {
      icon: "Shield",
      title: "Fully Insured",
      description: "Comprehensive coverage with premium insurance partners",
      details: "Every vehicle comes with full insurance coverage including collision, theft, and liability protection."
    },
    {
      icon: "Clock",
      title: "24/7 Support",
      description: "Round-the-clock assistance whenever you need it",
      details: "Our dedicated support team is available 24/7 to assist with any questions or emergencies."
    },
    {
      icon: "Award",
      title: "Industry Certified",
      description: "Recognized excellence in luxury car rental services",
      details: "Certified by leading automotive and hospitality industry organizations for service excellence."
    },
    {
      icon: "Users",
      title: "Trusted by 50K+",
      description: "Join thousands of satisfied customers worldwide",
      details: "Over 50,000 customers trust us for their premium transportation needs across 25+ cities."
    }];


  const certifications = [
    {
      name: "Better Business Bureau",
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_141b06464-1763038932329.png",
      alt: "Better Business Bureau A+ rating certification logo",
      rating: "A+ Rating"
    },
    {
      name: "ISO 9001 Certified",
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19f42af7b-1763038933653.png",
      alt: "ISO 9001 quality management certification badge",
      rating: "Quality Certified"
    },
    {
      name: "Luxury Travel Association",
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1f20a632d-1763038933209.png",
      alt: "Luxury Travel Association member certification emblem",
      rating: "Premium Member"
    },
    {
      name: "Green Business Certified",
      logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7d1efab-1763038932493.png",
      alt: "Green Business environmental certification logo with leaf symbol",
      rating: "Eco-Friendly"
    }];


  const safetyFeatures = [
    {
      title: "Vehicle Sanitization",
      description: "Professional deep cleaning between every rental",
      icon: "Sparkles"
    },
    {
      title: "Regular Maintenance",
      description: "Comprehensive inspections and preventive care",
      icon: "Settings"
    },
    {
      title: "GPS Tracking",
      description: "Real-time monitoring for enhanced security",
      icon: "MapPin"
    },
    {
      title: "Emergency Assistance",
      description: "Roadside support and emergency response",
      icon: "Phone"
    }];


  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <div className="inline-flex items-center space-x-2 bg-success/10 rounded-full px-4 py-2 mb-6">
            <Icon name="ShieldCheck" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Trust & Safety</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold font-accent text-primary mb-6">
            Your Safety is Our Priority
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience peace of mind with our comprehensive safety measures, industry certifications, and unwavering commitment to excellence.
          </p>
        </motion.div>

        {/* Trust Indicators Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">

          {trustIndicators?.map((indicator, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group hover:bg-slate-50 p-6 rounded-2xl transition-all duration-300">

              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Icon name={indicator?.icon} size={24} className="text-accent" />
              </div>

              <h3 className="text-xl font-bold text-primary mb-2">
                {indicator?.title}
              </h3>

              <p className="text-text-secondary mb-3 font-medium">
                {indicator?.description}
              </p>

              <p className="text-sm text-text-secondary leading-relaxed">
                {indicator?.details}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-slate-50 rounded-3xl p-8 lg:p-12 mb-16">

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Industry Recognition & Certifications
            </h3>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Our commitment to excellence is recognized by leading industry organizations and certification bodies.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications?.map((cert, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 text-center shadow-premium hover:shadow-cinematic transition-all duration-300">

                <div className="w-20 h-12 mx-auto mb-4 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                  <Image
                    src={cert?.logo}
                    alt={cert?.alt}
                    className="w-full h-full object-contain" />

                </div>

                <h4 className="font-semibold text-primary mb-2 text-sm">
                  {cert?.name}
                </h4>

                <div className="inline-flex items-center space-x-1 bg-accent/10 rounded-full px-3 py-1">
                  <Icon name="Award" size={12} className="text-accent" />
                  <span className="text-xs font-medium text-accent">{cert?.rating}</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Safety Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Safety Features List */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-4">
                Comprehensive Safety Measures
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Every aspect of our service is designed with your safety and peace of mind in focus, from vehicle preparation to ongoing support.
              </p>
            </div>

            <div className="space-y-6">
              {safetyFeatures?.map((feature, index) =>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">

                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={feature?.icon} size={20} className="text-success" />
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      {feature?.title}
                    </h4>
                    <p className="text-text-secondary">
                      {feature?.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Safety Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative">

            <div className="relative rounded-3xl overflow-hidden shadow-cinematic">
              <Image
                src="https://images.unsplash.com/photo-1708745427274-d5de5122fd57"
                alt="Professional mechanic in uniform inspecting luxury vehicle engine in modern service bay"
                className="w-full h-96 object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">99.9%</div>
                      <div className="text-xs text-text-secondary">Uptime</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-xs text-text-secondary">Support</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">0</div>
                      <div className="text-xs text-text-secondary">Incidents</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>);

};

export default TrustSection;
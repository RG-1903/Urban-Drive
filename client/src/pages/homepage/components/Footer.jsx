import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Luxury Rentals", path: "/vehicle-search" },
        { name: "Business Fleet", path: "/vehicle-search" },
        { name: "Special Occasions", path: "/vehicle-search" },
        { name: "Long-term Rentals", path: "/vehicle-search" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Partnerships", path: "/partnerships" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", path: "/support" },
        { name: "Contact Us", path: "/support" },
        { name: "Booking Guide", path: "/support" },
        { name: "Cancellation Policy", path: "/cancellation" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Rental Agreement", path: "/rental-terms" },
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "https://facebook.com" },
    { name: "Twitter", icon: "Twitter", url: "https://twitter.com" },
    { name: "Instagram", icon: "Instagram", url: "https://instagram.com" },
    { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-secondary border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Multi-column layout */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">

          {/* Footer Links (Columns 1-4) */}
          {footerSections?.map((section, index) => (
            <div key={index} className="space-y-5">
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                {section?.title}
              </h4>
              <ul className="space-y-3">
                {section?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link?.path}
                      className="text-primary hover:text-accent transition-colors duration-300 text-base font-medium"
                    >
                      {link?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section (Column 5) */}
          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              Get exclusive offers and new vehicle alerts.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-4 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Icon name="ArrowRight" size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-all duration-300 group"
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>

            <div className="text-sm text-text-secondary">
              © {currentYear} UrbanDrive. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
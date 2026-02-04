import React from 'react';
import { Link } from 'react-router-dom';
import AppImage from './AppImage';

// This is the updated layout component
const AuthLayout = ({ 
  children, 
  imageSrc = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8", // Default image
  imageAlt = "Sleek black luxury car interior dashboard",
  title = "Your next journey begins here.",
  description = "Access your account to manage bookings, save favorites, and experience premium travel."
}) => {
  
  const Logo = () => (
    <Link to="/" className="flex items-center justify-start space-x-3 group mb-8">
      <div className="flex flex-col">
        <span className="text-3xl font-medium text-primary font-accent tracking-tight">
          UrbanDrive
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* This grid layout will now size its height based on the content of the
        right column (the form).
      */}
      <div className="w-full max-w-6xl mx-auto lg:grid lg:grid-cols-[1fr,1.2fr] bg-white rounded-2xl shadow-cinematic border border-border overflow-hidden">
        
        {/* FIXED: Left Column (Visual)
          - Added 'h-full' and 'overflow-hidden'.
          - The image is now 'absolute' to fill this container.
          - This container will now be exactly as tall as the form column.
        */}
        <div className="hidden lg:block relative h-full overflow-hidden"> 
          <AppImage 
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-10 flex flex-col justify-end">
            <h2 className="text-4xl font-semibold text-white font-accent mb-4">
              {title}
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              {description}
            </p>
          </div>
        </div>

        {/* FIXED: Right Column (Form)
          - This column's content now defines the height of the entire card.
          - Adjusted padding to be balanced and prevent scrolling.
        */}
        <div className="flex items-center justify-center py-12 px-10 sm:px-16">
          <div className="w-full">
            <div className="flex justify-start">
              <Logo />
            </div>
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
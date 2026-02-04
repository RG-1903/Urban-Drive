import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const VehicleGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Ensure we have an array of valid images
  const validImages = (images || []).filter(img => img && typeof img === 'string' && img.length > 0);

  // If no valid images, use a placeholder
  const displayImages = validImages.length > 0 ? validImages : ['https://placehold.co/1200x800?text=No+Image+Available'];

  if (displayImages.length === 0) return null;


  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {/* CAROUSEL LAYOUT */}
      <div className="relative group w-full aspect-video md:aspect-[21/9] bg-slate-100 rounded-3xl overflow-hidden shadow-lg">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => openLightbox(currentIndex)}
          >
            <Image
              src={displayImages[currentIndex]}
              alt={`Vehicle View ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 hover:scale-110"
            >
              <Icon name="ChevronRight" size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'w-8 bg-white'
                    : 'bg-white/50 hover:bg-white/80'
                    }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(currentIndex);
          }}
          className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
        >
          <Icon name="Maximize2" size={16} />
          <span>View All</span>
        </button>
      </div>

      {/* LIGHTBOX (Shared) */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors"
            >
              <Icon name="X" size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
              }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
            >
              <Icon name="ChevronLeft" size={40} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev + 1) % displayImages.length);
              }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all"
            >
              <Icon name="ChevronRight" size={40} />
            </button>

            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl max-h-[85vh] w-full h-full p-4 flex items-center justify-center pointer-events-none"
            >
              <Image
                src={displayImages[selectedImage]}
                alt="Lightbox View"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto"
              />
            </motion.div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/90 font-bold tracking-widest bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
              {selectedImage + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleGallery;
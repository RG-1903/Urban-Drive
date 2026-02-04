import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import AiChatSection from '../../../components/AiChatSection';

const BookingWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
          {/* Chat Popup */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-[400px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-2xl overflow-hidden"
              >
                <AiChatSection className="h-[500px] border-none shadow-none rounded-2xl" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="bg-black text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative group"
          >
            <div className="relative z-10">
              {isOpen ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  className="group-hover:text-red-500 transition-colors"
                >
                  <Icon name="X" size={24} />
                </motion.div>
              ) : (
                <Icon name="Sparkles" size={24} className="animate-pulse-slow" />
              )}
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg group-hover:bg-accent/40 transition-colors" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingWidget;
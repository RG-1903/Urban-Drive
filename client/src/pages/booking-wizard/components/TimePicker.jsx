import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TimePicker = ({ label, value, onChange, icon, className, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Generate time slots (30 min intervals)
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            timeSlots.push(`${hour}:${minute}`);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (time) => {
        onChange({ target: { name: 'time', value: time } });
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-semibold text-primary mb-2 ml-1">
                    {label}
                </label>
            )}

            <div
                className={`
          relative w-full bg-white border rounded-xl px-3 py-3.5 text-primary cursor-pointer
          transition-all duration-300 flex items-center justify-between
          ${isOpen ? 'border-black ring-1 ring-black/5' : 'border-border hover:border-gray-400'}
          ${className}
        `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2.5">
                    {icon && <Icon name={icon} size={18} className="text-text-secondary" />}
                    <span className={value ? 'text-primary font-medium' : 'text-muted-foreground'}>
                        {value || 'Select Time'}
                    </span>
                </div>
                <Icon name="ChevronDown" size={16} className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full mt-2 w-full min-w-full bg-white/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-cinematic z-[60] max-h-60 overflow-y-auto custom-scrollbar`}
                        style={{
                            right: align === 'right' ? 0 : 'auto',
                            left: align === 'left' ? 0 : 'auto'
                        }}
                    >
                        <div className="p-2 grid grid-cols-1 gap-2">
                            {timeSlots.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleSelect(time)}
                                    className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${value === time
                                            ? 'bg-primary text-white shadow-md scale-105'
                                            : 'text-text-secondary hover:bg-secondary hover:text-primary hover:scale-105'
                                        }
                  `}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimePicker;

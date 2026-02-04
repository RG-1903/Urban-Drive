import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border rounded-full -z-10" />

        {/* Active Progress Bar */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary rounded-full -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative group">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-primary)' : 'var(--color-background)',
                  borderColor: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-primary)' : 'var(--color-border)',
                  scale: isActive ? 1.2 : 1
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 z-10 ${isActive ? 'shadow-[0_0_15px_rgba(0,0,0,0.2)]' : ''
                  }`}
              >
                {isCompleted ? (
                  <Icon name="Check" className="text-primary-foreground" size={14} strokeWidth={3} />
                ) : (
                  <Icon
                    name={step.icon}
                    className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
                    size={14}
                  />
                )}
              </motion.div>

              <div className="absolute top-10 w-24 text-center">
                <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-primary' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'
                  }`}>
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
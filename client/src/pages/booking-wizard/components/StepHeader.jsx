import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const StepHeader = ({ title, description, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mb-10 pt-2"
    >
      {onBack && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-8 left-0"
        >
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={onBack}
            className="text-muted-foreground hover:text-primary pl-0 hover:bg-transparent"
          >
            Back to previous step
          </Button>
        </motion.div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold font-accent text-primary mb-3 tracking-tight">
        {title}
      </h2>
      <div className="h-1 w-20 bg-accent rounded-full mb-4" />
      <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default StepHeader;
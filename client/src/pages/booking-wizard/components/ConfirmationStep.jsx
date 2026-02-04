import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationStep = ({ bookingData }) => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      >
        <Icon name="Check" className="text-primary-foreground" size={48} strokeWidth={3} />
      </motion.div>

      <h2 className="text-5xl font-serif font-bold text-foreground mb-6">Confirmed</h2>
      <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
        Your <span className="text-foreground font-bold">{bookingData.vehicle?.name}</span> awaits. We've sent the details to your email.
      </p>

      <div className="bg-card rounded-3xl p-8 max-w-md mx-auto mb-12 border border-border backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-border">
          <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Reference</span>
          <span className="font-mono font-bold text-foreground text-lg tracking-wider">{bookingData.payment?.bookingId || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Total Paid</span>
          <span className="font-serif font-bold text-3xl text-foreground">${bookingData.payment?.amount}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/user-dashboard">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold shadow-sm hover:bg-primary/90 transition-all text-sm">
            Go to Dashboard
          </button>
        </Link>
        <Link to="/">
          <button className="px-6 py-3 bg-transparent border border-border text-foreground rounded-lg font-bold hover:bg-secondary transition-all text-sm">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationStep;
import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import { cn } from '../../lib/utils';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  iconName,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:!outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-95 tracking-wide focus:!ring-0 outline-none ring-0 focus-visible:!ring-0 focus-visible:!outline-none";

  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl border border-transparent",
    outline: "bg-transparent text-primary border-2 border-border hover:border-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-text-secondary hover:text-primary hover:bg-secondary/50 border border-transparent",
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 shadow-sm",
    destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-md",
    accent: "bg-accent text-white hover:bg-accent/90 shadow-lg"
  };

  const sizes = {
    xs: "text-xs px-3 py-1.5 rounded-lg",
    sm: "text-sm px-5 py-2.5 rounded-full",
    md: "text-sm px-6 py-3 rounded-full",
    lg: "text-base px-8 py-4 rounded-full",
    icon: "p-2 aspect-square rounded-full",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading ? (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          className="mr-2"
        >
          <Icon name="Loader2" size={18} className="animate-spin" />
        </motion.div>
      ) : null}

      {!loading && iconName && iconPosition === 'left' && (
        <span className="mr-2">
          <Icon name={iconName} size={size === 'lg' ? 20 : 18} />
        </span>
      )}

      <span className="relative z-10 truncate">{children}</span>

      {!loading && iconName && iconPosition === 'right' && (
        <span className="ml-2">
          <Icon name={iconName} size={size === 'lg' ? 20 : 18} />
        </span>
      )}
    </motion.button>
  );
};

export default Button;
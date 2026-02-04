import React from 'react';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, size = 24, color, className, strokeWidth = 2, ...props }) => {
  // Fallback to 'HelpCircle' if icon name doesn't exist
  const LucideIcon = LucideIcons[name] || LucideIcons.HelpCircle;

  return (
    <LucideIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
};

export default Icon;
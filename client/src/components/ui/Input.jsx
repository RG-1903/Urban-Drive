import React from 'react';
import Icon from '../AppIcon';

const Input = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-semibold text-primary mb-2 ml-1"
        >
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors">
            <Icon name={icon} size={18} />
          </div>
        )}

        <input
          type={type}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full bg-white border rounded-xl px-3 py-3.5 text-primary placeholder:text-muted-foreground/60
            transition-all duration-300 outline-none
            focus:border-black focus:ring-1 focus:ring-black/5
            disabled:bg-secondary disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${type === 'date' ? 'w-full min-w-[140px]' : ''}
            ${error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/10'
              : 'border-border hover:border-gray-400'
            }
          `}
          {...props}
        />
      </div>

      {error && (
        <div className="flex items-center mt-2 ml-1 text-xs text-destructive font-medium animate-slide-up">
          <Icon name="AlertCircle" size={12} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
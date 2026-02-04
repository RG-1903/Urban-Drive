import React from 'react';
import Icon from '../AppIcon';

export const Checkbox = ({ id, label, checked, onChange, error }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-start space-x-3">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id}
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-border transition-all checked:!border-black checked:!bg-black hover:border-black/50 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
            checked={checked}
            onChange={onChange}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
            <Icon name="Check" size={12} strokeWidth={4} />
          </div>
        </div>
        <label
          htmlFor={id}
          className="text-sm leading-relaxed text-text-secondary cursor-pointer select-none"
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 ml-8 text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
};
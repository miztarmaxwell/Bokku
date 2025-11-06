import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => {
  return (
    <label htmlFor="notification-toggle" className="flex items-center cursor-pointer">
      <span className="mr-3 text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <input 
          id="notification-toggle"
          type="checkbox" 
          className="sr-only" 
          checked={enabled} 
          onChange={(e) => onChange(e.target.checked)} 
        />
        <div className={`block w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};

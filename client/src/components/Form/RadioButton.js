import React from 'react';

const RadioButton = ({ 
  label, 
  name, 
  value, 
  checked, 
  onChange, 
  error,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`mb-2 ${className}`}>
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        />
        <span className={`ml-2 text-sm text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RadioButton;

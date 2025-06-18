import React from 'react';

const InputField = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  className = "" 
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full border border-gray-300 rounded px-2 py-1 ${className}`}
  />
);

export default InputField;
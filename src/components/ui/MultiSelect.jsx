import React from 'react';
import Select from 'react-select';

const MultiSelect = ({ 
  options = [], 
  value = [], 
  onChange = () => {}, 
  placeholder = "Select options...",
  isDisabled = false,
  className = "",
  ...props 
}) => {
  // Convert options to react-select format if needed
  const formattedOptions = options.map(option => ({
    value: option.value || option.id,
    label: option.label || option.name || `${option.firstName || ''} ${option.lastName || ''}`.trim()
  }));

  // Convert value to react-select format
  const formattedValue = value.map(val => {
    const option = formattedOptions.find(opt => opt.value === val);
    return option || { value: val, label: val };
  });

  const handleChange = (selectedOptions) => {
    if (selectedOptions) {
      const selectedValues = selectedOptions.map(option => option.value);
      onChange(selectedValues);
    } else {
      onChange([]);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
      borderRadius: '6px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#3730a3',
      fontSize: '14px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#c7d2fe',
        color: '#3730a3',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '14px',
    }),
  };

  return (
    <div className={`w-full ${className}`}>
      <Select
        isMulti
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        {...props}
      />
    </div>
  );
};

export default MultiSelect;

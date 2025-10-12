import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ThemePreferencesSection = ({ themeSettings, onUpdateTheme }) => {
  const [currentTheme, setCurrentTheme] = useState(themeSettings?.theme);
  const [previewTheme, setPreviewTheme] = useState(null);
  const [accessibilitySettings, setAccessibilitySettings] = useState(themeSettings?.accessibility);

  const themeOptions = [
    {
      id: 'light',
      name: 'Light Theme',
      description: 'Clean and bright interface',
      icon: 'Sun',
      preview: {
        bg: 'bg-white',
        card: 'bg-gray-50',
        text: 'text-gray-900',
        accent: 'bg-blue-500'
      }
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      description: 'Easy on the eyes in low light',
      icon: 'Moon',
      preview: {
        bg: 'bg-gray-900',
        card: 'bg-gray-800',
        text: 'text-white',
        accent: 'bg-blue-400'
      }
    },
    {
      id: 'auto',
      name: 'Auto (System)',
      description: 'Follows your system preference',
      icon: 'Monitor',
      preview: {
        bg: 'bg-gradient-to-r from-white to-gray-900',
        card: 'bg-gradient-to-r from-gray-50 to-gray-800',
        text: 'text-gray-600',
        accent: 'bg-blue-500'
      }
    }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small (14px)' },
    { value: 'medium', label: 'Medium (16px)' },
    { value: 'large', label: 'Large (18px)' },
    { value: 'extra-large', label: 'Extra Large (20px)' }
  ];

  const contrastOptions = [
    { value: 'normal', label: 'Normal Contrast' },
    { value: 'high', label: 'High Contrast' },
    { value: 'extra-high', label: 'Extra High Contrast' }
  ];

  const colorSchemeOptions = [
    { value: 'blue', label: 'Blue (Default)', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' }
  ];

  useEffect(() => {
    // Apply theme preview
    if (previewTheme) {
      document.documentElement?.setAttribute('data-theme-preview', previewTheme);
    } else {
      document.documentElement?.removeAttribute('data-theme-preview');
    }

    return () => {
      document.documentElement?.removeAttribute('data-theme-preview');
    };
  }, [previewTheme]);

  const handleThemeSelect = (themeId) => {
    setCurrentTheme(themeId);
    onUpdateTheme({
      ...themeSettings,
      theme: themeId
    });
  };

  const handleAccessibilityChange = (key, value) => {
    const updatedSettings = {
      ...accessibilitySettings,
      [key]: value
    };
    setAccessibilitySettings(updatedSettings);
    onUpdateTheme({
      ...themeSettings,
      accessibility: updatedSettings
    });
  };

  const startPreview = (themeId) => {
    setPreviewTheme(themeId);
  };

  const stopPreview = () => {
    setPreviewTheme(null);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      theme: 'light',
      accessibility: {
        fontSize: 'medium',
        contrast: 'normal',
        colorScheme: 'blue',
        reduceMotion: false,
        highContrast: false,
        largeText: false,
        focusIndicators: true
      }
    };
    
    setCurrentTheme(defaultSettings?.theme);
    setAccessibilitySettings(defaultSettings?.accessibility);
    onUpdateTheme(defaultSettings);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="Palette" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Theme & Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize the look and feel of your interface</p>
          </div>
        </div>
        
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
      {/* Theme Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Theme Selection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions?.map((theme) => (
            <div
              key={theme?.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                currentTheme === theme?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => handleThemeSelect(theme?.id)}
              onMouseEnter={() => startPreview(theme?.id)}
              onMouseLeave={stopPreview}
            >
              {/* Theme Preview */}
              <div className={`w-full h-24 rounded-lg mb-3 ${theme?.preview?.bg} border border-border overflow-hidden`}>
                <div className="h-full flex">
                  <div className={`flex-1 ${theme?.preview?.card} p-2`}>
                    <div className={`w-full h-2 ${theme?.preview?.accent} rounded mb-1`} />
                    <div className={`w-3/4 h-1 ${theme?.preview?.text} opacity-20 rounded`} />
                    <div className={`w-1/2 h-1 ${theme?.preview?.text} opacity-20 rounded mt-1`} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name={theme?.icon} size={20} className="text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">{theme?.name}</div>
                  <div className="text-xs text-muted-foreground">{theme?.description}</div>
                </div>
              </div>
              
              {currentTheme === theme?.id && (
                <div className="absolute top-2 right-2">
                  <Icon name="Check" size={16} className="text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Color Scheme */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Accent Color</h3>
        <div className="grid grid-cols-5 gap-3">
          {colorSchemeOptions?.map((scheme) => (
            <button
              key={scheme?.value}
              onClick={() => handleAccessibilityChange('colorScheme', scheme?.value)}
              className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                accessibilitySettings?.colorScheme === scheme?.value
                  ? 'border-primary' :'border-border hover:border-primary/50'
              }`}
            >
              <div className={`w-8 h-8 ${scheme?.color} rounded-full mx-auto mb-2`} />
              <div className="text-xs text-foreground">{scheme?.label?.split(' ')?.[0]}</div>
              
              {accessibilitySettings?.colorScheme === scheme?.value && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Accessibility Settings */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Accessibility Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Font Size"
              description="Adjust text size for better readability"
              options={fontSizeOptions}
              value={accessibilitySettings?.fontSize}
              onChange={(value) => handleAccessibilityChange('fontSize', value)}
            />
            
            <Select
              label="Contrast Level"
              description="Increase contrast for better visibility"
              options={contrastOptions}
              value={accessibilitySettings?.contrast}
              onChange={(value) => handleAccessibilityChange('contrast', value)}
            />
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Reduce Motion"
              description="Minimize animations and transitions"
              checked={accessibilitySettings?.reduceMotion}
              onChange={(e) => handleAccessibilityChange('reduceMotion', e?.target?.checked)}
            />
            
            <Checkbox
              label="Enhanced Focus Indicators"
              description="Show clearer focus outlines for keyboard navigation"
              checked={accessibilitySettings?.focusIndicators}
              onChange={(e) => handleAccessibilityChange('focusIndicators', e?.target?.checked)}
            />
            
            <Checkbox
              label="Large Text Mode"
              description="Increase text size across the interface"
              checked={accessibilitySettings?.largeText}
              onChange={(e) => handleAccessibilityChange('largeText', e?.target?.checked)}
            />
            
            <Checkbox
              label="High Contrast Mode"
              description="Use high contrast colors for better visibility"
              checked={accessibilitySettings?.highContrast}
              onChange={(e) => handleAccessibilityChange('highContrast', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Preview Notice */}
      {previewTheme && (
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Eye" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Previewing {themeOptions?.find(t => t?.id === previewTheme)?.name}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Click on a theme to apply it permanently
          </p>
        </div>
      )}
      {/* Theme Information */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Theme Information</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Theme changes apply immediately across all pages</li>
          <li>• Auto theme follows your system's dark/light mode setting</li>
          <li>• Accessibility settings help improve usability for all users</li>
          <li>• High contrast mode may override some custom colors</li>
          <li>• Settings are saved to your browser and synced across devices</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemePreferencesSection;
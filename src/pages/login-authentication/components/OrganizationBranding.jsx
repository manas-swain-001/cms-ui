import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const OrganizationBranding = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Secure Authentication',
      description: 'JWT-based security with biometric verification'
    },
    {
      icon: 'MapPin',
      title: 'Geofenced Attendance',
      description: 'Location-based check-in with 300m radius validation'
    },
    {
      icon: 'Users',
      title: 'Multi-Office Support',
      description: 'Seamless operations across multiple locations'
    },
    {
      icon: 'Smartphone',
      title: 'Offline Capability',
      description: 'Continue working even without internet connection'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '2,500+', icon: 'Users' },
    { label: 'Office Locations', value: '12', icon: 'Building2' },
    { label: 'Daily Check-ins', value: '5,000+', icon: 'Clock' },
    { label: 'Uptime', value: '99.9%', icon: 'Activity' }
  ];

  return (
    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Company Logo & Info */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icon name="Zap" size={40} className="text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">SmartXAlgo CRM</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Enterprise Customer Relationship Management Platform
          </p>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto" />
        </div>

        {/* Hero Image */}
        <div className="mb-12 relative">
          <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-8">
            <div className="w-full h-full bg-card rounded-xl shadow-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="BarChart3" size={64} className="text-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Real-time Business Analytics</p>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg">
            <Icon name="Check" size={20} className="text-success-foreground" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-warning rounded-full flex items-center justify-center shadow-lg">
            <Icon name="Zap" size={20} className="text-warning-foreground" />
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-6 mb-12">
          <h3 className="text-xl font-semibold text-foreground text-center mb-8">
            Why Choose SmartXAlgo?
          </h3>
          {features?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name={feature?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">{feature?.title}</h4>
                <p className="text-sm text-muted-foreground">{feature?.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats?.map((stat, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name={stat?.icon} size={16} className="text-primary" />
              </div>
              <div className="text-lg font-bold text-foreground">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Shield" size={12} className="text-success" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Icon name="Lock" size={12} className="text-success" />
              <span>GDPR Compliant</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Trusted by 500+ organizations across India
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationBranding;
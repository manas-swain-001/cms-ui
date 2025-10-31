import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Button from '../Button';
import { useGlobalContext } from 'context';
import secureStorage from 'hooks/secureStorage';
import { disconnectSocket } from 'socket';

const offices = [
    { id: 1, name: 'Bhubaneswar Office', address: 'Bhubaneswar', status: 'active' },
];

const Header = () => {

    const [isOfficeDropdownOpen, setIsOfficeDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState('Bhubaneswar Office');

    const officeDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const navigate = useNavigate();

    // Global context - Must be destructured BEFORE using its values
    const { 
        setIsLoggedIn, 
        userDataContext: user, 
        userProfile,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    } = useGlobalContext();

    // Use real notification count from context, fallback to 0
    const notificationCount = unreadCount || 0;

    // Use notifications from global context (populated from socket)
    // Fallback to empty array if not available
    const displayNotifications = notifications || [];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (officeDropdownRef?.current && !officeDropdownRef?.current?.contains(event?.target)) {
                setIsOfficeDropdownOpen(false);
            }
            if (userDropdownRef?.current && !userDropdownRef?.current?.contains(event?.target)) {
                setIsUserDropdownOpen(false);
            }
            if (notificationRef?.current && !notificationRef?.current?.contains(event?.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userFullName = useMemo(() => {
        return (
            [userProfile?.firstName, userProfile?.lastName]
                ?.filter(Boolean) // remove undefined / empty strings
                ?.join(' ') // join into "First Last"
                ?.trim() // clean up extra spaces
        )
    }, [userProfile]);


    const shortName = useMemo(() => {
        return (
            [userProfile?.firstName, userProfile?.lastName]
                ?.filter(Boolean)
                ?.join(' ')
                ?.split(' ')
                ?.map(n => n?.[0])
                ?.join('')
                ?.toUpperCase()
        )
    }, [userProfile])

    const handleOfficeSelect = (office) => {
        setSelectedOffice(office?.name);
        setIsOfficeDropdownOpen(false);
    };

    const handleNotificationClick = (notification) => {
        // Mark notification as read when clicked
        if (notification?.id && markAsRead) {
            markAsRead(notification.id);
        }
        setIsNotificationOpen(false);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'attendance': return 'Clock';
            case 'task': return 'CheckSquare';
            case 'system': return 'Settings';
            default: return 'Bell';
        }
    };

    const handleSignOut = () => {
        // Disconnect socket before logging out
        disconnectSocket();
        
        secureStorage.removeItem('authToken');
        secureStorage.removeItem('userData');
        secureStorage.removeItem('userRole');
        secureStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        navigate('/login-authentication');
    };

    const handleProfileSettings = () => {
        navigate('/user-profile-management');
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-200">
            <div className="flex items-center justify-between h-full px-6">
                {/* Left Section - Office Selector */}
                <div className="flex items-center space-x-4">
                    <div className="relative" ref={officeDropdownRef}>
                        <Button
                            variant="ghost"
                            onClick={() => setIsOfficeDropdownOpen(!isOfficeDropdownOpen)}
                            className="flex items-center space-x-2 text-sm font-medium"
                        >
                            <Icon name="Building2" size={16} />
                            <span>{selectedOffice}</span>
                            <Icon name="ChevronDown" size={14} />
                        </Button>

                        {isOfficeDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                                <div className="p-3 border-b border-border">
                                    <h3 className="text-sm font-medium text-foreground">Select Office Location</h3>
                                </div>
                                <div className="py-2">
                                    {offices?.map((office) => (
                                        <button
                                            key={office?.id}
                                            onClick={() => handleOfficeSelect(office)}
                                            className="w-full px-4 py-3 text-left hover:bg-muted transition-colors duration-200 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="text-sm font-medium text-foreground">{office?.name}</div>
                                                <div className="text-xs text-muted-foreground">{office?.address}</div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${office?.status === 'active' ? 'bg-success' : 'bg-warning'}`} />
                                                {selectedOffice === office?.name && (
                                                    <Icon name="Check" size={14} className="text-primary" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section - Notifications and User */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="relative"
                        >
                            <Icon name="Bell" size={20} />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </Button>

                        {isNotificationOpen && (
                            <div className="absolute top-full right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                                <div className="p-4 border-b border-border">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-foreground">Notifications</h3>
                                        <Button variant="ghost" size="sm" className="text-xs">
                                            Mark all read
                                        </Button>
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {displayNotifications?.length > 0 ? (
                                        displayNotifications?.slice(0, 10).map((notification) => {
                                            // Format timestamp
                                            const formatTime = (timestamp) => {
                                                if (!timestamp) return 'Just now';
                                                const date = new Date(timestamp);
                                                const now = new Date();
                                                const diffMs = now - date;
                                                const diffMins = Math.floor(diffMs / 60000);
                                                const diffHours = Math.floor(diffMins / 60);
                                                
                                                if (diffMins < 1) return 'Just now';
                                                if (diffMins < 60) return `${diffMins}m ago`;
                                                if (diffHours < 24) return `${diffHours}h ago`;
                                                return date.toLocaleDateString();
                                            };
                                            
                                            return (
                                                <button
                                                    key={notification?.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full p-4 text-left hover:bg-muted transition-colors duration-200 border-b border-border last:border-b-0 ${!notification?.read ? 'bg-muted/50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification?.type === 'attendance' ? 'bg-warning/10 text-warning' :
                                                            notification?.type === 'task' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                            <Icon name={getNotificationIcon(notification?.type)} size={14} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium text-foreground truncate">
                                                                    {notification?.title}
                                                                </p>
                                                                {!notification?.read && (
                                                                    <div className="w-2 h-2 bg-primary rounded-full ml-2" />
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-1">{notification?.message}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {formatTime(notification?.timestamp)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="p-4 text-center text-muted-foreground text-sm">
                                            No notifications
                                        </div>
                                    )}
                                </div>
                                {displayNotifications?.length > 0 && (
                                    <div className="p-3 border-t border-border">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            fullWidth
                                            onClick={() => {
                                                if (markAllAsRead) {
                                                    markAllAsRead();
                                                }
                                            }}
                                        >
                                            Mark all as read
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative" ref={userDropdownRef}>
                        <Button
                            variant="ghost"
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center space-x-3 px-3 py-2"
                        >
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-foreground">
                                    {shortName}
                                </span>
                            </div>
                            <div className="text-left hidden md:block">
                                <div className="text-sm font-medium text-foreground">{userFullName}</div>
                                <div className="text-xs text-muted-foreground">{user?.role}</div>
                            </div>
                            <Icon name="ChevronDown" size={14} />
                        </Button>

                        {isUserDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg animate-fade-in">
                                <div className="p-4 border-b border-border">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary-foreground">
                                                {shortName}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-foreground">{userFullName}</div>
                                            <div className="text-xs text-muted-foreground">{userProfile?.email}</div>
                                            <div className="text-xs text-primary font-medium">{user?.role}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    <button onClick={handleProfileSettings} className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                                        <Icon name="User" size={16} />
                                        <span>Profile Settings</span>
                                    </button>
                                    <button onClick={handleProfileSettings} className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                                        <Icon name="Settings" size={16} />
                                        <span>Preferences</span>
                                    </button>
                                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3">
                                        <Icon name="HelpCircle" size={16} />
                                        <span>Help & Support</span>
                                    </button>
                                </div>
                                <div className="py-2 border-t border-border">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors duration-200 flex items-center space-x-3 text-error"
                                    >
                                        <Icon name="LogOut" size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
import { useState, useEffect, useCallback } from "react";
import secureStorage from "hooks/secureStorage";
import { getSocket } from "socket";

const NOTIFICATIONS_STORAGE_KEY = 'notifications';
const MAX_NOTIFICATIONS = 100; // Limit stored notifications

export default function useNotifications() {
    // Load notifications from localStorage on mount
    const storedNotifications = secureStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || [];
    
    const [notifications, setNotifications] = useState(storedNotifications);
    const [unreadCount, setUnreadCount] = useState(0);

    // Calculate unread count
    useEffect(() => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    // Persist notifications to localStorage whenever they change
    useEffect(() => {
        if (notifications.length > 0) {
            // Keep only the most recent notifications
            const recentNotifications = notifications.slice(-MAX_NOTIFICATIONS);
            secureStorage.setItem(NOTIFICATIONS_STORAGE_KEY, recentNotifications);
        }
    }, [notifications]);

    // Add new notification
    const addNotification = useCallback((notification) => {
        const newNotification = {
            ...notification,
            id: notification.id || `notif-${Date.now()}-${Math.random()}`,
            timestamp: notification.timestamp || new Date().toISOString(),
            read: notification.read || false
        };

        setNotifications(prev => {
            // Prevent duplicates based on id
            const exists = prev.find(n => n.id === newNotification.id);
            if (exists) return prev;
            
            // Add to the beginning of the array (most recent first)
            return [newNotification, ...prev].slice(0, MAX_NOTIFICATIONS);
        });
    }, []);

    // Mark notification as read
    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    }, []);

    // Remove notification
    const removeNotification = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.filter(notification => notification.id !== notificationId)
        );
    }, []);

    // Clear all notifications
    const clearAll = useCallback(() => {
        setNotifications([]);
        secureStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    }, []);

    // Setup socket listener for notifications
    useEffect(() => {
        const handleNotification = (notification) => {
            // Expected format from backend:
            // Single object (NOT array, NOT string):
            // {
            //   id: string (required),
            //   title: string (required),
            //   message: string (required),
            //   type?: string (optional: 'attendance', 'task', 'system', etc.),
            //   timestamp?: string (optional: ISO 8601, auto-added if missing),
            //   read?: boolean (optional: defaults to false),
            //   data?: object (optional: any additional data)
            // }
            console.log('📬 New notification received:', notification);
            
            // Validate it's an object
            if (!notification || typeof notification !== 'object' || Array.isArray(notification)) {
                console.error('❌ Invalid notification format. Expected object, got:', typeof notification);
                return;
            }
            
            addNotification(notification);
        };

        // Function to setup listener on socket
        const setupListener = (socketInstance) => {
            if (!socketInstance) return;
            
            // Remove existing listener to avoid duplicates
            socketInstance.off('notification', handleNotification);
            
            // Add new listener
            socketInstance.on('notification', handleNotification);
            console.log('✅ Notification listener registered');
        };

        // Try to get socket immediately
        let socket = getSocket();
        
        // If socket exists, setup listener
        if (socket) {
            setupListener(socket);
        }

        // Also listen for when socket becomes available later
        // Check periodically (in case socket initializes after hook mounts)
        // Stop polling once we've successfully set up listener on a connected socket
        const checkInterval = setInterval(() => {
            const currentSocket = getSocket();
            if (currentSocket) {
                if (!socket || currentSocket !== socket) {
                    socket = currentSocket;
                    setupListener(socket);
                }
                // If socket is connected and we have listener, we can stop polling
                if (socket.connected) {
                    clearInterval(checkInterval);
                }
            }
        }, 2000); // Check every 2 seconds

        // Also listen for socket connection event
        const connectHandler = () => {
            const currentSocket = getSocket();
            if (currentSocket) {
                setupListener(currentSocket);
                clearInterval(checkInterval); // Stop polling once connected
            }
        };

        if (socket) {
            socket.once('connect', connectHandler);
        }

        // Cleanup on unmount
        return () => {
            clearInterval(checkInterval);
            const currentSocket = getSocket();
            if (currentSocket) {
                currentSocket.off('notification', handleNotification);
                currentSocket.off('connect', connectHandler);
            }
        };
    }, [addNotification]);

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        setNotifications
    };
}


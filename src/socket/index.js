import { io } from 'socket.io-client';
import secureStorage from 'hooks/secureStorage';
import { baseUrl } from 'constant';

let socket = null;

/**
 * Initialize and connect socket to the backend
 * Should be called after user login
 */
export const initSocket = () => {
    // If socket already exists and is connected, return it
    if (socket?.connected) {
        return socket;
    }

    // Get token from secure storage (matching app's storage pattern)
    const token = secureStorage.getItem('authToken');

    console.log('token :::::', token);
    
    if (!token) {
        console.warn('⚠️ No auth token found. Socket connection skipped.');
        return null;
    }

    // Derive socket URL from base URL or use environment variable
    // Socket.IO typically connects to the server root, not /api path
    // So we remove /api from the baseUrl if present
    let socketUrl = import.meta.env.VITE_SOCKET_URL;
    
    if (!socketUrl && baseUrl) {
        // Remove trailing slash and /api if present
        socketUrl = baseUrl.replace(/\/$/, '').replace(/\/api$/, '');
    }
    
    // Fallback to default URL
    if (!socketUrl) {
        socketUrl = 'https://cms-ihiq.onrender.com';
    }

    console.log('🔌 Connecting to socket server:', socketUrl);

    // Connect to WebSocket server
    socket = io(socketUrl, {
        auth: {
            token: token // Send token in auth object
        },
        transports: ['websocket', 'polling'],
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
    });

    // Handle connection success
    socket.on('connect', () => {
        console.log('✅ Connected to WebSocket:', socket.id);
    });

    // Handle initial connection data
    socket.on('connected', (data) => {
        console.log('📨 Connection data received:', data);
        // data contains: { message, user: { id, name, role }, timestamp }
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        // Common errors:
        // - "Authentication token required" → Token missing
        // - "Authentication failed" → Invalid/expired token
        // - "User not found or inactive" → User doesn't exist
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected:', reason);
    });

    return socket;
};

/**
 * Disconnect socket from the backend
 * Should be called on user logout
 */
export const disconnectSocket = () => {
    if (socket?.connected) {
        socket.disconnect();
        console.log('🔌 Socket manually disconnected');
    }
    socket = null;
};

/**
 * Get the current socket instance
 * Returns null if socket is not initialized
 */
export const getSocket = () => {
    return socket;
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = () => {
    return socket?.connected || false;
};

// Default export - use getSocket() instead for better type safety
export default socket;
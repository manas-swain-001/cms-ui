import { createContext, useContext, useState, useEffect } from "react";
import useAttendance from "./useAttendance";
import secureStorage from "hooks/secureStorage";
import useProfileContext from "./useProfileContext";
import useNotifications from "./useNotifications";
import { initSocket } from "socket";

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {

    const userData = secureStorage.getItem('userData');
    const userRole = secureStorage.getItem('userRole');
    const isLogggedIn = secureStorage.getItem('isLoggedIn');

    const [userDataContext, setUserDataContext] = useState(userData);
    const [userRoleContext, setUserRoleContext] = useState(userRole);
    const [isLoggedIn, setIsLoggedIn] = useState(isLogggedIn);

    // Attendance context
    const attendance = useAttendance();
    const profile = useProfileContext();
    const notifications = useNotifications();

    // Initialize socket automatically when context provider mounts if user is authenticated
    useEffect(() => {
        const token = secureStorage.getItem('authToken');
        if (token) {
            console.log('🚀 Auto-initializing socket connection on app start...');
            initSocket();
        }
    }, []);

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            userDataContext,
            userRoleContext,
            setUserRoleContext,
            setUserDataContext,
            ...attendance,
            ...profile,
            ...notifications
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error("Context must be used within its provider");
    return context;
};
import { createContext, useContext, useState } from "react";
import useAttendance from "./useAttendance";
import secureStorage from "hooks/secureStorage";

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {

    const userData = secureStorage.getItem('userData');

    const [userDataContext, setUserDataContext] = useState(userData);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Attendance context
    const attendance = useAttendance();

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            userDataContext,
            setUserDataContext,
            ...attendance
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
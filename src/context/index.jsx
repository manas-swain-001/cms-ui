import { createContext, useContext, useState } from "react";
import useAttendance from "./useAttendance";

const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Attendance context
    const attendance = useAttendance();

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
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
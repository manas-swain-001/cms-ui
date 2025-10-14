import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import secureStorage from "hooks/secureStorage";

export const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = secureStorage.getItem('authToken');
    
    console.log('ProtectedRoute rendered - Token:', !!token, 'Current path:', location.pathname);

    useEffect(() => {
        console.log('ProtectedRoute useEffect - Token check:', !!token);
        
        if (!token) {
            console.log('ProtectedRoute - No token found, redirecting to login');
            navigate('/login-authentication', { 
                replace: true,
                state: { from: location }
            });
        }
    }, [token, navigate, location]);

    // If no token, don't render anything (let the redirect happen)
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // If token exists, render the protected content
    return children;
};
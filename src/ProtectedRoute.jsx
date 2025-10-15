import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import secureStorage from "hooks/secureStorage";
import { useGlobalContext } from "context";

export const ProtectedRoute = ({ children, requiredRole = null }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userRoleContext } = useGlobalContext();
    const token = secureStorage.getItem('authToken');
    
    useEffect(() => {
        
        if (!token) {
            console.log('ProtectedRoute - No token found, redirecting to login');
            navigate('/login-authentication', { 
                replace: true,
                state: { from: location }
            });
        } else if (requiredRole && userRoleContext !== requiredRole) {
            console.log('ProtectedRoute - User role does not match required role, redirecting to dashboard');
            navigate('/main-dashboard', { 
                replace: true,
                state: { from: location }
            });
        }
    }, [token, userRoleContext, requiredRole, navigate, location]);

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

    // If token exists but user role doesn't match required role
    if (requiredRole && userRoleContext !== requiredRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-4">
                        You don't have permission to access this page. {requiredRole} access required.
                    </p>
                    <button 
                        onClick={() => navigate('/main-dashboard')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // If token exists and role matches (or no role required), render the protected content
    return children;
};
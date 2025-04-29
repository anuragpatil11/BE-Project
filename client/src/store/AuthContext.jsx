import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { exp } = payload;
      if (!exp) throw new Error('Token missing expiration time');
      
      return exp < Date.now() / 1000; // Return true if expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume expired if error occurs
    }
  };

  // Function to extract user role from token
  const getUserRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  };

  // Function to validate token
  const validateToken = () => {
    const token = localStorage.getItem('token');
    
    if (!token || isTokenExpired(token)) {
      logout(); // Log out if invalid or expired
      return;
    }

    const role = getUserRoleFromToken(token);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  // Login function
  const login = (token) => {
    if (!token || isTokenExpired(token)) {
      console.error('Invalid or expired token');
      return false;
    }

    localStorage.setItem('token', token);
    setUserRole(getUserRoleFromToken(token));
    setIsLoggedIn(true);
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Check token on mount & listen for changes
  useEffect(() => {
    validateToken();
    const handleStorageChange = () => validateToken();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(validateToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to get current token
  const getToken = () => localStorage.getItem('token');

  // Function to get user ID safely
  const getUserID = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));

      return payload.id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  
const userID = getUserID();
  return (
    <AuthContext.Provider value={{ 
      isLoggedIn,
      userRole,
      login,
      logout,
      getToken,
      userID
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Custom hook for protected routes
export const useProtectedRoute = (allowedUserTypes = []) => {
  const { isLoggedIn, userRole } = useAuth(); // Fix: Use userRole

  if (!isLoggedIn) return false;
  if (allowedUserTypes.length === 0) return true;
  
  return allowedUserTypes.includes(userRole);
};
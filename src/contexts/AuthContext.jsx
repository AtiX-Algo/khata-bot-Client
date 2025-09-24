import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

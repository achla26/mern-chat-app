import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { refreshTokens, logoutUser } from '@/redux/thunks/auth.thunk';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, accessToken, isLoading } = useSelector(state => state.user);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user && Cookies.get('refreshToken')) {
          await dispatch(refreshTokens());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsAuthenticating(false);
      }
    };
    checkAuth();
  }, [dispatch, user]);

  const value = {
    user,
    accessToken,
    isLoading: isLoading || isAuthenticating,
    logout: () => dispatch(logoutUser())
  };

  return (
    <AuthContext.Provider value={value}>
      {!isAuthenticating && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated() ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthLayout;
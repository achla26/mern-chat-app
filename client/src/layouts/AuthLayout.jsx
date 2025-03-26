// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');  // Redirect to home if already authenticated
    }
  }, [isAuthenticated]);

  return (
    <div className="auth-layout">
      <Outlet />  {/* Renders the child auth routes */}
    </div>
  );
};

export default AuthLayout;
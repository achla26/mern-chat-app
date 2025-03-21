import { useNavigate } from 'react-router-dom';

// Custom hook to handle navigation
export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (routeName, params) => {
    navigate(routeName, { state: params });
  };

  const resetAndNavigate = (routeName) => {
    navigate(routeName, { replace: true });
  };

  const goBack = () => {
    navigate(-1);
  };

  const push = (routeName, params) => {
    navigate(routeName, { state: params });
  };

  return {
    navigate: navigateTo,
    resetAndNavigate,
    goBack,
    push,
  };
};
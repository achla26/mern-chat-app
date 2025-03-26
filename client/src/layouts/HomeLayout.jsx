import { Outlet } from 'react-router-dom';

const HomeLayout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* Add your common layout elements here */}
      hello
      {children || <Outlet />}
    </div>
  );
};

export default HomeLayout;
import { useEffect } from "react"; 
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux"; 
import { useTheme } from './context/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';
function App() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <div className="w-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
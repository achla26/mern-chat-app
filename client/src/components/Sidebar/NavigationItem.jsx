import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
 
export const NavigationItem= ({ Icon, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl ${
        isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-400 hover:bg-gray-50'
      }`}
    >
      <Icon size={20} />
    </button>
  );
};
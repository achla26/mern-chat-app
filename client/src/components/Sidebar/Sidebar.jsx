import React from "react";
import {
  MessageCircle,
  Files,
  Calendar,
  Bell,
  Settings,
  Moon,
  LogOut,
  Menu,
} from "lucide-react";
import { NavigationItem } from "./NavigationItem";

const Sidebar = () => {
  return (
    <div
      className="fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:left-auto md:right-auto 
                w-full md:w-16 lg:w-20 bg-white flex md:flex-col items-center 
                justify-around md:justify-start py-2 md:py-6 border-t md:border-r 
                z-50"
    >
      {/* Mobile menu button (hidden on desktop) */}
      <button
        className="md:hidden p-2 rounded-xl text-gray-400 hover:bg-gray-50"
        onClick={() => {}}
      >
        <Menu size={20} />
      </button>

      {/* Logo/icon (centered on mobile, at top on desktop) */}
      <div className="hidden md:flex w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-full items-center justify-center mb-8">
        <MessageCircle className="text-white w-5 h-5 lg:w-6 lg:h-6" />
      </div>

      {/* Navigation items (horizontal on mobile, vertical on desktop) */}
      <nav className="flex md:flex-col items-center space-x-4 md:space-x-0 md:space-y-4 lg:space-y-6 flex-1 md:flex-none">
        <NavigationItem Icon={MessageCircle} isActive />
        <NavigationItem Icon={Files} />
        <NavigationItem Icon={Calendar} />
        <NavigationItem Icon={Bell} />
        <NavigationItem Icon={Settings} />
      </nav>

      {/* Bottom items (shown inline on mobile, at bottom on desktop) */}
      <div className="flex md:flex-col items-center space-x-4 md:space-x-0">
        <NavigationItem Icon={Moon} />
        <div className="md:mt-4">
          <NavigationItem Icon={LogOut} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

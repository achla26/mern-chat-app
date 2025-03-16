import React from 'react';
import { Search } from 'lucide-react';

function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search chats..."
        className="w-full bg-gray-800 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
}

export default SearchBar;
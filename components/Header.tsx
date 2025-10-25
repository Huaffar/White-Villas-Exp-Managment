import React from 'react';
import { MenuIcon } from './IconComponents';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="no-print bg-gray-800 p-4 shadow-md flex items-center shrink-0 h-16 z-30">
        <button onClick={onMenuClick} className="md:hidden p-2 mr-2 text-gray-300 hover:text-white">
            <MenuIcon className="w-6 h-6" />
        </button>
      <h1 className="text-xl font-bold text-white">{title}</h1>
    </header>
  );
};

export default Header;
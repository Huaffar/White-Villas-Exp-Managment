import React from 'react';
import { MenuIcon } from './IconComponents';
// FIX: Corrected import path for types.
import { User } from '../types';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
    user: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, user, onLogout }) => {
  return (
    <header className="no-print bg-background-secondary p-4 shadow-md flex items-center justify-between shrink-0 h-16 z-30">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="md:hidden p-2 mr-2 text-text-primary hover:text-text-strong">
                <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-text-strong">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="font-semibold text-text-strong text-sm">{user.name}</p>
                <p className="text-xs text-accent">{user.role}</p>
            </div>
            <button onClick={onLogout} className="px-3 py-1.5 bg-background-tertiary text-text-strong text-xs font-bold rounded-md hover:bg-background-tertiary-hover transition-colors">
                Logout
            </button>
        </div>
    </header>
  );
};

export default Header;
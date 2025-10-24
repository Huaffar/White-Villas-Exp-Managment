import React from 'react';
import { DashboardIcon, TransactionsIcon, ProjectsIcon, StaffIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon } from './IconComponents';
import { AdminProfile } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  isMobileOpen: boolean;
  adminProfile: AdminProfile;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, isCollapsed, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className={`ml-4 font-semibold transition-opacity duration-200 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, setCollapsed, isMobileOpen, adminProfile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { id: 'transactions', label: 'Transactions', icon: <TransactionsIcon className="w-6 h-6" /> },
    { id: 'projects', label: 'Projects', icon: <ProjectsIcon className="w-6 h-6" /> },
    { id: 'staff', label: 'Staff', icon: <StaffIcon className="w-6 h-6" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  const sidebarClasses = `bg-gray-800 text-white flex flex-col shrink-0 transition-all duration-300 ease-in-out h-full z-40`;
  const desktopClasses = `hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'}`;
  const mobileClasses = `fixed md:hidden ${isMobileOpen ? 'w-64' : 'w-0 overflow-hidden'}`;

  const SidebarContent = () => (
    <>
      <div className={`flex items-center mb-10 p-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && adminProfile.logoUrl && (
          <img src={adminProfile.logoUrl} alt="Logo" className="h-10 w-auto"/>
        )}
        {!isCollapsed && (
            <span className="text-xl font-bold primary-text">{adminProfile.companyName.split(' ')[0]}</span>
        )}
      </div>
      <nav className="flex-grow px-2">
        <ul className="space-y-3">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={currentView === item.id}
              isCollapsed={isCollapsed}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </ul>
      </nav>
      <div className="p-2">
        <div className={`flex items-center p-3 rounded-lg bg-gray-900/50 ${isCollapsed ? 'justify-center' : ''}`}>
             <img src={adminProfile.logoUrl || "https://i.imgur.com/gcy8O2D.png"} alt="Admin" className="w-8 h-8 rounded-full" />
            {!isCollapsed && <span className="ml-3 text-sm font-semibold">{adminProfile.name}</span>}
        </div>
      </div>
      <button onClick={() => setCollapsed(!isCollapsed)} className="hidden md:block p-2 text-gray-400 hover:text-white absolute bottom-20 -right-3 bg-gray-700 rounded-full">
        {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
      </button>
    </>
  );

  return (
    <>
        {/* Desktop Sidebar */}
        <aside className={`${sidebarClasses} ${desktopClasses}`}>
            <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        <aside className={`${sidebarClasses} ${mobileClasses}`}>
            <SidebarContent />
        </aside>
    </>
  );
};

export default Sidebar;
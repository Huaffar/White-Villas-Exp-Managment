// FIX: Added full content for Sidebar.tsx to create the main navigation component.
import React from 'react';
import { AddTransactionIcon, DashboardIcon, ProjectsIcon, ReportsIcon, SettingsIcon, StaffIcon, TransactionsIcon } from './IconComponents';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="ml-4 font-semibold">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
    { id: 'transactions', label: 'Transactions', icon: <TransactionsIcon className="w-6 h-6" /> },
    { id: 'addTransaction', label: 'Add Transaction', icon: <AddTransactionIcon className="w-6 h-6" /> },
    { id: 'projects', label: 'Projects', icon: <ProjectsIcon className="w-6 h-6" /> },
    { id: 'staff', label: 'Staff Management', icon: <StaffIcon className="w-6 h-6" /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon className="w-6 h-6" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col shrink-0">
      <div className="text-2xl font-bold text-yellow-400 mb-10 text-center">
        WVA Pro
      </div>
      <nav>
        <ul className="space-y-3">
          {navItems.map(item => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={currentView === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 bg-gray-800 rounded-lg text-center">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} White Villas</p>
      </div>
    </aside>
  );
};

export default Sidebar;

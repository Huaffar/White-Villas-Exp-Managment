
import React from 'react';
import { DashboardIcon, AddIcon, HistoryIcon, ProjectsIcon, StaffIcon, ReportsIcon, SettingsIcon, ExpenseIcon, BuildingIcon } from './IconComponents';
import { AdminProfile } from '../types';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li>
        <button
            onClick={onClick}
            className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? 'primary-bg text-gray-900 font-bold' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
        >
            <span className="w-6 h-6 mr-3">{icon}</span>
            <span>{label}</span>
        </button>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'add-transaction', label: 'Add Transaction', icon: <AddIcon /> },
        { id: 'history', label: 'History', icon: <HistoryIcon /> },
    ];
    
    const managementItems = [
        { id: 'projects', label: 'Projects', icon: <ProjectsIcon /> },
        { id: 'staff', label: 'Staff', icon: <StaffIcon /> },
        { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
    ];

    const hubs = [
        { id: 'expense-hub', label: 'Expense Hub', icon: <ExpenseIcon /> },
        { id: 'construction-hub', label: 'Construction Hub', icon: <BuildingIcon /> },
    ];

    const settingsItem = { id: 'settings', label: 'Settings', icon: <SettingsIcon /> };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            <aside className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white flex flex-col z-40 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-16 border-b border-gray-700 shrink-0">
                    <h1 className="text-2xl font-bold primary-text">Acct<span className="text-white">Pro</span></h1>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <NavLink key={item.id} {...item} isActive={currentPage === item.id} onClick={() => onNavigate(item.id)} />
                        ))}
                    </ul>

                     <p className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</p>
                     <ul className="space-y-1">
                        {managementItems.map(item => (
                            <NavLink key={item.id} {...item} isActive={currentPage.startsWith(item.id)} onClick={() => onNavigate(item.id)} />
                        ))}
                    </ul>
                    
                    <p className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hubs</p>
                     <ul className="space-y-1">
                        {hubs.map(item => (
                            <NavLink key={item.id} {...item} isActive={currentPage === item.id} onClick={() => onNavigate(item.id)} />
                        ))}
                    </ul>

                </nav>
                 <div className="p-4 border-t border-gray-700">
                    <ul>
                        <NavLink {...settingsItem} isActive={currentPage === settingsItem.id} onClick={() => onNavigate(settingsItem.id)} />
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

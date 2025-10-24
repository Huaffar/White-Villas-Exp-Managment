import React from 'react';
import { Logo, DashboardIcon, AddIcon, ReportIcon, EditorIcon, CategoryReportIcon, StaffCashIcon, ProjectIcon, SettingsIcon } from './IconComponents';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon /> },
        { name: 'Projects', icon: <ProjectIcon /> },
        { name: 'Add Transaction', icon: <AddIcon /> },
        { name: 'Reports', icon: <ReportIcon /> },
        { name: 'Category Reports', icon: <CategoryReportIcon /> },
        { name: 'Staff Management', icon: <StaffCashIcon /> },
        { name: 'AI Image Editor', icon: <EditorIcon /> },
    ];

    const settingsItem = { name: 'Settings', icon: <SettingsIcon /> };

    return (
        <aside className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700 shadow-lg no-print">
            <div className="mb-8">
                <Logo />
            </div>
            <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setActivePage(item.name)}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            activePage === item.name
                                ? 'bg-yellow-500 text-gray-900 shadow-md'
                                : 'text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </button>
                ))}
            </nav>
            {/* Settings button at the bottom */}
            <div className="mt-auto">
                <hr className="border-t border-gray-700 my-4" />
                <button
                    onClick={() => setActivePage(settingsItem.name)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 w-full ${
                        activePage === settingsItem.name
                            ? 'bg-yellow-500 text-gray-900 shadow-md'
                            : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    {settingsItem.icon}
                    <span>{settingsItem.name}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
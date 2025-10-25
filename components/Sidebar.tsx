import React from 'react';
import { BalanceIcon, IncomeIcon, UserGroupIcon, ConstructionIcon, ExpenseIcon, PencilIcon, PrinterIcon, CloseIcon, HomeIcon, ArrowUpTrayIcon } from './IconComponents';

type View = 
    | 'dashboard' | 'addEntry' | 'history' | 'staff' | 'staffProfile'
    | 'labor' | 'laborProfile' | 'projects' | 'projectDetail' | 'construction' 
    | 'reports' | 'contacts' | 'accounts' | 'settings' | 'houseExpense'
    | 'ownerPayments' | 'clientLedger';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
    view: View;
    currentView: View;
    setView: (view: View) => void;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}> = ({ view, currentView, setView, icon, label, onClick }) => (
    <a
        href="#"
        onClick={(e) => {
            e.preventDefault();
            setView(view);
            onClick();
        }}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            currentView === view ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </a>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setOpen }) => {
    const handleLinkClick = () => {
        if (window.innerWidth < 768) { // md breakpoint
            setOpen(false);
        }
    };
    return (
        <>
            <div className={`no-print fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setOpen(false)}></div>
            <aside className={`no-print flex-shrink-0 w-64 bg-gray-800 border-r border-gray-700 flex flex-col transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative fixed inset-y-0 left-0 z-40`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    <span className="text-2xl font-bold text-white">WVA Pro</span>
                     <button onClick={() => setOpen(false)} className="md:hidden p-2 text-gray-300 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink view="dashboard" currentView={currentView} setView={setView} icon={<BalanceIcon className="w-5 h-5" />} label="Dashboard" onClick={handleLinkClick} />
                    <NavLink view="addEntry" currentView={currentView} setView={setView} icon={<PencilIcon className="w-5 h-5" />} label="Add Entry" onClick={handleLinkClick} />
                    <NavLink view="history" currentView={currentView} setView={setView} icon={<IncomeIcon className="w-5 h-5" />} label="History" onClick={handleLinkClick} />
                    
                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Management</p>
                    <NavLink view="clientLedger" currentView={currentView} setView={setView} icon={<IncomeIcon className="w-5 h-5" />} label="Client Ledger" onClick={handleLinkClick} />
                    <NavLink view="staff" currentView={currentView} setView={setView} icon={<UserGroupIcon className="w-5 h-5" />} label="Staff" onClick={handleLinkClick} />
                    <NavLink view="labor" currentView={currentView} setView={setView} icon={<UserGroupIcon className="w-5 h-5" />} label="Labor" onClick={handleLinkClick} />
                    <NavLink view="projects" currentView={currentView} setView={setView} icon={<ConstructionIcon className="w-5 h-5" />} label="Projects" onClick={handleLinkClick} />
                    <NavLink view="houseExpense" currentView={currentView} setView={setView} icon={<HomeIcon className="w-5 h-5" />} label="House Expense" onClick={handleLinkClick} />
                    <NavLink view="ownerPayments" currentView={currentView} setView={setView} icon={<ArrowUpTrayIcon className="w-5 h-5" />} label="Owner Payments" onClick={handleLinkClick} />
                    
                     <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Hubs</p>
                    <NavLink view="construction" currentView={currentView} setView={setView} icon={<ConstructionIcon className="w-5 h-5" />} label="Construction Hub" onClick={handleLinkClick} />
                    <NavLink view="reports" currentView={currentView} setView={setView} icon={<PrinterIcon className="w-5 h-5" />} label="Reports" onClick={handleLinkClick} />
                    
                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase">Admin</p>
                    <NavLink view="contacts" currentView={currentView} setView={setView} icon={<UserGroupIcon className="w-5 h-5" />} label="Contacts" onClick={handleLinkClick} />
                    <NavLink view="accounts" currentView={currentView} setView={setView} icon={<BalanceIcon className="w-5 h-5" />} label="Accounts" onClick={handleLinkClick} />
                    <NavLink view="settings" currentView={currentView} setView={setView} icon={<PencilIcon className="w-5 h-5" />} label="Settings" onClick={handleLinkClick} />
                    
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
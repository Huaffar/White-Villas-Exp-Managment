import React from 'react';
import {
    View,
    User,
    UserRole
} from '../types';
import {
    HomeIcon,
    UserGroupIcon,
    DocumentPlusIcon,
    BookOpenIcon,
    IdentificationIcon,
    WrenchScrewdriverIcon,
    BuildingOffice2Icon,
    CurrencyDollarIcon,
    BuildingStorefrontIcon,
    ChartBarIcon,
    ClipboardDocumentListIcon,
    TagIcon,
    FunnelIcon,
    CogIcon,
    UserCircleIcon
} from './IconComponents';

interface SidebarProps {
    currentView: View;
    onSetView: (view: View) => void;
    user: User;
    companyName: string;
    logoUrl ? : string;
    isSidebarOpen: boolean;
}

const NavLink: React.FC < {
    // FIX: Changed icon prop type from React.ReactElement to a more specific type that accepts className to resolve cloneElement error.
    icon: React.ReactElement<{ className?: string }>;
    label: string;
    view: View;
    currentView: View;
    onClick: (view: View) => void;
} > = ({
    icon,
    label,
    view,
    currentView,
    onClick
}) => {
    const isActive = currentView === view;
    return (
        // FIX: Corrected malformed JSX tags (e.g., `< span >`) that caused a major parsing error.
        <button onClick={() => onClick(view)}
        className={
            `flex items-center w-full px-4 py-3 text-sm font-semibold transition-colors duration-200 rounded-md my-1 ${
          isActive
            ? 'bg-accent text-on-accent'
            : 'text-text-primary hover:bg-background-tertiary-hover hover:text-text-strong'
        }`
        } >
            {React.cloneElement(icon, {
                className: 'w-6 h-6 mr-3'
            })}
        <span>{label}</span>
        </button>
    );
};

const Sidebar: React.FC < SidebarProps > = ({
    currentView,
    onSetView,
    user,
    companyName,
    logoUrl,
    isSidebarOpen
}) => {

    // FIX: Explicitly typed the navItems array to ensure item.view is correctly inferred as type `View`.
    const navItems: Array<{
        label: string;
        view: View;
        // FIX: Updated icon type to match the NavLink component's prop type.
        icon: React.ReactElement<{ className?: string }>;
        roles: UserRole[];
    }> = [{
        label: 'Dashboard',
        view: 'dashboard',
        icon: < HomeIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT, UserRole.CONSTRUCTION_MANAGER]
    }, {
        label: 'Add Entry',
        view: 'addEntry',
        icon: < DocumentPlusIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Client Ledger',
        view: 'clientLedger',
        icon: < IdentificationIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Staff',
        view: 'staff',
        icon: < UserGroupIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Labor',
        view: 'labor',
        icon: < UserGroupIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER]
    }, {
        label: 'Projects',
        view: 'projects',
        icon: < WrenchScrewdriverIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT, UserRole.CONSTRUCTION_MANAGER]
    }, {
        label: 'House Expense',
        view: 'houseExpense',
        icon: < BuildingOffice2Icon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Owner Payments',
        view: 'ownerPayments',
        icon: < CurrencyDollarIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Construction',
        view: 'construction',
        icon: < BuildingStorefrontIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONSTRUCTION_MANAGER]
    }, {
        label: 'Reports',
        view: 'reports',
        icon: < ChartBarIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Contacts',
        view: 'contacts',
        icon: < ClipboardDocumentListIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF_ACCOUNTANT]
    }, {
        label: 'Accounts',
        view: 'accounts',
        icon: < TagIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
    }, {
        label: 'Leads',
        view: 'leads',
        icon: < FunnelIcon / > ,
        roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
    }, {
        label: 'Settings',
        view: 'settings',
        icon: < CogIcon / > ,
        roles: [UserRole.SUPER_ADMIN]
    }, {
        label: 'Client Portal',
        view: 'clientPortal',
        icon: < UserCircleIcon / > ,
        roles: [UserRole.CLIENT]
    }, ];

    const accessibleNavItems = navItems.filter(item => item.roles.includes(user.role));

    // FIX: Corrected malformed JSX tags that were causing parsing errors.
    return (
        <aside className={
            `no-print fixed inset-y-0 left-0 bg-background-secondary text-text-strong w-64 space-y-6 py-7 px-2 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col z-40 border-r border-primary`
        }>
        <div className="px-4">
        <div className="flex items-center space-x-3">
            {logoUrl && <img src={logoUrl}
            alt="Company Logo"
            className="h-10 w-10" />}
        <h2 className="text-xl font-bold text-accent">{companyName}</h2>
        </div>
        </div>
        <nav className="flex-grow">
            {accessibleNavItems.map((item) => (
                <NavLink key={item.view}
                icon={item.icon}
                label={item.label}
                view={item.view}
                currentView={currentView}
                onClick={onSetView} />
            ))}
        </nav>
        </aside>
    );
};

export default Sidebar;
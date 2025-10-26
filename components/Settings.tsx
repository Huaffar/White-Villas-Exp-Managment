


import React, { useState } from 'react';
import { AdminProfile, User, Contact } from '../types';
import UserManagement from './UserManagement';
import SmsSettings from './SmsSettings';
import SmsTemplates from './SmsTemplates';
import LeadSettings from './LeadSettings';
import BackupRestoreSettings from './BackupRestoreSettings';
import { ArrowUpTrayIcon } from './IconComponents';
import { ToastProps } from './Toast';

interface SettingsProps {
    profile: AdminProfile;
    users: User[];
    contacts: Contact[];
    onSaveProfile: (profile: AdminProfile) => void;
    onSaveUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
    showToast: (message: string, type: ToastProps['type']) => void;
}

const ProfileSettings: React.FC<{ profile: AdminProfile, onSave: (profile: AdminProfile) => void, showToast: (m: string, t: ToastProps['type']) => void }> = ({ profile, onSave, showToast }) => {
    const [companyName, setCompanyName] = useState(profile.companyName);
    const [logoUrl, setLogoUrl] = useState(profile.logoUrl);
    const [address, setAddress] = useState(profile.address);
    const [phone, setPhone] = useState(profile.phone);
    const [currencySymbol, setCurrencySymbol] = useState(profile.currencySymbol);

    const handleSave = () => {
        onSave({ ...profile, companyName, logoUrl, address, phone, currencySymbol });
        showToast('Profile updated successfully!', 'success');
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-white">Company Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Currency Symbol</label>
                    <input type="text" value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company Logo</label>
                <div className="flex items-center gap-4 mt-2">
                    {logoUrl && <img src={logoUrl} alt="Logo" className="h-16 w-16 bg-white p-1 rounded-md object-contain" />}
                    <input type="file" id="logo-upload" onChange={handleLogoUpload} accept="image/*" className="hidden" />
                    <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        Upload Logo
                    </label>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleSave} className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">Save Profile</button>
            </div>
        </div>
    );
};

const THEME_COLORS = [
    { name: 'Golden Yellow', value: '234 88 12', className: 'bg-[rgb(234,88,12)]' },
    { name: 'Sky Blue', value: '59 130 246', className: 'bg-blue-500' },
    { name: 'Emerald Green', value: '16 185 129', className: 'bg-emerald-500' },
    { name: 'Crimson Red', value: '220 38 38', className: 'bg-red-600' },
    { name: 'Violet', value: '139 92 246', className: 'bg-violet-500' },
];

const AppearanceSettings: React.FC<{ profile: AdminProfile, onSave: (profile: AdminProfile) => void, showToast: (message: string, type: ToastProps['type']) => void }> = ({ profile, onSave, showToast }) => {
    const [themeColor, setThemeColor] = useState(profile.themeColor || '234 88 12');

    const handleSave = () => {
        onSave({ ...profile, themeColor });
        showToast('Theme updated successfully!', 'success');
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Theme & Appearance</h2>
                <button onClick={handleSave} className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">Save Theme</button>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                <div className="flex flex-wrap gap-4">
                    {THEME_COLORS.map(color => (
                        <button 
                            key={color.name} 
                            onClick={() => setThemeColor(color.value)}
                            title={color.name}
                            className={`w-24 h-16 rounded-lg flex items-end justify-center p-2 text-xs font-semibold text-white shadow-md transition-all ${color.className} ${themeColor === color.value ? 'ring-4 ring-offset-2 ring-offset-gray-800 ring-white' : 'ring-2 ring-transparent hover:ring-white/50'}`}
                        >
                            <span className="bg-black/30 px-1.5 py-0.5 rounded-full">{color.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const Settings: React.FC<SettingsProps> = (props) => {
    const [activeTab, setActiveTab] = useState('profile');

    const getTabClass = (tabName: string) => {
        return `px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`;
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold primary-text">Settings</h1>
            <div className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-lg">
                <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>Profile</button>
                <button onClick={() => setActiveTab('appearance')} className={getTabClass('appearance')}>Appearance</button>
                <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>User Accounts</button>
                <button onClick={() => setActiveTab('sms_settings')} className={getTabClass('sms_settings')}>SMS Gateway</button>
                <button onClick={() => setActiveTab('sms_templates')} className={getTabClass('sms_templates')}>SMS Templates</button>
                <button onClick={() => setActiveTab('leads')} className={getTabClass('leads')}>Leads Settings</button>
                <button onClick={() => setActiveTab('backup')} className={getTabClass('backup')}>Backup & Restore</button>
            </div>
            <div>
                {activeTab === 'profile' && <ProfileSettings profile={props.profile} onSave={props.onSaveProfile} showToast={props.showToast} />}
                {activeTab === 'appearance' && <AppearanceSettings profile={props.profile} onSave={props.onSaveProfile} showToast={props.showToast} />}
                {activeTab === 'users' && <UserManagement users={props.users} contacts={props.contacts} onSaveUser={props.onSaveUser} onDeleteUser={props.onDeleteUser} />}
                {activeTab === 'sms_settings' && <SmsSettings profile={props.profile} onSave={props.onSaveProfile} />}
                {activeTab === 'sms_templates' && <SmsTemplates profile={props.profile} onSave={props.onSaveProfile} />}
                {activeTab === 'leads' && <LeadSettings profile={props.profile} onSave={props.onSaveProfile} />}
                {activeTab === 'backup' && <BackupRestoreSettings showToast={props.showToast} />}
            </div>
        </div>
    );
};

export default Settings;
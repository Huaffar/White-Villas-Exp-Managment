import React, { useState } from 'react';

interface SettingsProps {
    theme: string;
    setTheme: (theme: string) => void;
    onNavigate: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, onNavigate }) => {
    const [adminName, setAdminName] = useState('Admin User');
    const [adminEmail, setAdminEmail] = useState('admin@whitevillas.com');
    const [feedback, setFeedback] = useState('');

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would save to a backend.
        setFeedback('Profile updated successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleThemeChange = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-yellow-400">Settings</h1>

            {/* Admin Profile Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Admin Profile</h2>
                <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="adminName" className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                            <input type="text" id="adminName" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                        </div>
                        <div>
                            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input type="email" id="adminEmail" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        {feedback && <p className="text-sm text-green-400 mr-4">{feedback}</p>}
                        <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 text-sm">Save Profile</button>
                    </div>
                </form>
            </div>

            {/* Appearance Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                    <p className="text-gray-300">Theme</p>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-400">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        <button onClick={handleThemeChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${theme === 'dark' ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* General & Support Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">General</h2>
                     <button 
                        onClick={() => onNavigate('Staff Management')}
                        className="w-full px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200 text-left"
                    >
                        Manage Staff Members
                    </button>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Support</h2>
                    <div className="text-gray-300">
                        <p>For assistance, please contact:</p>
                        <p className="font-semibold text-white mt-1">Phone: +92 300 1234567</p>
                        <p className="font-semibold text-white">Email: support@whitevillas.com</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Settings;

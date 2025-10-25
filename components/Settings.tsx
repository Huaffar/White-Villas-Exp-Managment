import React, { useState, useEffect, useRef } from 'react';
import { AdminProfile } from '../types';

interface SettingsProps {
    profile: AdminProfile;
    onSave: (profile: AdminProfile) => void;
}

const themeColors = [
    { name: 'Default Yellow', value: '234 88 12', class: 'bg-yellow-500' },
    { name: 'Sky Blue', value: '59 130 246', class: 'bg-blue-500' },
    { name: 'Emerald Green', value: '16 185 129', class: 'bg-green-500' },
    { name: 'Royal Indigo', value: '99 102 241', class: 'bg-indigo-500' },
    { name: 'Crimson Red', value: '220 38 38', class: 'bg-red-600' },
];

const Settings: React.FC<SettingsProps> = ({ profile, onSave }) => {
    const [currentProfile, setCurrentProfile] = useState<AdminProfile>(profile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect for instant theme preview
    useEffect(() => {
        if (currentProfile.themeColor) {
            document.documentElement.style.setProperty('--primary-color', currentProfile.themeColor);
        }
    }, [currentProfile.themeColor]);
    
    // Effect for instant dark/light mode preview
    useEffect(() => {
        const body = document.body;
        if (currentProfile.mode === 'dark') {
            body.classList.add('dark', 'bg-gray-900');
            body.classList.remove('bg-gray-100');
        } else {
            body.classList.remove('dark', 'bg-gray-900');
            body.classList.add('bg-gray-100');
        }
    }, [currentProfile.mode]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleThemeChange = (colorValue: string) => {
        setCurrentProfile(prev => ({ ...prev, themeColor: colorValue }));
    };

    const handleModeChange = (mode: 'light' | 'dark') => {
        setCurrentProfile(prev => ({ ...prev, mode }));
    };

    const handleSave = () => {
        onSave(currentProfile);
        alert('Settings saved successfully!');
    };

    const renderInput = (id: keyof AdminProfile, label: string, placeholder = '', type = 'text') => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>
            <input
                type={type}
                id={id}
                name={id}
                value={currentProfile[id] || ''}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-800 dark:text-white focus:ring-2 primary-ring focus:outline-none"
            />
        </div>
    );
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold primary-text">Settings</h1>
                <button 
                    onClick={handleSave}
                    className="px-6 py-2 primary-bg text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                    Save Changes
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-10">
                {/* Company Details Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">Company Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderInput('companyName', 'Company Name', 'e.g., White Villas Construction')}
                         <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Company Logo</label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center border border-gray-300 dark:border-gray-600">
                                    {currentProfile.logoUrl ? (
                                        <img src={currentProfile.logoUrl} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center">No Logo</span>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/png, image/jpeg, image/gif" className="hidden" />
                                <div className="flex flex-col gap-2">
                                     <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                                        Upload Logo
                                    </button>
                                    {currentProfile.logoUrl && (
                                        <button type="button" onClick={() => setCurrentProfile(p => ({...p, logoUrl: ''}))} className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {renderInput('address', 'Company Address', '123 Main St, City')}
                        {renderInput('phone', 'Contact Phone', '+1 (555) 123-4567')}
                        {renderInput('taxId', 'Tax ID / NTN', 'e.g., 1234567-8')}
                    </div>
                </section>

                {/* Financials Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">Financials</h2>
                    <div className="max-w-xs">
                        {renderInput('currencySymbol', 'Currency Symbol', 'e.g., PKR, USD, $')}
                    </div>
                </section>
                
                {/* Appearance Section */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">Appearance</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Theme Color</label>
                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                            {themeColors.map(color => (
                                <div key={color.name} className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleThemeChange(color.value)}
                                        className={`w-8 h-8 rounded-full ${color.class} border-2 ${currentProfile.themeColor === color.value ? 'border-gray-800 dark:border-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-800 dark:ring-white' : 'border-transparent'}`}
                                        aria-label={`Select ${color.name} theme`}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Mode</label>
                        <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-900 rounded-lg p-1 max-w-min">
                            <button 
                                onClick={() => handleModeChange('light')} 
                                className={`px-4 py-1 rounded-md text-sm font-semibold transition-all ${currentProfile.mode === 'light' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-white/50'}`}
                            >
                                Light
                            </button>
                            <button 
                                onClick={() => handleModeChange('dark')} 
                                className={`px-4 py-1 rounded-md text-sm font-semibold transition-all ${currentProfile.mode === 'dark' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:bg-gray-700/50'}`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
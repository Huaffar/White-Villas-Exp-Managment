// FIX: Added full content for Settings.tsx to manage categories and other app settings.
import React, { useState, useRef } from 'react';
import { Category, AdminProfile } from '../types';
import { PencilIcon, UserIcon, PaletteIcon, DatabaseIcon, LifebuoyIcon, DownloadIcon, CameraIcon } from './IconComponents';
import CategoryFormModal from './CategoryFormModal';
// FIX: Corrected import path for ImageEditor component.
import ImageEditor from './ImageEditor';
import ConfirmationModal from './ConfirmationModal';

interface SettingsProps {
    incomeCategories: Category[];
    expenseCategories: Category[];
    setIncomeCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setExpenseCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    adminProfile: AdminProfile;
    updateAdminProfile: (profile: AdminProfile) => void;
    exportData: () => void;
    clearData: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    incomeCategories, expenseCategories, setIncomeCategories, setExpenseCategories, 
    adminProfile, updateAdminProfile, exportData, clearData
}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleClearData = () => {
        clearData();
        setConfirmModalOpen(false);
    }
    
    const tabs = [
        { id: 'profile', label: 'My Profile', icon: <UserIcon className="w-5 h-5 mr-2" /> },
        { id: 'appearance', label: 'Appearance', icon: <PaletteIcon className="w-5 h-5 mr-2" /> },
        { id: 'categories', label: 'Categories', icon: <PencilIcon className="w-5 h-5 mr-2" /> },
        { id: 'data', label: 'Data Management', icon: <DatabaseIcon className="w-5 h-5 mr-2" /> },
        { id: 'support', label: 'Support', icon: <LifebuoyIcon className="w-5 h-5 mr-2" /> },
        { id: 'imageEditor', label: 'AI Image Editor', icon: <CameraIcon className="w-5 h-5 mr-2" /> },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings profile={adminProfile} onSave={updateAdminProfile} />;
            case 'appearance': return <AppearanceSettings profile={adminProfile} onSave={updateAdminProfile} />;
            case 'categories': return <CategorySettings incomeCategories={incomeCategories} expenseCategories={expenseCategories} setIncomeCategories={setIncomeCategories} setExpenseCategories={setExpenseCategories} />;
            case 'data': return <DataManagement onExport={exportData} onClear={() => setConfirmModalOpen(true)} />;
            case 'support': return <Support />;
            case 'imageEditor': return <ImageEditor />;
            default: return null;
        }
    }

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold primary-text">Settings</h1>
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <ul className="space-y-2">
                    {tabs.map(tab => (
                        <li key={tab.id}>
                            <button onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${activeTab === tab.id ? 'primary-bg text-gray-900 font-bold' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="flex-1">
                {renderContent()}
            </main>
        </div>
        {isConfirmModalOpen && (
            <ConfirmationModal 
                title="Clear All Transaction Data?"
                message="This action is irreversible. All transactions, balances, and related financial data will be permanently deleted."
                onConfirm={handleClearData}
                onCancel={() => setConfirmModalOpen(false)}
            />
        )}
    </div>
  );
};

// Sub-components for each tab
const ProfileSettings: React.FC<{profile: AdminProfile, onSave: (p: AdminProfile) => void}> = ({ profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    
     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({...formData, logoUrl: reader.result as string});
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        alert("Profile updated!");
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                    <img src={formData.logoUrl || "https://i.imgur.com/gcy8O2D.png"} alt="Logo" className="w-20 h-20 rounded-full object-cover bg-gray-700" />
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*"/>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600">Change Logo</button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">Save Changes</button>
                </div>
            </form>
        </div>
    )
}

const AppearanceSettings: React.FC<{profile: AdminProfile, onSave: (p: AdminProfile) => void}> = ({ profile, onSave }) => {
    const [color, setColor] = useState(profile.themeColor);

    const colors = [
        { name: 'Default Yellow', value: '234 88 12' },
        { name: 'Sky Blue', value: '59 130 246' },
        { name: 'Emerald Green', value: '16 185 129' },
        { name: 'Rose Pink', value: '244 63 94' },
        { name: 'Indigo Purple', value: '99 102 241' },
    ];

    const handleSave = () => {
        onSave({...profile, themeColor: color});
        alert("Appearance updated!");
    }
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h3 className="text-xl font-semibold text-white mb-4">Theme Color</h3>
             <div className="flex flex-wrap gap-4">
                {colors.map(c => (
                    <button key={c.value} onClick={() => setColor(c.value)} className={`p-4 rounded-lg border-2 ${color === c.value ? 'border-white' : 'border-transparent'}`}>
                        <div className="w-12 h-12 rounded-full" style={{backgroundColor: `rgb(${c.value})`}}></div>
                        <p className="text-xs mt-2 text-center">{c.name}</p>
                    </button>
                ))}
             </div>
              <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">Save Changes</button>
                </div>
        </div>
    );
};

const CategorySettings: React.FC<{
    incomeCategories: Category[], expenseCategories: Category[], 
    setIncomeCategories: React.Dispatch<React.SetStateAction<Category[]>>, 
    setExpenseCategories: React.Dispatch<React.SetStateAction<Category[]>>
}> = (props) => {
    return (
         <div className="grid grid-cols-1 gap-8">
            <CategoryManager title="Income Categories" categories={props.incomeCategories} setCategories={props.setIncomeCategories} />
            <CategoryManager title="Expense Categories" categories={props.expenseCategories} setCategories={props.setExpenseCategories} />
        </div>
    )
}

const DataManagement: React.FC<{onExport: () => void, onClear: () => void}> = ({onExport, onClear}) => (
     <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-white">Export Data</h3>
            <p className="text-sm text-gray-400 mb-2">Export all your transaction data to a CSV file for backups or external analysis.</p>
            <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                <DownloadIcon className="w-5 h-5" /> Export as CSV
            </button>
        </div>
         <div className="border-t border-red-700/50 pt-4">
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-400 mb-2">This action is permanent and cannot be undone.</p>
            <button onClick={onClear} className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-500">
                Clear All Transactions
            </button>
        </div>
    </div>
);

const Support: React.FC = () => (
     <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
         <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
         <p className="text-gray-300">For any assistance, please contact us at:</p>
         <p className="text-2xl font-bold primary-text mt-2">+92 123 4567890</p>
    </div>
)


const CategoryManager: React.FC<{
    title: string;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}> = ({ title, categories, setCategories }) => {
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleSave = (category: Category) => {
        if (category.id === 0) { // Add new
            const newCategory = { ...category, id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1 };
            setCategories([...categories, newCategory]);
        } else { // Edit
            setCategories(categories.map(c => c.id === category.id ? category : c));
        }
        setModalOpen(false);
        setEditingCategory(null);
    }
    
    const handleAddNew = () => {
        setEditingCategory({id: 0, name: ''});
        setModalOpen(true);
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    }

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">{title}</h3>
                <button onClick={handleAddNew} className="px-3 py-1 primary-bg text-gray-900 font-bold text-sm rounded-lg hover:opacity-90">Add New</button>
            </div>
            <ul className="space-y-2">
                {categories.map(cat => (
                    <li key={cat.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-300">{cat.name}</span>
                        <button onClick={() => handleEdit(cat)} className="text-gray-400 hover:text-white">
                            <PencilIcon className="h-4 w-4" />
                        </button>
                    </li>
                ))}
            </ul>
            {isModalOpen && editingCategory && (
                <CategoryFormModal category={editingCategory} onSave={handleSave} onClose={() => setModalOpen(false)} />
            )}
        </div>
    )
}

export default Settings;

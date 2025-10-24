// FIX: Added full content for Settings.tsx to manage categories and other app settings.
import React, { useState } from 'react';
import { Category } from '../types';
import { PencilIcon } from './IconComponents';
import CategoryFormModal from './CategoryFormModal';
import ImageEditor from './ImageEditor';

interface SettingsProps {
    incomeCategories: Category[];
    expenseCategories: Category[];
    setIncomeCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setExpenseCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

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
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <button onClick={handleAddNew} className="px-3 py-1 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400">Add New</button>
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

const Settings: React.FC<SettingsProps> = ({ incomeCategories, expenseCategories, setIncomeCategories, setExpenseCategories }) => {
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-yellow-400">Settings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CategoryManager title="Income Categories" categories={incomeCategories} setCategories={setIncomeCategories} />
            <CategoryManager title="Expense Categories" categories={expenseCategories} setCategories={setExpenseCategories} />
        </div>
        <div className="mt-8">
            <ImageEditor />
        </div>
    </div>
  );
};

export default Settings;

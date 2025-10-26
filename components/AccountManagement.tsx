import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Category, TransactionType, SystemLinkMap } from '../types';
import { PencilIcon, TrashIcon, LinkIcon } from './IconComponents';
import CategoryFormModal from './CategoryFormModal';
import ConfirmationModal from './ConfirmationModal';

interface AccountManagementProps {
    incomeCategories: Category[];
    expenseCategories: Category[];
    onSaveCategory: (category: Category) => void;
    onAddCategory: (category: Omit<Category, 'id'>) => void;
    onDeleteCategory: (category: Category) => void;
}

const CategoryTable: React.FC<{
    title: string, 
    categories: Category[], 
    type: TransactionType | TransactionType.AMOUNT_OUT,
    onEdit: (cat: Category) => void,
    onDelete: (cat: Category) => void,
    onAdd: (type: TransactionType | TransactionType.AMOUNT_OUT) => void,
}> = ({ title, categories, type, onEdit, onDelete, onAdd }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <button onClick={() => onAdd(type)} className="px-3 py-1 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:opacity-90">Add New</button>
        </div>
        <div className="space-y-2">
            {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                        <span className="text-white">{cat.name}</span>
                        {cat.systemLink && (
                            <div title={`Linked to: ${SystemLinkMap[cat.systemLink]}`} className="cursor-help">
                                <LinkIcon className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => onEdit(cat)} className="text-blue-400 hover:text-blue-300"><PencilIcon className="w-4 h-4" /></button>
                        <button 
                            onClick={() => !cat.systemLink && onDelete(cat)} 
                            className={`${cat.systemLink ? 'text-gray-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                            disabled={!!cat.systemLink}
                            title={cat.systemLink ? "System categories cannot be deleted." : "Delete category"}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const AccountManagement: React.FC<AccountManagementProps> = ({ incomeCategories, expenseCategories, onSaveCategory, onAddCategory, onDeleteCategory }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    
    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setModalOpen(true);
    };

    const handleAdd = (type: TransactionType | TransactionType.AMOUNT_OUT) => {
        setEditingCategory({ id: 0, name: '', type });
        setModalOpen(true);
    };
    
    const handleSave = (cat: Category) => {
        if (cat.id === 0) {
            onAddCategory({ name: cat.name, type: cat.type, systemLink: cat.systemLink });
        } else {
            onSaveCategory(cat);
        }
        setModalOpen(false);
        setEditingCategory(null);
    }
    
    const handleDelete = () => {
        if (categoryToDelete) {
            onDeleteCategory(categoryToDelete);
            setCategoryToDelete(null);
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-yellow-400">Account & Category Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CategoryTable title="Income Categories" categories={incomeCategories} type={TransactionType.INCOME} onEdit={handleEdit} onDelete={setCategoryToDelete} onAdd={handleAdd} />
                <CategoryTable title="Expense Categories" categories={expenseCategories} type={TransactionType.EXPENSE} onEdit={handleEdit} onDelete={setCategoryToDelete} onAdd={handleAdd} />
            </div>

            {isModalOpen && editingCategory && (
                <CategoryFormModal 
                    category={editingCategory}
                    onSave={handleSave}
                    onClose={() => setModalOpen(false)}
                    allIncomeCategories={incomeCategories}
                    allExpenseCategories={expenseCategories}
                />
            )}
            
            {categoryToDelete && (
                 <ConfirmationModal 
                    title="Delete Category"
                    message={`Are you sure you want to delete the category "${categoryToDelete.name}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setCategoryToDelete(null)}
                />
            )}
        </div>
    );
};

export default AccountManagement;
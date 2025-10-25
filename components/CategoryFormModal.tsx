import React, { useState } from 'react';
import { Category, TransactionType, SystemLinkType, SystemLinkMap } from '../types';

interface CategoryFormModalProps {
  category: Category;
  onSave: (category: Category) => void;
  onClose: () => void;
  allIncomeCategories: Category[];
  allExpenseCategories: Category[];
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ category, onSave, onClose, allIncomeCategories, allExpenseCategories }) => {
  const [name, setName] = useState(category.name);
  const [type, setType] = useState<TransactionType>(category.type);
  const [systemLink, setSystemLink] = useState<SystemLinkType | undefined>(category.systemLink);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...category, name, type, systemLink: systemLink });
  };

  const allCategories = [...allIncomeCategories, ...allExpenseCategories];

  const getCategoryUsingLink = (link: SystemLinkType) => {
      return allCategories.find(c => c.systemLink === link && c.id !== category.id);
  }

  // A category can't have its type changed if it has a system link.
  const isTypeChangeDisabled = !!category.systemLink && category.id !== 0;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{category.id === 0 ? 'Add New' : 'Edit'} Category</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
          </div>
           <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Category Type</label>
            <select 
                id="type" 
                value={type} 
                onChange={e => setType(e.target.value as TransactionType)} 
                required 
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white disabled:bg-gray-700 disabled:cursor-not-allowed"
                disabled={isTypeChangeDisabled}
                title={isTypeChangeDisabled ? "Cannot change the type of a system-linked category. Unlink it first." : ""}
            >
              <option value={TransactionType.INCOME}>Income</option>
              <option value={TransactionType.EXPENSE}>Expense</option>
            </select>
            {isTypeChangeDisabled && <p className="text-xs text-gray-400 mt-1">Unlink the category to change its type.</p>}
          </div>
          <div>
            <label htmlFor="systemLink" className="block text-sm font-medium text-gray-300 mb-1">System Link</label>
            <select 
                id="systemLink" 
                value={systemLink || 'NONE'} 
                onChange={e => setSystemLink(e.target.value === 'NONE' ? undefined : e.target.value as SystemLinkType)} 
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="NONE">None (Standard Category)</option>
              {Object.entries(SystemLinkMap).map(([key, value]) => {
                  const existingCat = getCategoryUsingLink(key as SystemLinkType);
                  const label = `${value}${existingCat ? ` (currently: ${existingCat.name})` : ''}`;
                  return <option key={key} value={key}>{label}</option>
              })}
            </select>
            <p className="text-xs text-gray-400 mt-1">Links this category to a specific feature. Selecting a link will re-assign it if it's already in use.</p>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
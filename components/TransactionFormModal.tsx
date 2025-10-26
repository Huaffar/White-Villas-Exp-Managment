import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import { Transaction, TransactionType, Category, Project, StaffMember, Laborer } from '../types';
// FIX: Corrected import path for App to get SystemCategoryNames.
import { SystemCategoryNames } from '../App';

interface TransactionFormModalProps {
    transaction: Transaction;
    onSave: (transaction: Transaction) => void;
    onClose: () => void;
    projects: Project[];
    staff: StaffMember[];
    laborers: Laborer[];
    categories: Category[];
    // FIX: Use `typeof SystemCategoryNames` to correctly type the prop based on the imported object value.
    systemCategoryNames: typeof SystemCategoryNames;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ transaction, onSave, onClose, projects, staff, laborers, categories, systemCategoryNames }) => {
    const [date, setDate] = useState(transaction.date);
    const [details, setDetails] = useState(transaction.details);
    const [category, setCategory] = useState(transaction.category);
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [projectId, setProjectId] = useState(transaction.projectId);
    const [staffId, setStaffId] = useState(transaction.staffId);
    const [laborerId, setLaborerId] = useState(transaction.laborerId);

    const availableCategories = categories.filter(c => c.type === transaction.type);
    const constructionProjects = projects.filter(p => p.projectType === 'Construction' && p.status === 'Ongoing');

    useEffect(() => {
        if (!availableCategories.find(c => c.name === category)) {
            setCategory('');
        }
    }, [transaction.type, availableCategories, category]);
    
    const isConstructionCategory = category === systemCategoryNames.constructionMaterial || category === systemCategoryNames.constructionLabor;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isConstructionCategory && !projectId) {
            alert('Please select a project for this construction expense.');
            return;
        }
        const updatedTransaction: Transaction = {
            ...transaction,
            date,
            details,
            category,
            amount: parseFloat(amount),
            projectId,
            staffId,
            laborerId,
        };
        onSave(updatedTransaction);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Edit Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">Details</label>
                        <input type="text" id="details" value={details} onChange={e => setDetails(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="" disabled>Select a category</option>
                                {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="project" className={`block text-sm font-medium text-gray-300 mb-1 ${isConstructionCategory ? 'font-bold text-yellow-400' : ''}`}>
                                Project {isConstructionCategory ? '(Required)' : '(Optional)'}
                            </label>
                            <select id="project" value={projectId || ''} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="">None</option>
                                {(isConstructionCategory ? constructionProjects : projects).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {transaction.type === TransactionType.EXPENSE && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <label htmlFor="staff" className="block text-sm font-medium text-gray-300 mb-1">Link to Staff (Optional)</label>
                                <select id="staff" value={staffId || ''} onChange={e => setStaffId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                    <option value="">None</option>
                                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="laborer" className="block text-sm font-medium text-gray-300 mb-1">Link to Laborer (Optional)</label>
                                <select id="laborer" value={laborerId || ''} onChange={e => setLaborerId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                    <option value="">None</option>
                                    {laborers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal;
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category, Project, StaffMember } from '../types';

interface TransactionFormModalProps {
    onSave: (transaction: Omit<Transaction, 'id' | 'balance'> | Transaction) => void;
    onClose: () => void;
    transactionToEdit?: Transaction;
    projects: Project[];
    staff: StaffMember[];
    incomeCategories: Category[];
    expenseCategories: Category[];
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ 
    onSave, onClose, transactionToEdit, projects, staff, incomeCategories, expenseCategories 
}) => {
    const [type, setType] = useState<TransactionType>(transactionToEdit?.type || TransactionType.EXPENSE);
    const [date, setDate] = useState(transactionToEdit?.date || new Date().toISOString().split('T')[0]);
    const [details, setDetails] = useState(transactionToEdit?.details || '');
    const [category, setCategory] = useState(transactionToEdit?.category || '');
    const [amount, setAmount] = useState(transactionToEdit?.amount.toString() || '');
    const [projectId, setProjectId] = useState(transactionToEdit?.projectId);
    const [staffId, setStaffId] = useState(transactionToEdit?.staffId);

    const categories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;
    
    // Reset category if type changes and selected category is not valid
    useEffect(() => {
        if (!categories.find(c => c.name === category)) {
            setCategory('');
        }
    }, [type, categories, category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!details || !amount || !category) {
            alert('Please fill all required fields.');
            return;
        }
        
        const transactionData = {
            date,
            details,
            category,
            type,
            amount: parseFloat(amount),
            projectId,
            staffId,
        };
        
        if (transactionToEdit) {
            onSave({ ...transactionToEdit, ...transactionData });
        } else {
            onSave(transactionData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700">
                <h2 className="text-3xl font-bold primary-text mb-6">{transactionToEdit ? 'Edit' : 'Add New'} Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-3 rounded-lg font-semibold ${type === TransactionType.EXPENSE ? 'bg-red-500' : 'bg-gray-700'}`}>Expense</button>
                            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-full py-3 rounded-lg font-semibold ${type === TransactionType.INCOME ? 'bg-green-500' : 'bg-gray-700'}`}>Income</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g., 5000" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">Details</label>
                        <input type="text" id="details" value={details} onChange={e => setDetails(e.target.value)} required placeholder="e.g., Office electricity bill" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="" disabled>Select a category</option>
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-1">Project (Optional)</label>
                            <select id="project" value={projectId || ''} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="">None</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    {category === 'Salaries' && type === TransactionType.EXPENSE && (
                        <div>
                            <label htmlFor="staff" className="block text-sm font-medium text-gray-300 mb-1">Staff Member</label>
                            <select id="staff" value={staffId || ''} onChange={e => setStaffId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="">Select Staff</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 pt-4">
                         <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-8 py-3 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal;
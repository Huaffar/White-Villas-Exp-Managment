
import React, { useState } from 'react';
import { Transaction, TransactionType, Category, Project, StaffMember } from '../types';

interface AddTransactionProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
    projects: Project[];
    staff: StaffMember[];
    incomeCategories: Category[];
    expenseCategories: Category[];
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAddTransaction, projects, staff, incomeCategories, expenseCategories }) => {
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [details, setDetails] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [projectId, setProjectId] = useState<number | undefined>(undefined);
    const [staffId, setStaffId] = useState<number | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!details || !amount || !category) {
            alert('Please fill all required fields.');
            return;
        }

        onAddTransaction({
            date,
            details,
            category,
            type,
            amount: parseFloat(amount),
            projectId: projectId,
            staffId: staffId,
        });

        // Reset form
        setDetails('');
        setCategory('');
        setAmount('');
        setProjectId(undefined);
        setStaffId(undefined);
    };

    const categories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">Add New Transaction</h2>
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

                <div className="flex justify-end pt-4">
                    <button type="submit" className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Add Transaction</button>
                </div>
            </form>
        </div>
    );
};

export default AddTransaction;

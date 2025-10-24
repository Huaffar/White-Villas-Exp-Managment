
import React, { useState } from 'react';
import { Transaction, TransactionType, Category, Project, StaffMember } from '../types';

interface AddTransactionProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
    incomeCategories: Category[];
    expenseCategories: Category[];
    projects: Project[];
    staff: StaffMember[];
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAddTransaction, incomeCategories, expenseCategories, projects, staff }) => {
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [projectId, setProjectId] = useState<number | undefined>(undefined);
    const [staffId, setStaffId] = useState<number | undefined>(undefined);
    const [feedback, setFeedback] = useState('');

    const categories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!details || !amount || !category) {
            setFeedback('Please fill all required fields.');
            return;
        }

        onAddTransaction({
            date,
            details,
            amount: parseFloat(amount),
            type,
            category,
            projectId,
            staffId,
        });

        // Reset form
        setDetails('');
        setAmount('');
        setCategory('');
        setProjectId(undefined);
        setStaffId(undefined);
        setFeedback('Transaction added successfully!');
        setTimeout(() => setFeedback(''), 3000);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-yellow-400">Add New Transaction</h1>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => { setType(TransactionType.INCOME); setCategory(''); }} className={`w-full py-3 rounded-lg font-semibold ${type === TransactionType.INCOME ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Income</button>
                            <button type="button" onClick={() => { setType(TransactionType.EXPENSE); setCategory(''); }} className={`w-full py-3 rounded-lg font-semibold ${type === TransactionType.EXPENSE ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Expense</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                        </div>
                         <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g., 50000" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                        </div>
                    </div>
                   
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">Details</label>
                        <input type="text" id="details" value={details} onChange={e => setDetails(e.target.value)} required placeholder="e.g., Office Rent - May" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>

                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                            <option value="" disabled>Select a category</option>
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-1">Link to Project (Optional)</label>
                            <select id="project" value={projectId || ''} onChange={e => setProjectId(Number(e.target.value) || undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                                <option value="">None</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="staff" className="block text-sm font-medium text-gray-300 mb-1">Link to Staff (Optional)</label>
                            <select id="staff" value={staffId || ''} onChange={e => setStaffId(Number(e.target.value) || undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                                <option value="">None</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Add Transaction</button>
                    </div>
                </form>

                 {feedback && <div className="mt-4 text-center p-3 rounded-lg bg-green-900/50 border border-green-700 text-green-300">{feedback}</div>}
            </div>
        </div>
    );
};

export default AddTransaction;

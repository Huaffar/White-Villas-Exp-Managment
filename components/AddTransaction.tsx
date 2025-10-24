
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory, Project } from '../types';

interface AddTransactionProps {
    onAddTransaction: (transaction: Omit<Transaction, 'balance' | 'id'>) => void;
    savedExpenseDetails: string[];
    projects: Project[];
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAddTransaction, savedExpenseDetails, projects }) => {
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<IncomeCategory | ExpenseCategory>(ExpenseCategory.OFFICE);
    const [projectId, setProjectId] = useState<string>('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (type === TransactionType.INCOME) {
            setCategory(IncomeCategory.CLIENT_PAYMENT);
        } else {
            setCategory(ExpenseCategory.OFFICE);
        }
    }, [type]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !details || !amount || !category) {
            setFeedback('All fields are required.');
            return;
        }

        onAddTransaction({
            date,
            details,
            type,
            amount: parseFloat(amount),
            category,
            projectId: projectId ? parseInt(projectId, 10) : undefined,
        });
        
        setFeedback('Transaction added successfully!');
        // Reset form
        setDetails('');
        setAmount('');
        setProjectId('');
        setType(TransactionType.EXPENSE);
        setCategory(ExpenseCategory.OFFICE);
        setTimeout(() => setFeedback(''), 3000);
    };

    const categoriesToShow = type === TransactionType.INCOME 
        ? Object.values(IncomeCategory) 
        : Object.values(ExpenseCategory);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
                    <div className="flex gap-4">
                       <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-full py-2 rounded-md ${type === TransactionType.INCOME ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Income</button>
                       <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-2 rounded-md ${type === TransactionType.EXPENSE ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}>Expense</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500"/>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Amount (PKR)</label>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 5000" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500"/>
                    </div>
                </div>

                <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-2">Details</label>
                    <input 
                        type="text" 
                        id="details" 
                        value={details} 
                        onChange={e => setDetails(e.target.value)} 
                        placeholder={type === TransactionType.INCOME ? "e.g., Client payment for RNO#725" : "e.g., Office electricity bill"}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500"
                        list={type === TransactionType.EXPENSE ? "expense-details-list" : undefined}
                    />
                    {type === TransactionType.EXPENSE && (
                        <datalist id="expense-details-list">
                            {savedExpenseDetails.map((detail, index) => (
                                <option key={index} value={detail} />
                            ))}
                        </datalist>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as IncomeCategory | ExpenseCategory)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                            {categoriesToShow.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">Project (Optional)</label>
                        <select id="project" value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                            <option value="">None</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex justify-end items-center">
                    {feedback && <p className="text-sm text-green-400 mr-4">{feedback}</p>}
                    <button type="submit" className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors duration-200">
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTransaction;

import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category } from '../types';

interface OwnerPaymentsProps {
    transactions: Transaction[];
    categories: Category[];
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
}

const OwnerPayments: React.FC<OwnerPaymentsProps> = ({ transactions, categories, onAddTransaction }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [details, setDetails] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]?.name || '');

    const ownerTransactions = useMemo(() => {
        return transactions
            .filter(t => t.type === TransactionType.AMOUNT_OUT)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions]);

    const totalAmountOut = useMemo(() => {
        return ownerTransactions.reduce((sum, t) => sum + t.amount, 0);
    }, [ownerTransactions]);

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
            type: TransactionType.AMOUNT_OUT,
            amount: parseFloat(amount),
        });

        // Reset form
        setDetails('');
        setAmount('');
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold primary-text">Owner & Partner Payments</h1>
            <p className="text-gray-400 -mt-6">Track payments to owners, partners, or capital withdrawals. These are not counted as business expenses.</p>
            
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="text-center">
                    <p className="text-sm text-gray-400 font-medium">Total Amount Paid Out</p>
                    <p className="text-3xl font-bold text-orange-400">PKR {totalAmountOut.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Add New Payment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">Details / Remarks</label>
                            <input type="text" id="details" value={details} onChange={e => setDetails(e.target.value)} required placeholder="e.g., Land payment installment" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g., 500000" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" className="w-full px-6 py-3 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">Add Payment</button>
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                     <h2 className="text-xl font-bold text-white mb-4">Payment History</h2>
                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Details</th>
                                    <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ownerTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                        <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                        <td className="px-6 py-4 text-right font-semibold text-orange-400">
                                            {t.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {ownerTransactions.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-16 text-gray-400">No payments recorded yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerPayments;

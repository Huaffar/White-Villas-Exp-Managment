

import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Transaction, Vendor, Category, TransactionType } from '../types';

interface AddVendorPaymentModalProps {
    vendor: Vendor;
    categories: Category[]; // Expense categories
    onAddPayment: (payment: Omit<Transaction, 'id' | 'balance'>) => void;
    onClose: () => void;
}

const AddVendorPaymentModal: React.FC<AddVendorPaymentModalProps> = ({ vendor, categories, onAddPayment, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [details, setDetails] = useState(`Payment to ${vendor.name}`);
    const [category, setCategory] = useState(categories[0]?.name || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !category) {
            alert('Please fill all required fields.');
            return;
        }
        onAddPayment({
            date,
            details,
            category,
            // FIX: Use TransactionType enum instead of string literal.
            type: TransactionType.EXPENSE,
            amount: parseFloat(amount),
            // We can add vendorId to transaction if we extend the type
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Record Payment to {vendor.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Payment Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Expense Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Details</label>
                        <input type="text" value={details} onChange={e => setDetails(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500">Add Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVendorPaymentModal;
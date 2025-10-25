// FIX: Added full content for AddCommissionModal.tsx.
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { StaffMember } from '../types';

interface AddCommissionModalProps {
  staffMember: StaffMember;
  onAdd: (staffMember: StaffMember, amount: number, remarks: string) => void;
  onClose: () => void;
}

const AddCommissionModal: React.FC<AddCommissionModalProps> = ({ staffMember, onAdd, onClose }) => {
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(staffMember, parseFloat(amount), remarks);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Add Commission for {staffMember.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Commission Amount (PKR)</label>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-300 mb-1">Remarks</label>
                        <input type="text" id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} required placeholder="e.g., For Villa Renovation project" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Add Commission</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCommissionModal;
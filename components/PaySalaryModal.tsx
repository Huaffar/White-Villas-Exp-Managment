import React, { useState } from 'react';
import { StaffMember, Transaction } from '../types';

interface PaySalaryModalProps {
  staffMember: StaffMember;
  lastPayment: Transaction | null;
  onPay: (staffMember: StaffMember, amount: number, remarks: string) => void;
  onClose: () => void;
}

const PaySalaryModal: React.FC<PaySalaryModalProps> = ({ staffMember, lastPayment, onPay, onClose }) => {
  const [amount, setAmount] = useState(staffMember.salary.toString());
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPay(staffMember, parseFloat(amount), remarks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">Pay Salary for {staffMember.name}</h2>
        <p className="text-sm text-gray-400 mb-6">Review details and confirm payment.</p>

        <div className="mb-6 bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-400">Base Salary:</span>
                <span className="font-semibold text-white">PKR {staffMember.salary.toLocaleString()}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-400">Joining Date:</span>
                <span className="font-semibold text-white">{new Date(staffMember.joiningDate).toLocaleDateString()}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-400">Last Payment Date:</span>
                <span className="font-semibold text-white">{lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'N/A'}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-400">Last Payment Amount:</span>
                <span className="font-semibold text-white">{lastPayment ? `PKR ${lastPayment.amount.toLocaleString()}`: 'N/A'}</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Payment Amount (PKR)</label>
            <input 
                type="number" 
                id="amount" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-lg focus:ring-yellow-500 focus:border-yellow-500" 
            />
            <p className="text-xs text-gray-500 mt-1">Adjust amount for bonuses, commissions, or deductions.</p>
          </div>
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-300 mb-1">Remarks (Optional)</label>
            <textarea 
                id="remarks" 
                value={remarks} 
                onChange={e => setRemarks(e.target.value)} 
                rows={2}
                placeholder="e.g., October bonus included"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500"
            ></textarea>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500">Confirm Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaySalaryModal;

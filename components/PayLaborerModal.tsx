import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Laborer, Project } from '../types';

interface PayLaborerModalProps {
  laborer: Laborer;
  projects: Project[];
  onPay: (laborer: Laborer, amount: number, remarks: string, paymentDate: string, projectId: number) => void;
  onClose: () => void;
}

const PayLaborerModal: React.FC<PayLaborerModalProps> = ({ laborer, projects, onPay, onClose }) => {
    const [days, setDays] = useState('1');
    const [amount, setAmount] = useState(laborer.dailyWage.toString());
    const [remarks, setRemarks] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [projectId, setProjectId] = useState<number | undefined>(projects[0]?.id);

    const handleDaysChange = (d: string) => {
        setDays(d);
        const numDays = parseFloat(d) || 0;
        setAmount((numDays * laborer.dailyWage).toString());
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) {
            alert('Please select a construction project to assign this payment to.');
            return;
        }
        onPay(laborer, parseFloat(amount), remarks, paymentDate, projectId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Pay Laborer: {laborer.name}</h2>
                <p className="text-sm text-gray-400 mb-6">Daily Wage: PKR {laborer.dailyWage.toLocaleString()}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-1">Assign to Project (Required)</label>
                        <select id="project" value={projectId || ''} onChange={e => setProjectId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="days" className="block text-sm font-medium text-gray-300 mb-1">Number of Days</label>
                            <input type="number" id="days" value={days} onChange={e => handleDaysChange(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Total Amount (PKR)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-lg" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-300 mb-1">Payment Date</label>
                        <input type="date" id="paymentDate" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-gray-300 mb-1">Remarks (Optional)</label>
                        <input type="text" id="remarks" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder={`Payment for ${days} day(s)`} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
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

export default PayLaborerModal;
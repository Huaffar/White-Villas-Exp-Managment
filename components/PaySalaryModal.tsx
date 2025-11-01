
import React, { useState, useMemo } from 'react';
import { StaffMember, Transaction, Commission } from '../types';

interface PayStaffModalProps {
  staffMember: StaffMember;
  lastPayment: Transaction | null;
  unpaidCommissions: Commission[];
  onPaySalary: (staffMember: StaffMember, amount: number, remarks: string, paymentDate: string) => void;
  onPayCommission: (commissionIds: number[], paymentData: { date: string, remarks: string, totalAmount: number }) => void;
  onClose: () => void;
}

const PayStaffModal: React.FC<PayStaffModalProps> = ({ staffMember, lastPayment, unpaidCommissions, onPaySalary, onPayCommission, onClose }) => {
  const [activeTab, setActiveTab] = useState<'salary' | 'commission'>('salary');
  
  // Salary state
  const [salaryAmount, setSalaryAmount] = useState(staffMember.salary.toString());
  const [salaryRemarks, setSalaryRemarks] = useState('');
  const [salaryDate, setSalaryDate] = useState(new Date().toISOString().split('T')[0]);

  // Commission state
  const [selectedCommissions, setSelectedCommissions] = useState<number[]>([]);
  const [commissionDate, setCommissionDate] = useState(new Date().toISOString().split('T')[0]);
  
  const totalCommissionToPay = useMemo(() => {
    return unpaidCommissions
      .filter(c => selectedCommissions.includes(c.id))
      .reduce((sum, c) => sum + c.amount, 0);
  }, [selectedCommissions, unpaidCommissions]);

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaySalary(staffMember, parseFloat(salaryAmount), salaryRemarks, salaryDate);
  };

  const handleCommissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCommissions.length === 0) {
        alert("Please select at least one commission to pay.");
        return;
    }
    const remarks = `Paid ${selectedCommissions.length} commission(s) for ${staffMember.name}`;
    onPayCommission(selectedCommissions, { date: commissionDate, remarks, totalAmount: totalCommissionToPay });
  };
  
  const handleSelectAllCommissions = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedCommissions(unpaidCommissions.map(c => c.id));
      } else {
          setSelectedCommissions([]);
      }
  };

  const getTabClass = (tabName: 'salary' | 'commission') => {
      return `w-1/2 py-3 text-sm font-bold text-center rounded-t-lg transition-colors ${activeTab === tabName ? 'bg-gray-800 text-yellow-400' : 'bg-gray-900 text-gray-400 hover:bg-gray-700'}`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="flex">
            <button onClick={() => setActiveTab('salary')} className={getTabClass('salary')}>Pay Salary</button>
            <button onClick={() => setActiveTab('commission')} className={getTabClass('commission')}>Pay Commission</button>
        </div>
        
        {activeTab === 'salary' ? (
             <form onSubmit={handleSalarySubmit} className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Pay Salary for {staffMember.name}</h2>
                <div className="mb-6 bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Base Salary:</span><span className="font-semibold text-white">PKR {staffMember.salary.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Last Salary Date:</span><span className="font-semibold text-white">{lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'N/A'}</span></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Payment Date</label>
                        <input type="date" value={salaryDate} onChange={e => setSalaryDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
                        <input type="number" value={salaryAmount} onChange={e => setSalaryAmount(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white text-lg" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Remarks</label>
                    <input type="text" value={salaryRemarks} onChange={e => setSalaryRemarks(e.target.value)} placeholder={`Salary for ${new Date(salaryDate).toLocaleString('default', { month: 'long' })}`} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500">Confirm Payment</button>
                </div>
            </form>
        ) : (
            <form onSubmit={handleCommissionSubmit} className="p-8 space-y-4">
                 <h2 className="text-2xl font-bold text-yellow-400 mb-4">Pay Commission for {staffMember.name}</h2>
                 {unpaidCommissions.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex items-center border-b border-gray-600 pb-2 mb-2">
                             <input type="checkbox" id="select-all" onChange={handleSelectAllCommissions} className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-600" />
                             <label htmlFor="select-all" className="ml-3 text-sm font-medium text-gray-300">Select All</label>
                        </div>
                        {unpaidCommissions.map(c => (
                            <div key={c.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input type="checkbox" id={`comm-${c.id}`} checked={selectedCommissions.includes(c.id)} onChange={e => setSelectedCommissions(prev => e.target.checked ? [...prev, c.id] : prev.filter(id => id !== c.id))} className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-600" />
                                    <label htmlFor={`comm-${c.id}`} className="ml-3 text-sm text-gray-300">
                                        <span className="font-medium text-white">{c.remarks}</span>
                                        <span className="text-xs text-gray-400 block">{new Date(c.date).toLocaleDateString()}</span>
                                    </label>
                                </div>
                                <span className="font-semibold text-white">PKR {c.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                 ) : (
                     <p className="text-center text-gray-400 py-10">No unpaid commissions for this staff member.</p>
                 )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Payment Date</label>
                        <input type="date" value={commissionDate} onChange={e => setCommissionDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Total Amount to Pay</label>
                        <input type="text" readOnly value={`PKR ${totalCommissionToPay.toLocaleString()}`} className="w-full bg-gray-900 border-gray-600 rounded-lg px-3 py-2 text-white text-lg font-bold" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                    <button type="submit" disabled={selectedCommissions.length === 0} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">Pay Selected</button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default PayStaffModal;
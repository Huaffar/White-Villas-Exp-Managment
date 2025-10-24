// FIX: Added content for StaffProfile.tsx to display individual staff details.
import React from 'react';
import { StaffMember, Transaction, TransactionType } from '../types';

interface StaffProfileProps {
  staffMember: StaffMember;
  transactions: Transaction[];
  onBack: () => void;
  onAddCommission: () => void;
}

const HistoryTable: React.FC<{title: string, transactions: Transaction[]}> = ({ title, transactions }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
         <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
         <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Details</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? transactions.map(t => (
                        <tr key={t.id} className="border-b border-gray-700">
                            <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4">{t.details}</td>
                            <td className={`px-6 py-4 text-right font-semibold text-red-400`}>
                                {t.amount.toLocaleString()}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="text-center py-8 text-gray-400">No transactions in this category.</td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
)

const StaffProfile: React.FC<StaffProfileProps> = ({ staffMember, transactions, onBack, onAddCommission }) => {
  const salaryTransactions = transactions
    .filter(t => t.staffId === staffMember.id && t.category === 'Salaries')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const commissionTransactions = transactions
    .filter(t => t.staffId === staffMember.id && t.category === 'Commission')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300">
                &larr; Back to Staff Management
            </button>
             <button onClick={onAddCommission} className="px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500">
                Add Commission
            </button>
        </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white">{staffMember.name}</h2>
        <p className="text-gray-400">{staffMember.position}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <p><span className="text-gray-400">Salary:</span> <span className="font-semibold">PKR {staffMember.salary.toLocaleString()}</span></p>
            <p><span className="text-gray-400">Joining Date:</span> <span className="font-semibold">{new Date(staffMember.joiningDate).toLocaleDateString()}</span></p>
            <p><span className="text-gray-400">Contact:</span> <span className="font-semibold">{staffMember.contact}</span></p>
            <p><span className="text-gray-400">Status:</span> <span className="font-semibold">{staffMember.status}</span></p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <HistoryTable title="Salary Payment History" transactions={salaryTransactions} />
        <HistoryTable title="Commission History" transactions={commissionTransactions} />
      </div>

    </div>
  );
};

export default StaffProfile;
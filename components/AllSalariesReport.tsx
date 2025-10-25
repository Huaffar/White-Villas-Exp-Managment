

import React from 'react';
// FIX: Corrected import path for types.
import { Transaction, StaffMember, TransactionType } from '../types';
import { SystemCategoryNames } from '../App';

interface AllSalariesReportProps {
  transactions: Transaction[];
  staff: StaffMember[];
  systemCategoryNames: SystemCategoryNames;
}

const AllSalariesReport: React.FC<AllSalariesReportProps> = ({ transactions, staff, systemCategoryNames }) => {
    const salaryPayments = transactions
        .filter(t => t.type === TransactionType.EXPENSE && t.category === systemCategoryNames.salaries)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getStaffName = (staffId?: number) => {
        if (!staffId) return 'N/A';
        return staff.find(s => s.id === staffId)?.name || 'Unknown Staff';
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">All Salary Payments</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Staff Member</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaryPayments.map((t) => (
                            <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{getStaffName(t.staffId)}</td>
                                <td className="px-6 py-4">{t.details}</td>
                                <td className="px-6 py-4 text-right text-red-400">
                                    {t.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                         {salaryPayments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-400">No salary payments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllSalariesReport;
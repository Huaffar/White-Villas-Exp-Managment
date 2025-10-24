// FIX: Added content for StaffReport.tsx to display a payroll summary.
import React from 'react';
import { StaffMember, Transaction, TransactionType } from '../types';

interface StaffReportProps {
  staff: StaffMember[];
  transactions: Transaction[];
}

const StaffReport: React.FC<StaffReportProps> = ({ staff, transactions }) => {
    const salaryPayments = transactions.filter(t => t.category === 'Salaries' && t.type === TransactionType.EXPENSE);
    const totalSalariesPaid = salaryPayments.reduce((sum, t) => sum + t.amount, 0);

    const totalContractualSalary = staff
        .filter(s => s.status === 'Active')
        .reduce((sum, s) => sum + s.salary, 0);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Staff Payroll Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Salaries Paid (All Time)</p>
            <p className="text-2xl font-bold text-white">PKR {totalSalariesPaid.toLocaleString()}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Current Monthly Salary Expense</p>
            <p className="text-2xl font-bold text-white">PKR {totalContractualSalary.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffReport;

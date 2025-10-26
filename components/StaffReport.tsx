// FIX: Added content for StaffReport.tsx to display a payroll summary.
import React from 'react';
// FIX: Corrected import path for types.
import { StaffMember, Transaction, TransactionType } from '../types';
// FIX: Corrected import path for App to get SystemCategoryNames.
import { SystemCategoryNames } from '../App';

interface StaffReportProps {
  staff: StaffMember[];
  transactions: Transaction[];
  // FIX: Use `typeof SystemCategoryNames` to correctly type the prop based on the imported object value.
  systemCategoryNames: typeof SystemCategoryNames;
}

const StaffReport: React.FC<StaffReportProps> = ({ staff, transactions, systemCategoryNames }) => {
    const salaryPayments = transactions.filter(t => t.category === systemCategoryNames.salaries && t.type === TransactionType.EXPENSE);
    const totalSalariesPaid = salaryPayments.reduce((sum, t) => sum + t.amount, 0);

    const totalContractualSalary = staff
        .filter(s => s.status === 'Active')
        .reduce((sum, s) => sum + s.salary, 0);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-yellow-400 mb-4">Staff Payroll Report</h3>
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
import React from 'react';
import { Transaction } from '../types';
import CategoryComparisonReport from './CategoryComparisonReport';
import IncomeExpenseChart from './IncomeExpenseChart';

interface ReportsProps {
  transactions: Transaction[];
}

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Reports</h1>
      <IncomeExpenseChart data={transactions} />
      <CategoryComparisonReport transactions={transactions} />
    </div>
  );
};

export default Reports;

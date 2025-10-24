import React from 'react';
import { Transaction, StaffMember } from '../types';
import CategoryComparisonReport from './CategoryComparisonReport';
import StaffReport from './StaffReport';
import AllSalariesReport from './AllSalariesReport';

interface ReportsProps {
  transactions: Transaction[];
  staff: StaffMember[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, staff }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold primary-text">Reports</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <StaffReport staff={staff} transactions={transactions} />
        <CategoryComparisonReport transactions={transactions} />
        <AllSalariesReport transactions={transactions} staff={staff} />
      </div>
    </div>
  );
};

export default Reports;

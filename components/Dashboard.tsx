

import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Transaction, TransactionType } from '../types';
import StatCard from './StatCard';
import { BalanceIcon, IncomeIcon, ExpenseIcon, ProfitIcon, AdjustmentsHorizontalIcon } from './IconComponents';
import IncomeExpenseChart from './IncomeExpenseChart';
import DashboardHistoryCard from './DashboardHistoryCard';
import DashboardLineChart from './DashboardLineChart';
import DashboardLayoutModal from './DashboardLayoutModal';


interface DashboardProps {
  transactions: Transaction[];
}

export interface LayoutConfig {
  incomeExpense: number;
  incomeTrend: number;
  expenseTrend: number;
  ownerPayment: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [isLayoutModalOpen, setLayoutModalOpen] = useState(false);
  
  const [layout, setLayout] = useState<LayoutConfig>(() => {
      const savedLayout = localStorage.getItem('dashboardLayoutConfig');
      return savedLayout ? JSON.parse(savedLayout) : {
          incomeExpense: 2, // Full width
          incomeTrend: 1,   // Half width
          expenseTrend: 1,  // Half width
          ownerPayment: 1,  // Half width
      };
  });

  const handleSaveLayout = (newLayout: LayoutConfig) => {
      localStorage.setItem('dashboardLayoutConfig', JSON.stringify(newLayout));
      setLayout(newLayout);
  };
  
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalAmountOut = transactions
    .filter(t => t.type === TransactionType.AMOUNT_OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = transactions.length > 0 ? transactions.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].balance : 0;
  const profit = totalIncome - totalExpense - totalAmountOut;

  const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const amountOutTransactions = transactions.filter(t => t.type === TransactionType.AMOUNT_OUT);

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">Dashboard</h1>
          <button
              onClick={() => setLayoutModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white font-semibold text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Customize Layout
          </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Balance" 
          value={`PKR ${balance.toLocaleString()}`}
          icon={<BalanceIcon className="h-8 w-8 text-blue-400" />}
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Total Income" 
          value={`PKR ${totalIncome.toLocaleString()}`}
          icon={<IncomeIcon className="h-8 w-8 text-green-400" />}
          colorClass="bg-green-500"
        />
        <StatCard 
          title="Total Expense" 
          value={`PKR ${totalExpense.toLocaleString()}`}
          icon={<ExpenseIcon className="h-8 w-8 text-red-400" />}
          colorClass="bg-red-500"
        />
        <StatCard 
          title="Net Profit" 
          value={`PKR ${profit.toLocaleString()}`}
          icon={<ProfitIcon className="h-8 w-8 text-purple-400" />}
          colorClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`lg:col-span-${layout.incomeExpense}`}>
          <IncomeExpenseChart data={transactions} />
        </div>
        <div className={`lg:col-span-${layout.incomeTrend}`}>
          <DashboardLineChart transactions={incomeTransactions} title="Income" dataKey="income" color="#48BB78" />
        </div>
        <div className={`lg:col-span-${layout.expenseTrend}`}>
          <DashboardLineChart transactions={expenseTransactions} title="Expense" dataKey="expense" color="#F56565" />
        </div>
        <div className={`lg:col-span-${layout.ownerPayment}`}>
          <DashboardLineChart transactions={amountOutTransactions} title="Owner Payments" dataKey="expense" color="#FBBF24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardHistoryCard title="Recent Income" transactions={incomeTransactions} type={TransactionType.INCOME} />
        <DashboardHistoryCard title="Recent Expenses" transactions={expenseTransactions} type={TransactionType.EXPENSE} />
      </div>

      {isLayoutModalOpen && (
        <DashboardLayoutModal
          currentLayout={layout}
          onSave={handleSaveLayout}
          onClose={() => setLayoutModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
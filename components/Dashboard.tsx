
import React from 'react';
import { Transaction, TransactionType } from '../types';
import StatCard from './StatCard';
import { BalanceIcon, IncomeIcon, ExpenseIcon, ProfitIcon } from './IconComponents';
import IncomeExpenseChart from './IncomeExpenseChart';
import DashboardHistoryCard from './DashboardHistoryCard';
import DashboardLineChart from './DashboardLineChart';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = transactions.length > 0 ? transactions.slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[transactions.length - 1].balance : 0;
  const profit = totalIncome - totalExpense;

  const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Balance" 
          value={`PKR ${balance.toLocaleString()}`}
          icon={<BalanceIcon className="h-10 w-10 text-blue-400" />}
          colorClass="border-blue-500"
        />
        <StatCard 
          title="Total Income" 
          value={`PKR ${totalIncome.toLocaleString()}`}
          icon={<IncomeIcon className="h-10 w-10 text-green-400" />}
          colorClass="border-green-500"
        />
        <StatCard 
          title="Total Expense" 
          value={`PKR ${totalExpense.toLocaleString()}`}
          icon={<ExpenseIcon className="h-10 w-10 text-red-400" />}
          colorClass="border-red-500"
        />
        <StatCard 
          title="Net Profit" 
          value={`PKR ${profit.toLocaleString()}`}
          icon={<ProfitIcon className="h-10 w-10 text-purple-400" />}
          colorClass="border-purple-500"
        />
      </div>

      <IncomeExpenseChart data={transactions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DashboardLineChart transactions={incomeTransactions} title="Income" dataKey="income" color="#48BB78" />
          <DashboardLineChart transactions={expenseTransactions} title="Expense" dataKey="expense" color="#F56565" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardHistoryCard title="Recent Income" transactions={incomeTransactions} type={TransactionType.INCOME} />
        <DashboardHistoryCard title="Recent Expenses" transactions={expenseTransactions} type={TransactionType.EXPENSE} />
      </div>

    </div>
  );
};

export default Dashboard;

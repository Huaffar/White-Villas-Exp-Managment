import React from 'react';
// FIX: Added ExpenseHub component that was missing.
import { Transaction, ExpenseCategory, TransactionType } from '../types';
import IncomeExpenseChart from './IncomeExpenseChart';
import StatCard from './StatCard';
import { ExpenseIcon } from './IconComponents';

interface ExpenseHubProps {
    transactions: Transaction[];
}

const ExpenseHub: React.FC<ExpenseHubProps> = ({ transactions }) => {
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const expenseByCategory: { [key: string]: number } = {};
    expenseTransactions.forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(expenseByCategory).sort(([, a], [, b]) => b - a)[0];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-yellow-400">Expense Hub</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Total Expenses This Month"
                    value={`PKR ${totalExpense.toLocaleString()}`}
                    icon={<ExpenseIcon />}
                    colorClass="border-red-500"
                />
                 <StatCard
                    title="Top Spending Category"
                    value={topCategory ? `${topCategory[0]}` : 'N/A'}
                    icon={<div className="text-3xl">💸</div>}
                    colorClass="border-purple-500"
                />
            </div>
            
            <IncomeExpenseChart data={transactions} />

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Expenses by Category</h3>
                <div className="space-y-4">
                    {Object.entries(expenseByCategory)
                        .sort(([, a], [, b]) => b - a)
                        .map(([category, amount]) => (
                            <div key={category}>
                                <div className="flex justify-between mb-1 text-gray-300">
                                    <span>{category}</span>
                                    <span>PKR {amount.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(amount / totalExpense) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ExpenseHub;

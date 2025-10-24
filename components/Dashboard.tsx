
import React, { useMemo } from 'react';
import { previousMonthBalance } from '../data/mockData';
import { Transaction, TransactionType } from '../types';
import StatCard from './StatCard';
import DashboardLineChart from './DashboardLineChart';
import DashboardHistoryCard from './DashboardHistoryCard';
import { IncomeIcon, ExpenseIcon, BalanceIcon } from './IconComponents';

interface DashboardProps {
    transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {

    const { 
        totalIncome, 
        totalExpense, 
        remainingBalance,
        incomeTransactions,
        expenseTransactions,
    } = useMemo(() => {
        const income = transactions.filter(t => t.type === TransactionType.INCOME);
        const expense = transactions.filter(t => t.type === TransactionType.EXPENSE);
        
        const incomeTotal = income.reduce((acc, t) => acc + t.amount, 0);
        const expenseTotal = expense.reduce((acc, t) => acc + t.amount, 0);

        const balance = previousMonthBalance + incomeTotal - expenseTotal;

        return { 
            totalIncome: incomeTotal, 
            totalExpense: expenseTotal, 
            remainingBalance: balance,
            incomeTransactions: income,
            expenseTransactions: expense
        };
    }, [transactions]);

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Income" 
                    value={`PKR ${totalIncome.toLocaleString()}`} 
                    icon={<IncomeIcon />}
                    colorClass="border-green-500"
                />
                <StatCard 
                    title="Total Expense" 
                    value={`PKR ${totalExpense.toLocaleString()}`} 
                    icon={<ExpenseIcon />}
                    colorClass="border-red-500"
                />
                <StatCard 
                    title="Remaining Balance" 
                    value={`PKR ${remainingBalance.toLocaleString()}`} 
                    icon={<BalanceIcon />}
                    colorClass="border-blue-500"
                />
            </div>

            {/* Line Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardLineChart 
                    transactions={incomeTransactions}
                    title="Income"
                    dataKey="income"
                    color="#48BB78"
                />
                 <DashboardLineChart 
                    transactions={expenseTransactions}
                    title="Expense"
                    dataKey="expense"
                    color="#F56565"
                />
            </div>

            {/* History Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardHistoryCard 
                    transactions={incomeTransactions}
                    title="Recent Income"
                    type={TransactionType.INCOME}
                />
                <DashboardHistoryCard 
                    transactions={expenseTransactions}
                    title="Recent Expenses"
                    type={TransactionType.EXPENSE}
                />
            </div>
        </div>
    );
};

export default Dashboard;

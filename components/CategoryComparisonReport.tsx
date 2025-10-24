// FIX: Replaced placeholder content with a fully functional CategoryComparisonReport component.
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryComparisonReportProps {
  transactions: Transaction[];
}

const CategoryComparisonReport: React.FC<CategoryComparisonReportProps> = ({ transactions }) => {
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

    const dataByCategory = expenseTransactions.reduce((acc, t) => {
        if (!acc[t.category]) {
            acc[t.category] = { name: t.category, amount: 0 };
        }
        acc[t.category].amount += t.amount;
        return acc;
    }, {} as { [key: string]: { name: string; amount: number } });

    const chartData = Object.values(dataByCategory);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Expense Comparison by Category</h3>
             <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis type="number" stroke="#A0AEC0" />
                        <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={100} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                            labelStyle={{ color: '#F7FAFC' }}
                        />
                        <Legend wrapperStyle={{ color: '#F7FAFC' }} />
                        <Bar dataKey="amount" fill="#F56565" name="Total Expense" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CategoryComparisonReport;

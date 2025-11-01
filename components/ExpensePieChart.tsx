import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ExpensePieChartProps {
  transactions: Transaction[];
}

const COLORS = ['#F56565', '#ED8936', '#FBBF24', '#48BB78', '#4299E1', '#9F7AEA', '#ED64A6'];

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ transactions }) => {
    const chartData = useMemo(() => {
        const expenseByCategory: { [key: string]: number } = {};
        transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .forEach(t => {
                expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
            });
        
        return Object.entries(expenseByCategory)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

    }, [transactions]);

    if (chartData.length === 0) {
        return (
            <div className="bg-background-tertiary p-6 rounded-lg shadow-inner h-full flex items-center justify-center">
                 <div className="text-center">
                    <h3 className="text-xl font-semibold text-text-strong mb-4">Expense Breakdown</h3>
                    <p className="text-text-secondary">No expense data for this period.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-background-tertiary p-6 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-text-strong mb-4">Expense Breakdown</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <Tooltip
                            contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-secondary)' }}
                            formatter={(value: number) => [`PKR ${value.toLocaleString()}`, "Amount"]}
                        />
                        <Legend wrapperStyle={{color: 'var(--text-primary)'}}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExpensePieChart;

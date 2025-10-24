
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ChartProps {
  data: Transaction[];
}

const IncomeExpenseChart: React.FC<ChartProps> = ({ data }) => {
    const processDataForChart = (transactions: Transaction[]) => {
        const dailyData: { [key: string]: { date: string; income: number; expense: number } } = {};

        transactions.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format
            if (!dailyData[date]) {
                dailyData[date] = { date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), income: 0, expense: 0 };
            }
            if (t.type === TransactionType.INCOME) {
                dailyData[date].income += t.amount;
            } else {
                dailyData[date].expense += t.amount;
            }
        });

        return Object.values(dailyData).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    const chartData = processDataForChart(data);
  
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Income vs Expense</h3>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                            labelStyle={{ color: '#F7FAFC' }}
                        />
                        <Legend wrapperStyle={{ color: '#F7FAFC' }} />
                        <Bar dataKey="income" fill="#48BB78" name="Income" />
                        <Bar dataKey="expense" fill="#F56565" name="Expense" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default IncomeExpenseChart;

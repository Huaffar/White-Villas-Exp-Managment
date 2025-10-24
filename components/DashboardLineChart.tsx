
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';

interface ChartProps {
  transactions: Transaction[];
  title: string;
  dataKey: 'income' | 'expense';
  color: string;
}

const DashboardLineChart: React.FC<ChartProps> = ({ transactions, title, dataKey, color }) => {
    const processDataForChart = (trans: Transaction[]) => {
        const dailyData: { [key: string]: { date: string; amount: number } } = {};

        trans.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format
            if (!dailyData[date]) {
                dailyData[date] = { date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), amount: 0 };
            }
            dailyData[date].amount += t.amount;
        });

        return Object.values(dailyData).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    const chartData = processDataForChart(transactions);
    const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{capitalizedTitle} Trend</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="date" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                            labelStyle={{ color: '#F7FAFC' }}
                            formatter={(value: number) => [value.toLocaleString(), capitalizedTitle]}
                        />
                        <Legend wrapperStyle={{ color: '#F7FAFC' }} />
                        <Line type="monotone" dataKey="amount" stroke={color} strokeWidth={2} name={capitalizedTitle} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardLineChart;

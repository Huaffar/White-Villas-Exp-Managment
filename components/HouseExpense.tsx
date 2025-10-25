import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, AdminProfile } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import HouseExpenseReport from './HouseExpenseReport';
import { PrinterIcon } from './IconComponents';
import { SystemCategoryNames } from '../App';

interface HouseExpenseProps {
    transactions: Transaction[];
    adminProfile: AdminProfile;
    systemCategoryNames: SystemCategoryNames;
}

const HouseExpense: React.FC<HouseExpenseProps> = ({ transactions, adminProfile, systemCategoryNames }) => {
    const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'lifetime'>('monthly');
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    const houseTransactions = useMemo(() => {
        return transactions.filter(t => t.category === systemCategoryNames.houseExpense && t.type === TransactionType.EXPENSE);
    }, [transactions, systemCategoryNames.houseExpense]);

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let startDate: Date;

        switch (filter) {
            case 'daily':
                startDate = today;
                break;
            case 'weekly':
                const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1
                startDate = new Date(today.setDate(today.getDate() - dayOfWeek));
                break;
            case 'monthly':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lifetime':
            default:
                startDate = new Date(0);
                break;
        }

        return houseTransactions.filter(t => new Date(t.date) >= startDate);
    }, [houseTransactions, filter]);
    
    const totalExpense = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

    const processDataForChart = (transactionsToProcess: Transaction[]) => {
        const dailyData: { [key: string]: { date: string; expense: number } } = {};

        transactionsToProcess.forEach(t => {
            const dateKey = new Date(t.date).toLocaleDateString('en-CA');
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = { date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), expense: 0 };
            }
            dailyData[dateKey].expense += t.amount;
        });

        return Object.keys(dailyData).sort().map(dateKey => dailyData[dateKey]);
    }

    const chartData = processDataForChart(filteredTransactions);

    const getFilterTitle = () => {
        switch (filter) {
            case 'daily': return 'Today';
            case 'weekly': return 'This Week';
            case 'monthly': return 'This Month';
            case 'lifetime': return 'All Time';
        }
    };

    return (
        <>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold primary-text">House Expense Report</h1>
                
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-300">Show report for:</p>
                        <div className="flex bg-gray-700 rounded-lg p-1">
                            <button onClick={() => setFilter('daily')} className={`px-4 py-1 rounded-md text-sm font-semibold ${filter === 'daily' ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-600'}`}>Today</button>
                            <button onClick={() => setFilter('weekly')} className={`px-4 py-1 rounded-md text-sm font-semibold ${filter === 'weekly' ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-600'}`}>This Week</button>
                            <button onClick={() => setFilter('monthly')} className={`px-4 py-1 rounded-md text-sm font-semibold ${filter === 'monthly' ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-600'}`}>This Month</button>
                            <button onClick={() => setFilter('lifetime')} className={`px-4 py-1 rounded-md text-sm font-semibold ${filter === 'lifetime' ? 'primary-bg text-gray-900' : 'text-gray-300 hover:bg-gray-600'}`}>All Time</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <button onClick={() => setReportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                            <PrinterIcon className="h-4 w-4" /> Generate Report
                        </button>
                        <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-red-500 text-right">
                            <p className="text-sm text-gray-400 font-medium">{`Total Expense (${getFilterTitle()})`}</p>
                            <p className="text-2xl font-bold text-white">{adminProfile.currencySymbol} {totalExpense.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Expense Trend ({getFilterTitle()})</h3>
                    <div style={{ width: '100%', height: 300 }}>
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
                                <Bar dataKey="expense" fill="#F56565" name="House Expense" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Detailed Transactions ({getFilterTitle()})</h3>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                                <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                                <tr key={t.id} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-red-400">
                                    {t.amount.toLocaleString()}
                                    </td>
                                </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-400">No house expenses recorded for this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isReportModalOpen && (
                <HouseExpenseReport
                    transactions={filteredTransactions}
                    filterTitle={getFilterTitle()}
                    totalExpense={totalExpense}
                    onClose={() => setReportModalOpen(false)}
                    adminProfile={adminProfile}
                />
            )}
        </>
    );
};

export default HouseExpense;
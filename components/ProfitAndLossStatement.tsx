import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';

interface ProfitAndLossStatementProps {
    transactions: Transaction[];
}

const ProfitAndLossStatement: React.FC<ProfitAndLossStatementProps> = ({ transactions }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const reportData = useMemo(() => {
        if (!startDate || !endDate) {
            return null;
        }

        const filtered = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            // Adjust to avoid timezone issues by comparing dates only
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            
            return start <= transactionDate && transactionDate <= end;
        });

        const income = filtered.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const expense = filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        const amountOut = filtered.filter(t => t.type === TransactionType.AMOUNT_OUT).reduce((sum, t) => sum + t.amount, 0);
        const grossProfit = income - expense;
        const netProfit = grossProfit - amountOut;

        return { income, expense, amountOut, grossProfit, netProfit };
    }, [transactions, startDate, endDate]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Profit & Loss Statement</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
                <div>
                    <label className="text-sm text-gray-400">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
            </div>
            {reportData ? (
                <div className="space-y-3 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-lg"><span className="text-gray-300">Total Income:</span> <span className="font-semibold text-green-400">PKR {reportData.income.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg"><span className="text-gray-300">Total Expense:</span> <span className="font-semibold text-red-400">PKR {reportData.expense.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg border-t border-gray-600 pt-2 mt-2"><span className="text-gray-300 font-bold">Gross Profit:</span> <span className="font-bold text-blue-300">PKR {reportData.grossProfit.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg"><span className="text-gray-300">Owner/Partner Payments:</span> <span className="font-semibold text-orange-400">PKR {reportData.amountOut.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xl border-t-2 border-yellow-500 pt-2 mt-2"><span className="text-white font-bold">Net Profit:</span> <span className="font-bold text-yellow-400">PKR {reportData.netProfit.toLocaleString()}</span></div>
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">Please select a start and end date to generate the report.</p>
            )}
        </div>
    );
};

export default ProfitAndLossStatement;

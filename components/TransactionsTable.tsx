
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3 text-right">Income</th>
                        <th scope="col" className="px-6 py-3 text-right">Expense</th>
                        <th scope="col" className="px-6 py-3 text-right">Remaining Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-600/50">
                            <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                            <td className="px-6 py-4">{t.category}</td>
                            <td className="px-6 py-4 text-right text-green-400">
                                {t.type === TransactionType.INCOME ? t.amount.toLocaleString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-right text-red-400">
                                {t.type === TransactionType.EXPENSE ? t.amount.toLocaleString() : '-'}
                            </td>
                            <td className={`px-6 py-4 text-right font-bold ${t.balance >= 0 ? 'text-blue-300' : 'text-red-500'}`}>
                                {t.balance.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default TransactionsTable;

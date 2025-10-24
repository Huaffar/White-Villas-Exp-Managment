
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface HistoryCardProps {
  transactions: Transaction[];
  title: string;
  type: TransactionType;
}

const DashboardHistoryCard: React.FC<HistoryCardProps> = ({ transactions, title, type }) => {
  // Show latest 5 transactions
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const amountColor = type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-4 py-2">Date</th>
                        <th scope="col" className="px-4 py-2">Details</th>
                        <th scope="col" className="px-4 py-2">Category</th>
                        <th scope="col" className="px-4 py-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {recentTransactions.length > 0 ? recentTransactions.map((t) => (
                        <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                            <td className="px-4 py-3 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{t.details}</td>
                            <td className="px-4 py-3 text-gray-400">{t.category}</td>
                            <td className={`px-4 py-3 text-right font-semibold ${amountColor}`}>
                                {t.amount.toLocaleString()}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-500">No recent {title.toLowerCase()} recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default DashboardHistoryCard;

// FIX: Replaced placeholder content with a fully functional DashboardHistoryCard component.
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface DashboardHistoryCardProps {
    transactions: Transaction[];
    title: string;
    type: TransactionType;
}

const DashboardHistoryCard: React.FC<DashboardHistoryCardProps> = ({ transactions, title, type }) => {
    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const amountColor = type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400';

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <div className="space-y-4">
                {recentTransactions.length > 0 ? recentTransactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-white">{t.details}</p>
                            <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <p className={`font-bold ${amountColor}`}>{t.amount.toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-400 py-4">No recent transactions.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardHistoryCard;

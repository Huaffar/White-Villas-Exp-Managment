
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import TransactionsTable from './TransactionsTable';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredTransactions = useMemo(() => {
    let sorted = [...transactions].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    if (filter === 'all') {
      return sorted;
    }
    return sorted.filter(t => t.type === filter);
  }, [transactions, filter, sortOrder]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Transaction History</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center">
        <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'all' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600'}`}>All</button>
            <button onClick={() => setFilter(TransactionType.INCOME)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === TransactionType.INCOME ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Income</button>
            <button onClick={() => setFilter(TransactionType.EXPENSE)} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === TransactionType.EXPENSE ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Expense</button>
        </div>
        <div>
            <label htmlFor="sortOrder" className="text-sm text-gray-400 mr-2">Sort by Date:</label>
            <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-gray-700 rounded-lg px-2 py-1 text-sm">
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
            </select>
        </div>
      </div>
      
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
};

export default TransactionHistory;

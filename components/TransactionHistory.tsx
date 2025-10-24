import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDownIcon } from './IconComponents';

interface TransactionHistoryProps {
  transactions: Transaction[];
  incomeCategories: Category[];
  expenseCategories: Category[];
}

const CategoryGroup: React.FC<{category: string, transactions: Transaction[]}> = ({ category, transactions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const type = transactions[0]?.type;

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600">
                <div className="text-left">
                    <p className="font-bold text-white">{category}</p>
                    <p className="text-xs text-gray-400">{transactions.length} transactions</p>
                </div>
                <div className="flex items-center">
                    <span className={`font-bold text-lg mr-4 ${type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                        PKR {total.toLocaleString()}
                    </span>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-900">
                            <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            <th scope="col" className="px-6 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                            <tr key={t.id} className="border-b border-gray-700">
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                                {t.amount.toLocaleString()}
                                </td>
                                <td className={`px-6 py-4 text-right ${t.balance >= 0 ? 'text-blue-300' : 'text-red-500'}`}>
                                {t.balance.toLocaleString()}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, incomeCategories, expenseCategories }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const allCategories = [...incomeCategories, ...expenseCategories];
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                if (startDate && new Date(startDate) > transactionDate) return false;
                if (endDate && new Date(endDate) < transactionDate) return false;
                if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, startDate, endDate, selectedCategories]);

    const groupedTransactions = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            (acc[t.category] = acc[t.category] || []).push(t);
            return acc;
        }, {} as Record<string, Transaction[]>);
    }, [filteredTransactions]);

    const chartData = useMemo(() => {
        const dataMap: Record<string, { name: string; income: number; expense: number }> = {};
        
        allCategories.forEach(cat => {
            dataMap[cat.name] = { name: cat.name, income: 0, expense: 0 };
        });

        filteredTransactions.forEach(t => {
            if (t.type === TransactionType.INCOME) {
                if (dataMap[t.category]) dataMap[t.category].income += t.amount;
            } else {
                if (dataMap[t.category]) dataMap[t.category].expense += t.amount;
            }
        });
        return Object.values(dataMap).filter(d => d.income > 0 || d.expense > 0);
    }, [filteredTransactions, allCategories]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Transaction History & Analysis</h1>
      
       <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Category Comparison</h3>
             <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" stroke="#A0AEC0" angle={-45} textAnchor="end" interval={0} />
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

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="text-sm text-gray-400">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
                <label className="text-sm text-gray-400">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
             <div>
                <label className="text-sm text-gray-400">Categories</label>
                <select 
                    multiple 
                    value={selectedCategories} 
                    onChange={e => setSelectedCategories(Array.from(e.target.selectedOptions, option => option.value))}
                    className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                    {allCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <button onClick={() => setSelectedCategories([])} className="text-xs text-yellow-400 mt-1">Clear Selection</button>
            </div>
          </div>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([category, transactions]) => (
            <CategoryGroup key={category} category={category} transactions={transactions} />
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
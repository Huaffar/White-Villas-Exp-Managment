import React, { useState, useMemo } from 'react';
import { Transaction, IncomeCategory, ExpenseCategory } from '../types';
import StatCard from './StatCard';
import { CategoryReportIcon } from './IconComponents';

interface CategoryReportsProps {
  transactions: Transaction[];
}

const CategoryReports: React.FC<CategoryReportsProps> = ({ transactions }) => {
  const allCategories = useMemo(() => [
    ...Object.values(IncomeCategory), 
    ...Object.values(ExpenseCategory)
  ], []);

  const [selectedCategory, setSelectedCategory] = useState<string>(allCategories[0]);

  const { filteredTransactions, categoryTotal } = useMemo(() => {
    const filtered = transactions.filter(t => t.category === selectedCategory);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);
    return {
      filteredTransactions: filtered,
      categoryTotal: total,
    };
  }, [transactions, selectedCategory]);

  const isIncome = Object.values(IncomeCategory).includes(selectedCategory as IncomeCategory);

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Reports by Category</h2>
        <div className="max-w-md">
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-300 mb-2">
                Select a Category to View Report
            </label>
            <select 
                id="category-select" 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)} 
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500"
            >
                {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
      </div>
      
      <StatCard 
        title={`Total for ${selectedCategory}`}
        value={`PKR ${categoryTotal.toLocaleString()}`}
        icon={<CategoryReportIcon className="h-8 w-8 text-yellow-400" />}
        colorClass={isIncome ? "border-green-500" : "border-red-500"}
      />

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Transactions for {selectedCategory}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((t, index) => (
                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                <td className={`px-6 py-4 text-right ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.amount.toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center py-8 text-gray-400">No transactions found for this category.</td>
                        </tr>
                    )}
                </tbody>
                 {filteredTransactions.length > 0 && (
                    <tfoot>
                        <tr className="font-bold text-white bg-gray-700">
                            <td colSpan={2} className="px-6 py-3 text-right">Total</td>
                            <td className={`px-6 py-3 text-right ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                                {categoryTotal.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                 )}
            </table>
        </div>
    </div>

    </div>
  );
};

export default CategoryReports;

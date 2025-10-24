import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
}

const COLORS = ['#F56565', '#ED8936', '#ECC94B', '#48BB78', '#38B2AC', '#4299E1', '#667EEA', '#9F7AEA', '#ED64A6'];

const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  
  const { incomeTransactions, expenseTransactions, expenseByCategory } = useMemo(() => {
    const income = transactions.filter(t => t.type === TransactionType.INCOME);
    const expense = transactions.filter(t => t.type === TransactionType.EXPENSE);
    
    const categoryMap: { [key: string]: number } = {};
    expense.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    
    return {
      incomeTransactions: income,
      expenseTransactions: expense,
      expenseByCategory: categoryData,
    };
  }, [transactions]);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Expense Report</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Expense Details</h3>
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm text-left text-gray-300">
                {/* Expense Table */}
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {expenseTransactions.map((t, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-600/50">
                            <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                            <td className="px-6 py-4">{t.category}</td>
                            <td className="px-6 py-4 text-right text-red-400">{t.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold text-white bg-gray-700">
                    <td colSpan={3} className="px-6 py-3 text-right">Total Expenses</td>
                    <td className="px-6 py-3 text-right text-red-400">{totalExpense.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
             <h3 className="text-xl font-semibold text-white mb-4">Expense by Category</h3>
             <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false}>
                            {expenseByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Income Report</h2>
         <div className="overflow-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-300">
                {/* Income Table */}
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {incomeTransactions.map((t, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-600/50">
                            <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                            <td className="px-6 py-4">{t.category}</td>
                            <td className="px-6 py-4 text-right text-green-400">{t.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold text-white bg-gray-700">
                    <td colSpan={3} className="px-6 py-3 text-right">Total Income</td>
                    <td className="px-6 py-3 text-right text-green-400">{totalIncome.toLocaleString()}</td>
                  </tr>
                </tfoot>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
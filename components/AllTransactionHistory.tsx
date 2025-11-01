import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category, AdminProfile } from '../types';
import { PencilIcon, PrinterIcon, DownloadIcon } from './IconComponents';
import IncomeExpenseChart from './IncomeExpenseChart';
import ExpensePieChart from './ExpensePieChart';

interface AllTransactionHistoryProps {
  transactions: Transaction[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
  adminProfile: AdminProfile;
}

const AllTransactionHistory: React.FC<AllTransactionHistoryProps> = ({ transactions, incomeCategories, expenseCategories, onEditTransaction, adminProfile }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [transactionType, setTransactionType] = useState<'all' | TransactionType>('all');
    
    const allCategories = [...incomeCategories, ...expenseCategories];
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;


    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                const transactionDay = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
                
                if (startDate) {
                    const start = new Date(startDate);
                    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                    if (startDay > transactionDay) return false;
                }
                if (endDate) {
                    const end = new Date(endDate);
                    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                    if (endDay < transactionDay) return false;
                }
                if (transactionType !== 'all' && t.type !== transactionType) return false;
                if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;
                if (searchTerm && !t.details.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case 'amount-desc': return b.amount - a.amount;
                    case 'amount-asc': return a.amount - b.amount;
                    case 'date-desc': default: return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });
    }, [transactions, startDate, endDate, selectedCategories, sortBy, searchTerm, transactionType]);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTransactions, currentPage]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const summary = useMemo(() => {
        const totalIncome = filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        const totalAmountOut = filteredTransactions.filter(t => t.type === TransactionType.AMOUNT_OUT).reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome, totalExpense, totalAmountOut, net: totalIncome - totalExpense - totalAmountOut };
    }, [filteredTransactions]);

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) return;
        const headers = ['ID', 'Date', 'Details', 'Category', 'Type', 'Amount', 'Balance'];
        const csvRows = [headers.join(','), ...filteredTransactions.map(t => [t.id, t.date, `"${t.details.replace(/"/g, '""')}"`, t.category, t.type, t.amount, t.balance].join(','))];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'transaction_history.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSortBy('date-desc');
        setSearchTerm('');
        setSelectedCategories([]);
        setTransactionType('all');
    };

  return (
    <div className="space-y-8">
      <div className="no-print bg-gray-800 p-4 rounded-lg shadow-lg space-y-4 border-2 border-accent">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-accent">All Transaction History</h1>
            <div className="flex gap-2">
                 <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500"><DownloadIcon className="w-5 h-5" /> CSV</button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500"><PrinterIcon className="w-5 h-5" /> Print</button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
                <label className="text-sm text-gray-400 block mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
                <label className="text-sm text-gray-400 block mb-1">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
             <div>
                <label className="text-sm text-gray-400 block mb-1">Transaction Type</label>
                <select value={transactionType} onChange={e => setTransactionType(e.target.value as any)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="all">All Types</option>
                    <option value={TransactionType.INCOME}>Income</option>
                    <option value={TransactionType.EXPENSE}>Expense</option>
                    <option value={TransactionType.AMOUNT_OUT}>Amount Out</option>
                </select>
            </div>
             <div>
                <label className="text-sm text-gray-400 block mb-1">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="amount-desc">Amount (High-Low)</option>
                    <option value="amount-asc">Amount (Low-High)</option>
                </select>
            </div>
             <div className="col-span-full lg:col-span-2">
                <label className="text-sm text-gray-400 block mb-1">Search Details</label>
                <input type="text" placeholder="e.g., electricity bill, project payment" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
        </div>
        <div className="relative">
            <label className="text-sm text-gray-400 block mb-1">Filter by Categories</label>
            {/* FIX: Explicitly cast the `option` variable to HTMLOptionElement in the select's onChange handler to resolve a TypeScript error where the property 'value' was not found on type 'unknown'. */}
            <select multiple value={selectedCategories} onChange={e => setSelectedCategories(Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value))} className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                {allCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <button onClick={clearFilters} className="absolute top-0 right-0 text-sm text-yellow-400 hover:text-yellow-300">Clear All Filters</button>
        </div>
      </div>
      
       <div id="printable-history-area">
          <div className="hidden print:block text-center mb-6">
            <h1 className="text-2xl font-bold">{adminProfile.companyName}</h1>
            <h2 className="text-xl">Full Transaction History</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg"><p className="text-sm text-gray-400">Income</p><p className="text-2xl font-bold text-green-400">PKR {summary.totalIncome.toLocaleString()}</p></div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg"><p className="text-sm text-gray-400">Expense</p><p className="text-2xl font-bold text-red-400">PKR {summary.totalExpense.toLocaleString()}</p></div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg"><p className="text-sm text-gray-400">Owner Payouts</p><p className="text-2xl font-bold text-orange-400">PKR {summary.totalAmountOut.toLocaleString()}</p></div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg"><p className="text-sm text-gray-400">Net Flow</p><p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-blue-300' : 'text-red-500'}`}>PKR {summary.net.toLocaleString()}</p></div>
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <IncomeExpenseChart data={filteredTransactions} />
              <ExpensePieChart transactions={filteredTransactions} />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Detailed Transactions ({filteredTransactions.length} entries)</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">Date</th><th className="px-6 py-3">Details</th><th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3 text-right">Amount</th><th className="px-6 py-3 text-right">Balance</th>
                            <th className="px-6 py-3 text-center no-print">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedTransactions.map(t => (
                            <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                <td className="px-6 py-4">{t.category}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-400' : (t.type === TransactionType.EXPENSE ? 'text-red-400' : 'text-orange-400')}`}>{t.amount.toLocaleString()}</td>
                                <td className={`px-6 py-4 text-right ${t.balance >= 0 ? 'text-blue-300' : 'text-red-500'}`}>{t.balance.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center no-print"><button onClick={() => onEditTransaction(t)} className="text-blue-400 hover:text-blue-300"><PencilIcon className="w-4 h-4" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && <div className="text-center py-16 text-gray-400">No transactions match your current filters.</div>}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 no-print">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50">&larr; Prev</button>
                    <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-50">Next &rarr;</button>
                </div>
            )}
          </div>
       </div>
    </div>
  );
};

export default AllTransactionHistory;
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category, AdminProfile } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDownIcon, PencilIcon, PrinterIcon, DownloadIcon } from './IconComponents';

interface FullLedgerReportProps {
  transactions: Transaction[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
  adminProfile: AdminProfile;
}

const CategoryGroup: React.FC<{category: string, transactions: Transaction[], onEdit: (t: Transaction) => void}> = ({ category, transactions, onEdit }) => {
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
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
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
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onEdit(t)} className="text-blue-400 hover:text-blue-300">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
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

const FullLedgerReport: React.FC<FullLedgerReportProps> = ({ transactions, incomeCategories, expenseCategories, onEditTransaction, adminProfile }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'daily' | 'weekly' | 'monthly' | 'custom' | 'all'>('all');
    
    const allCategories = [...incomeCategories, ...expenseCategories];
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                // Adjust date to ignore time and timezone
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
                
                if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;
                if (searchTerm && !t.details.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'date-asc':
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                    case 'amount-desc':
                        return b.amount - a.amount;
                    case 'amount-asc':
                        return a.amount - b.amount;
                    case 'date-desc':
                    default:
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                }
            });
    }, [transactions, startDate, endDate, selectedCategories, sortBy, searchTerm]);

    const groupedTransactions = useMemo(() => {
        // FIX: Provide an explicit type for the initial value of reduce to prevent type errors.
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
    
    const summary = useMemo(() => {
        const totalIncome = filteredTransactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = filteredTransactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            totalIncome,
            totalExpense,
            net: totalIncome - totalExpense,
        };
    }, [filteredTransactions]);

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) {
            alert("No data to export for the current filters.");
            return;
        }
        const headers = ['ID', 'Date', 'Details', 'Category', 'Type', 'Amount', 'Balance'];
        const csvRows = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                t.id,
                t.date,
                `"${t.details.replace(/"/g, '""')}"`,
                t.category,
                t.type,
                t.amount,
                t.balance
            ].join(','))
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'transaction_history.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const setDateRange = (range: 'daily' | 'weekly' | 'monthly') => {
        setActiveFilter(range);
        const now = new Date();
        const end = now.toISOString().split('T')[0];
        let start = '';
    
        if (range === 'daily') {
            start = end;
        } else if (range === 'weekly') {
            const firstDayOfWeek = new Date(now);
            firstDayOfWeek.setDate(now.getDate() - now.getDay()); // Assuming Sunday is the first day
            start = firstDayOfWeek.toISOString().split('T')[0];
        } else if (range === 'monthly') {
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            start = firstDayOfMonth.toISOString().split('T')[0];
        }
        
        setStartDate(start);
        setEndDate(end);
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSortBy('date-desc');
        setSearchTerm('');
        setSelectedCategories([]);
        setActiveFilter('all');
    };

    const getButtonClass = (filterName: string) => {
        const base = 'px-3 py-1 rounded-md text-sm font-semibold transition-colors';
        if (activeFilter === filterName) {
            return `${base} primary-bg text-gray-900`;
        }
        return `${base} bg-gray-700 text-gray-300 hover:bg-gray-600`;
    };

    const getReportPeriodTitle = () => {
        switch (activeFilter) {
            case 'daily': return 'Today';
            case 'weekly': return 'This Week';
            case 'monthly': return 'This Month';
            case 'all': return 'All Time';
            case 'custom':
            default:
                if (startDate && endDate) return `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
                if (startDate) return `From ${new Date(startDate).toLocaleDateString()}`;
                if (endDate) return `Until ${new Date(endDate).toLocaleDateString()}`;
                return 'All Time';
        }
    };

  return (
    <div className="space-y-8">
      <div className="no-print bg-gray-800 p-4 rounded-lg shadow-lg space-y-4 border-2 border-blue-500">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h1 className="text-3xl font-bold primary-text">General Ledger</h1>
            <div className="flex gap-2">
                 <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500">
                    <DownloadIcon className="w-5 h-5" /> Export to CSV
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                    <PrinterIcon className="w-5 h-5" /> Print Report
                </button>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-700">
            <span className="text-sm font-semibold text-gray-400 mr-2">Quick Reports:</span>
            <button onClick={() => setDateRange('daily')} className={getButtonClass('daily')}>Today</button>
            <button onClick={() => setDateRange('weekly')} className={getButtonClass('weekly')}>This Week</button>
            <button onClick={() => setDateRange('monthly')} className={getButtonClass('monthly')}>This Month</button>
            <button onClick={clearFilters} className="ml-auto text-sm text-yellow-400 hover:text-yellow-300">Clear All Filters</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
            <div>
                <label className="text-sm text-gray-400 block mb-1">Start Date</label>
                <input type="date" value={startDate} onChange={e => {setStartDate(e.target.value); setActiveFilter('custom');}} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
                <label className="text-sm text-gray-400 block mb-1">End Date</label>
                <input type="date" value={endDate} onChange={e => {setEndDate(e.target.value); setActiveFilter('custom');}} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
                <label className="text-sm text-gray-400 block mb-1">Sort By</label>
                <select 
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="amount-desc">Amount (High to Low)</option>
                    <option value="amount-asc">Amount (Low to High)</option>
                </select>
            </div>
            <div>
                <label className="text-sm text-gray-400 block mb-1">Search Details</label>
                <input
                    type="text"
                    placeholder="e.g., electricity bill"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
            </div>
        </div>
        <div className="relative">
            <label className="text-sm text-gray-400 block mb-1">Filter by Categories</label>
            <select 
                multiple 
                value={selectedCategories} 
                onChange={e => setSelectedCategories(Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value))}
                className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
                {allCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <button onClick={() => setSelectedCategories([])} className="absolute bottom-2 right-2 text-xs primary-text hover:underline">Clear Selection</button>
        </div>
      </div>
      
       <div id="printable-history-area">
          <div className="hidden print:block text-center mb-6">
            <h1 className="text-2xl font-bold">{adminProfile.companyName}</h1>
            <h2 className="text-xl">Transaction Report ({getReportPeriodTitle()})</h2>
            <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-400">Filtered Income</p>
                <p className="text-2xl font-bold text-green-400">PKR {summary.totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-400">Filtered Expense</p>
                <p className="text-2xl font-bold text-red-400">PKR {summary.totalExpense.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="text-sm text-gray-400">Net Flow</p>
                <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-blue-300' : 'text-red-500'}`}>PKR {summary.net.toLocaleString()}</p>
            </div>
          </div>

           <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Category Comparison</h3>
                 <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" angle={-45} textAnchor="end" interval={0} height={100} tick={{ fontSize: 12 }} />
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

          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold text-white">Detailed Transactions</h3>
            {Object.entries(groupedTransactions).map(([category, groupTransactions]) => (
                <CategoryGroup key={category} category={category} transactions={groupTransactions} onEdit={onEditTransaction} />
            ))}
            {filteredTransactions.length === 0 && (
                <div className="text-center py-16 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No transactions match your current filters.</p>
                </div>
            )}
          </div>
          <div className="hidden print:block mt-16 pt-8 border-t text-right relative">
                {adminProfile.stampUrl && (
                    <img src={adminProfile.stampUrl} alt="Stamp" className="absolute -top-12 right-4 w-28 h-28 object-contain opacity-70" />
                )}
                <p className="text-sm text-gray-700">_________________________</p>
                <p className="text-sm text-gray-700 mt-2">Authorised Signatory</p>
            </div>
       </div>
    </div>
  );
};

export default FullLedgerReport;
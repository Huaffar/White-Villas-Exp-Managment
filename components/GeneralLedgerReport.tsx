import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import { DownloadIcon } from './IconComponents';

interface GeneralLedgerReportProps {
    transactions: Transaction[];
    incomeCategories: Category[];
    expenseCategories: Category[];
}

const GeneralLedgerReport: React.FC<GeneralLedgerReportProps> = ({ transactions, incomeCategories, expenseCategories }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'Income' | 'Expense'>('all');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [reportData, setReportData] = useState<Transaction[]>([]);

    const allCategories = useMemo(() => [...incomeCategories, ...expenseCategories], [incomeCategories, expenseCategories]);

    const handleGenerateReport = () => {
        const filtered = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (startDate && new Date(startDate) > transactionDate) return false;
            if (endDate && new Date(endDate) < transactionDate) return false;
            if (selectedType !== 'all' && t.type !== selectedType) return false;
            if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;
            return true;
        });
        setReportData(filtered);
    };

    const handleExportCSV = () => {
        if (reportData.length === 0) {
            alert("Please generate a report first.");
            return;
        }

        const headers = ['ID', 'Date', 'Details', 'Category', 'Type', 'Amount', 'Balance'];
        const csvContent = [
            headers.join(','),
            ...reportData.map(t => [
                t.id,
                t.date,
                `"${t.details.replace(/"/g, '""')}"`, // Handle quotes in details
                t.category,
                t.type,
                t.amount,
                t.balance
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `general_ledger_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold text-white">General Ledger Report</h2>
            
            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="text-sm text-gray-400">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <select value={selectedType} onChange={e => setSelectedType(e.target.value as any)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="all">All</option>
                        <option value={TransactionType.INCOME}>Income</option>
                        <option value={TransactionType.EXPENSE}>Expense</option>
                    </select>
                </div>
                <div className="lg:col-span-1">
                    <label className="text-sm text-gray-400">Categories</label>
                    {/* FIX: Cast `option` to HTMLOptionElement to resolve TypeScript error. */}
                    <select multiple value={selectedCategories} onChange={e => setSelectedCategories(Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value))} className="w-full h-24 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                         {allCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
                 <button onClick={handleGenerateReport} className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">
                    Generate Report
                </button>
                <button onClick={handleExportCSV} disabled={reportData.length === 0} className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    <DownloadIcon className="w-5 h-5" />
                    Export CSV
                </button>
            </div>
            
            {/* Report Table */}
            {reportData.length > 0 && (
                 <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map(t => (
                                <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                    <td className="px-6 py-4">{t.category}</td>
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
    );
};

export default GeneralLedgerReport;
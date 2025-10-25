import React from 'react';
import { Transaction, AdminProfile } from '../types';
import { PrinterIcon, CloseIcon, DownloadIcon } from './IconComponents';

interface HouseExpenseReportProps {
  transactions: Transaction[];
  filterTitle: string;
  totalExpense: number;
  adminProfile: AdminProfile;
  onClose: () => void;
}

const HouseExpenseReport: React.FC<HouseExpenseReportProps> = ({ transactions, filterTitle, totalExpense, adminProfile, onClose }) => {

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        const headers = ['Date', 'Details', 'Amount'];
        const csvRows = [
            headers.join(','),
            ...transactions.map(t => {
                const row = [
                    new Date(t.date).toLocaleDateString(),
                    `"${t.details.replace(/"/g, '""')}"`, // Handle quotes in details
                    t.amount,
                ];
                return row.join(',');
            })
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `house_expense_report_${filterTitle.toLowerCase().replace(/ /g, '_')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold primary-text">House Expense Report: {filterTitle}</h2>
                <div className="flex gap-4">
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500">
                        <DownloadIcon className="h-4 w-4" /> Export CSV
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                        <PrinterIcon className="h-4 w-4" /> Print
                    </button>
                    <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold text-sm rounded-lg hover:bg-gray-500">
                        <CloseIcon className="h-4 w-4" /> Close
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto w-full max-w-4xl">
                <div id="printable-report" className="bg-white text-gray-900 p-12 font-sans">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{adminProfile.companyName}</h1>
                        <p className="text-lg text-gray-700">House Expense Report</p>
                        <p className="text-gray-600">Period: {filterTitle}</p>
                        <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 text-center">Summary</h3>
                        <div className="text-center mt-2">
                           <span className="text-gray-600">Total Expense for the Period:</span>
                           <span className="font-bold text-2xl ml-2">{adminProfile.currencySymbol} {totalExpense.toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-8">Expense Transactions</h3>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-left">Details</th>
                                <th className="p-2 text-right">Amount ({adminProfile.currencySymbol})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} className="border-b">
                                    <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="p-2">{t.details}</td>
                                    <td className="p-2 text-right">{t.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-8 text-gray-500">No expenses found for this period.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold bg-gray-200">
                                <td colSpan={2} className="p-2 text-right">Total Expense</td>
                                <td className="p-2 text-right">{totalExpense.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="text-center text-xs text-gray-500 mt-16 pt-4 border-t">
                        <p>&copy; {new Date().getFullYear()} {adminProfile.companyName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseExpenseReport;
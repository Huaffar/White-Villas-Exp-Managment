import React from 'react';
// FIX: Added ProjectReport component that was missing.
import { Project, Transaction, TransactionType } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';

interface ProjectReportProps {
  project: Project;
  transactions: Transaction[];
  onClose: () => void;
}

const ProjectReport: React.FC<ProjectReportProps> = ({ project, transactions, onClose }) => {
    
    const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

    const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);
    const profit = totalIncome - totalExpense;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold text-yellow-400">Project Report: {project.name}</h2>
                <div className="flex gap-4">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
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
                        <h1 className="text-3xl font-bold text-gray-900">Project Financial Report</h1>
                        <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            <div>Client: <span className="font-bold">{project.clientName}</span></div>
                            <div>Status: <span className="font-bold">{project.status}</span></div>
                            <div>Start Date: <span className="font-bold">{new Date(project.startDate).toLocaleDateString()}</span></div>
                            <div>Budget: <span className="font-bold">PKR {project.budget.toLocaleString()}</span></div>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-8">Income Transactions</h3>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-left">Details</th>
                                <th className="p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeTransactions.map(t => (
                                <tr key={t.id} className="border-b"><td className="p-2">{new Date(t.date).toLocaleDateString()}</td><td className="p-2">{t.details}</td><td className="p-2 text-right">{t.amount.toLocaleString()}</td></tr>
                            ))}
                        </tbody>
                        <tfoot><tr className="font-bold"><td colSpan={2} className="p-2 text-right">Total Income</td><td className="p-2 text-right bg-gray-200">{totalIncome.toLocaleString()}</td></tr></tfoot>
                    </table>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-8">Expense Transactions</h3>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-left">Details</th>
                                <th className="p-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                             {expenseTransactions.map(t => (
                                <tr key={t.id} className="border-b"><td className="p-2">{new Date(t.date).toLocaleDateString()}</td><td className="p-2">{t.details}</td><td className="p-2 text-right">{t.amount.toLocaleString()}</td></tr>
                            ))}
                        </tbody>
                         <tfoot><tr className="font-bold"><td colSpan={2} className="p-2 text-right">Total Expense</td><td className="p-2 text-right bg-gray-200">{totalExpense.toLocaleString()}</td></tr></tfoot>
                    </table>

                    <div className="mt-8 pt-4 border-t-2 border-black grid grid-cols-3">
                        <div>&nbsp;</div>
                        <div className="text-right font-bold">Total Profit / Loss:</div>
                        <div className={`text-right font-bold text-xl ${profit >= 0 ? '' : 'text-red-600'}`}>PKR {profit.toLocaleString()}</div>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-16 pt-4 border-t">
                        <p>&copy; {new Date().getFullYear()} White Villas Accounting Pro</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectReport;

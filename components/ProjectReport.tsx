import React from 'react';
import { Project, Transaction, TransactionType, AdminProfile } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';
import { SystemCategoryNames } from '../App';

interface ProjectReportProps {
  project: Project;
  transactions: Transaction[];
  onClose: () => void;
  systemCategoryNames: typeof SystemCategoryNames;
  adminProfile: AdminProfile;
}

const ProjectReport: React.FC<ProjectReportProps> = ({ project, transactions, onClose, systemCategoryNames, adminProfile }) => {
    
    const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
    const materialTransactions = transactions.filter(t => t.category === systemCategoryNames.constructionMaterial);
    const laborTransactions = transactions.filter(t => t.category === systemCategoryNames.constructionLabor);
    const otherExpenseTransactions = transactions.filter(t => 
        t.type === TransactionType.EXPENSE && 
        t.category !== systemCategoryNames.constructionMaterial && 
        t.category !== systemCategoryNames.constructionLabor
    );

    const totalIncome = incomeTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalMaterial = materialTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalLabor = laborTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalOther = otherExpenseTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = totalMaterial + totalLabor + totalOther;
    const profit = totalIncome - totalExpense;
    
    const TransactionTable: React.FC<{title: string, data: Transaction[], isExpense?: boolean}> = ({ title, data, isExpense = false }) => (
        <div className="mb-6 break-inside-avoid">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <table className="w-full text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Details</th>
                        <th className="p-2 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(t => (
                        <tr key={t.id} className="border-b"><td className="p-2">{new Date(t.date).toLocaleDateString()}</td><td className="p-2">{t.details}</td><td className="p-2 text-right">{t.amount.toLocaleString()}</td></tr>
                    ))}
                    {data.length === 0 && <tr><td colSpan={3} className="text-center p-4 text-gray-500">No transactions in this category.</td></tr>}
                </tbody>
                {data.length > 0 && <tfoot><tr className="font-bold"><td colSpan={2} className="p-2 text-right">Subtotal</td><td className="p-2 text-right bg-gray-100">{data.reduce((s, t) => s + t.amount, 0).toLocaleString()}</td></tr></tfoot>}
            </table>
        </div>
    );

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
                    
                    <TransactionTable title="Income Transactions" data={incomeTransactions} />
                    <TransactionTable title="Material Costs" data={materialTransactions} isExpense />
                    <TransactionTable title="Labor Costs" data={laborTransactions} isExpense />
                    <TransactionTable title="Other Expenses" data={otherExpenseTransactions} isExpense />

                    <div className="mt-8 pt-4 border-t-2 border-black space-y-2">
                         <div className="flex justify-between text-md"><span className="font-semibold">Total Income:</span> <span className="font-semibold">PKR {totalIncome.toLocaleString()}</span></div>
                         <div className="flex justify-between text-md"><span className="font-semibold">Total Expense:</span> <span className="font-semibold">PKR {totalExpense.toLocaleString()}</span></div>
                         <div className={`flex justify-between text-xl font-bold border-t border-black mt-2 pt-2 ${profit >= 0 ? '' : 'text-red-600'}`}><span>Net Profit / Loss:</span> <span>PKR {profit.toLocaleString()}</span></div>
                    </div>

                    <div className="relative text-center text-xs text-gray-500 mt-16 pt-4 border-t">
                        {adminProfile.stampUrl && (
                            <img src={adminProfile.stampUrl} alt="Stamp" className="absolute -top-16 right-0 w-28 h-28 object-contain opacity-70" />
                        )}
                        <p>&copy; {new Date().getFullYear()} White Villas Accounting Pro</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectReport;
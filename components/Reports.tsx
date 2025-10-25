import React from 'react';
import { Transaction, StaffMember, Category, TransactionType } from '../types';
import { SystemCategoryNames } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PrinterIcon, DownloadIcon } from './IconComponents';
import GeneralLedgerReport from './GeneralLedgerReport';

interface ReportsProps {
  transactions: Transaction[];
  staff: StaffMember[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  systemCategoryNames: SystemCategoryNames;
}

const Reports: React.FC<ReportsProps> = ({ transactions, staff, incomeCategories, expenseCategories, systemCategoryNames }) => {
    
    // --- Helper Functions ---
    const exportToCSV = (data: any[], filename: string) => {
        if (data.length === 0) {
            alert("No data available to export.");
            return;
        }
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    let cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
                    if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                        cell = `"${cell.replace(/"/g, '""')}"`;
                    }
                    return cell;
                }).join(',')
            )
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = (elementId: string, reportTitle: string) => {
        const printContent = document.getElementById(elementId);
        if (printContent) {
            const printWindow = window.open('', '_blank');
            printWindow?.document.write(`
                <html>
                    <head>
                        <title>${reportTitle}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { font-family: sans-serif; margin: 20px; color: #111827; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
                            th { background-color: #f3f4f6; }
                            tr:nth-child(even) { background-color: #f9fafb; }
                            h1, h2, h3 { color: #111827; margin-bottom: 1rem;}
                            .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
                        </style>
                    </head>
                    <body>
                        <h1 class="text-3xl font-bold">${reportTitle}</h1>
                        ${printContent.innerHTML}
                    </body>
                </html>`);
            printWindow?.document.close();
            printWindow?.focus();
            setTimeout(() => { printWindow?.print(); }, 500);
        }
    };


    // --- Data Preparation ---
    const salaryPayments = transactions.filter(t => t.category === systemCategoryNames.salaries && t.type === TransactionType.EXPENSE);
    const totalSalariesPaid = salaryPayments.reduce((sum, t) => sum + t.amount, 0);
    const totalContractualSalary = staff.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.salary, 0);
    const getStaffName = (staffId?: number) => staff.find(s => s.id === staffId)?.name || 'Unknown Staff';
    
    const salaryPaymentsForTable = salaryPayments.map(t => ({
        Date: new Date(t.date).toLocaleDateString('en-CA'),
        'Staff Member': getStaffName(t.staffId),
        Details: t.details,
        Amount: t.amount,
    })).sort((a,b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()); // Ascending sort

    const expenseByCategory = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>);
    const expenseChartData = Object.entries(expenseByCategory)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-yellow-400">Reports</h1>

            <GeneralLedgerReport transactions={transactions} incomeCategories={incomeCategories} expenseCategories={expenseCategories} />
            
            <div className="bg-gray-800 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-yellow-400">Staff Payroll Report</h2>
                    <button onClick={() => handlePrint('payroll-summary', 'Staff Payroll Summary')} className="p-2 text-gray-300 hover:text-white bg-gray-700 rounded-md" title="Print Report">
                        <PrinterIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6" id="payroll-summary">
                    <div className="bg-gray-700/50 p-6 rounded-lg">
                        <p className="text-sm text-gray-400">Total Salaries Paid (All Time)</p>
                        <p className="text-3xl font-bold text-white">PKR {totalSalariesPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-700/50 p-6 rounded-lg">
                        <p className="text-sm text-gray-400">Current Monthly Salary Expense</p>
                        <p className="text-3xl font-bold text-white">PKR {totalContractualSalary.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">All Salary Payments</h2>
                    <div className="flex gap-2">
                        <button onClick={() => exportToCSV(salaryPaymentsForTable.map(t => ({...t, Date: new Date(t.Date).toLocaleDateString()})), 'salary_payments')} className="p-2 text-gray-300 hover:text-white bg-gray-700 rounded-md" title="Export as CSV">
                            <DownloadIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handlePrint('salary-payments-table', 'All Salary Payments')} className="p-2 text-gray-300 hover:text-white bg-gray-700 rounded-md" title="Print Report">
                            <PrinterIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div id="salary-payments-table" className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Staff Member</th>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaryPaymentsForTable.map((t, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(t.Date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{t['Staff Member']}</td>
                                    <td className="px-6 py-4">{t.Details}</td>
                                    <td className="px-6 py-4 text-right text-red-400 font-semibold">
                                        {t.Amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Expense Comparison by Category</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={expenseChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis type="number" stroke="#A0AEC0" />
                            <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={150} tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
                            <Bar dataKey="amount" fill="#ef4444" name="Total Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;

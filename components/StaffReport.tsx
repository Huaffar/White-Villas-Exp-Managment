import React from 'react';
import { Transaction, StaffMember } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';

interface StaffReportProps {
  staffMember: StaffMember;
  transactions: Transaction[];
  onClose: () => void;
}

const StaffReport: React.FC<StaffReportProps> = ({ staffMember, transactions, onClose }) => {
    
    const totalPaid = transactions.reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            {/* --- NON-PRINTABLE HEADER --- */}
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold text-yellow-400">Staff Report: {staffMember.name}</h2>
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500 transition-colors duration-200"
                    >
                        <PrinterIcon className="h-4 w-4" />
                        Print Report
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold text-sm rounded-lg hover:bg-gray-500 transition-colors duration-200"
                    >
                        <CloseIcon className="h-4 w-4" />
                        Close
                    </button>
                </div>
            </div>

            {/* --- PRINTABLE CONTENT --- */}
            <div className="overflow-y-auto w-full max-w-4xl">
                <div id="printable-report" className="bg-white text-gray-900 p-12 font-sans">
                    <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Employee Salary Report</h1>
                            <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-800">White Villas Lahore</h2>
                            <p className="text-sm text-gray-500">123 Bahria Orchard, Lahore, Pakistan</p>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Employee Details</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            <div className="font-medium">Name:</div>
                            <div className="font-bold">{staffMember.name}</div>
                            <div className="font-medium">Designation:</div>
                            <div>{staffMember.designation}</div>
                            <div className="font-medium">Base Salary:</div>
                            <div>PKR {staffMember.salary.toLocaleString()}</div>
                            <div className="font-medium">Joining Date:</div>
                            <div>{new Date(staffMember.joiningDate).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment History</h3>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 text-left font-semibold">Date</th>
                                    <th className="p-2 text-left font-semibold">Details / Remarks</th>
                                    <th className="p-2 text-right font-semibold">Amount (PKR)</th>
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
                                        <td colSpan={3} className="text-center p-8 text-gray-500">No payment history found.</td>
                                    </tr>
                                 )}
                            </tbody>
                            <tfoot className="font-bold text-base">
                                <tr>
                                    <td colSpan={2} className="p-3 text-right">Total Paid to Date</td>
                                    <td className="p-3 text-right bg-gray-200">{totalPaid.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-16 pt-4 border-t">
                        <p>This is a computer-generated report.</p>
                        <p>&copy; {new Date().getFullYear()} White Villas Accounting Pro</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffReport;
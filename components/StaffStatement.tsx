import React from 'react';
import { StaffMember, Transaction, AdminProfile } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';

interface StaffStatementProps {
  staffMember: StaffMember;
  transactions: Transaction[];
  summary: { totalSalaryEarned: number, totalPaid: number, currentBalance: number };
  adminProfile: AdminProfile;
  onClose: () => void;
}

const StaffStatement: React.FC<StaffStatementProps> = ({ staffMember, transactions, summary, adminProfile, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold primary-text">Staff Statement: {staffMember.name}</h2>
                <div className="flex gap-4">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                        <PrinterIcon className="h-4 w-4" /> Print / Save PDF
                    </button>
                    <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold text-sm rounded-lg hover:bg-gray-500">
                        <CloseIcon className="h-4 w-4" /> Close
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto w-full max-w-4xl">
                <div id="printable-report" className="bg-white text-gray-900 p-12 font-sans">
                    <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
                        <div>
                            {adminProfile.logoUrl && <img src={adminProfile.logoUrl} alt="Company Logo" className="h-16 w-auto mb-4" />}
                            <h1 className="text-3xl font-bold">{adminProfile.companyName}</h1>
                            <p className="text-gray-600">{adminProfile.address}</p>
                            <p className="text-gray-600">{adminProfile.phone}</p>
                        </div>
                        <div className="text-right">
                             <h2 className="text-2xl font-bold text-gray-500 uppercase">Account Statement</h2>
                             <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-8 my-8">
                         <div>
                            <h3 className="text-sm text-gray-500 uppercase font-bold">Statement For</h3>
                            <p className="font-semibold text-lg">{staffMember.name}</p>
                            <p className="text-gray-700">{staffMember.position}</p>
                            <p className="text-gray-700">Joining Date: {new Date(staffMember.joiningDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-sm text-gray-500 uppercase font-bold mb-2">Account Summary</h3>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span className="text-gray-600">Total Dues (Salary + Commission):</span> <span className="font-semibold">PKR {summary.totalSalaryEarned.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-600">Total Payments Made:</span> <span className="font-semibold">PKR {summary.totalPaid.toLocaleString()}</span></div>
                                <div className="flex justify-between border-t mt-1 pt-1"><span className="font-bold">Current Balance:</span> <span className="font-bold text-lg">PKR {summary.currentBalance.toLocaleString()}</span></div>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment History</h3>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Details</th>
                                    <th className="p-2 text-left">Type</th>
                                    <th className="p-2 text-right">Amount Paid (PKR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t.id} className="border-b">
                                        <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-2">{t.details}</td>
                                        <td className="p-2">{t.category}</td>
                                        <td className="p-2 text-right">{t.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr><td colSpan={4} className="text-center p-8 text-gray-500">No payment records found.</td></tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold bg-gray-200">
                                    <td colSpan={3} className="p-2 text-right">Total Payments</td>
                                    <td className="p-2 text-right">{summary.totalPaid.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>

                    <footer className="relative text-center text-xs text-gray-500 mt-16 pt-4 border-t">
                        {adminProfile.stampUrl && (
                            <img src={adminProfile.stampUrl} alt="Stamp" className="absolute -top-16 right-0 w-28 h-28 object-contain opacity-70" />
                        )}
                        <p>This is a computer-generated statement.</p>
                        <p>&copy; {new Date().getFullYear()} {adminProfile.companyName}</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default StaffStatement;
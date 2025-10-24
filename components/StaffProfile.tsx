import React from 'react';
import { StaffMember, Transaction, TransactionType } from '../types';
import { PrinterIcon, PencilIcon, DocumentReportIcon } from './IconComponents';

interface StaffProfileProps {
  staffMember: StaffMember;
  transactions: Transaction[];
  onBack: () => void;
  onPrintInvoice: (transaction: Transaction) => void;
  onEditProfile: (staffMember: StaffMember) => void;
  onGenerateReport: (staffMember: StaffMember) => void;
}

const StaffProfile: React.FC<StaffProfileProps> = ({ staffMember, transactions, onBack, onPrintInvoice, onEditProfile, onGenerateReport }) => {
  const salaryPayments = transactions
    .filter(t => t.type === TransactionType.EXPENSE && t.staffId === staffMember.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300">
            &larr; Back to Staff List
        </button>
        <div className="flex gap-2">
            <button
                onClick={() => onEditProfile(staffMember)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white font-semibold text-xs rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
                <PencilIcon className="h-3 w-3" />
                Edit Profile
            </button>
            <button
                onClick={() => onGenerateReport(staffMember)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-500 transition-colors duration-200"
            >
                <DocumentReportIcon className="h-4 w-4" />
                Generate Report
            </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold text-yellow-400">
            {staffMember.name.charAt(0)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center md:text-left">
            <div className="text-gray-400 font-medium">Name</div>
            <div className="text-white font-semibold">{staffMember.name}</div>
            <div className="text-gray-400 font-medium">Designation</div>
            <div className="text-white">{staffMember.designation}</div>
            <div className="text-gray-400 font-medium">Salary</div>
            <div className="text-white">PKR {staffMember.salary.toLocaleString()}</div>
            <div className="text-gray-400 font-medium">Joining Date</div>
            <div className="text-white">{new Date(staffMember.joiningDate).toLocaleDateString()}</div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Salary Payment History</h3>
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Payment Date</th>
                        <th scope="col" className="px-6 py-3">Details</th>
                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        <th scope="col" className="px-6 py-3 text-center">Invoice</th>
                    </tr>
                </thead>
                <tbody>
                    {salaryPayments.length > 0 ? (
                        salaryPayments.map((t) => (
                            <tr key={t.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                <td className="px-6 py-4 text-right text-green-400">{t.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onPrintInvoice(t)}
                                        className="p-2 text-gray-300 hover:text-yellow-400"
                                        title="Print Invoice"
                                    >
                                        <PrinterIcon />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-400">No salary payments found for this staff member.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

    </div>
  );
};

export default StaffProfile;
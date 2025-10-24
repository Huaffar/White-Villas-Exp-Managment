import React, { useEffect } from 'react';
import { StaffMember, Transaction } from '../types';

interface InvoiceProps {
  staffMember: StaffMember;
  transaction: Transaction;
  companyProfile: {name: string, logoUrl?: string};
}

const Invoice: React.FC<InvoiceProps> = ({ staffMember, transaction, companyProfile }) => {
  useEffect(() => {
    // This component is designed to be printed.
    // We could trigger print automatically, but viewer modal gives user control.
  }, []);

  return (
    <div id="printable-report" className="bg-white text-gray-900 p-12 font-sans">
        <div className="flex justify-between items-center border-b-2 pb-4 border-gray-200">
            <div>
                <h1 className="text-3xl font-bold">{companyProfile.name}</h1>
                <p className="text-gray-600">Salary Slip</p>
            </div>
            {companyProfile.logoUrl && <img src={companyProfile.logoUrl} alt="Company Logo" className="h-16 w-auto" />}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
                <h3 className="text-sm text-gray-500 uppercase font-bold">Employee Details</h3>
                <p className="font-semibold text-lg">{staffMember.name}</p>
                <p className="text-gray-700">{staffMember.position}</p>
                <p className="text-gray-700">Joining Date: {new Date(staffMember.joiningDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
                <h3 className="text-sm text-gray-500 uppercase font-bold">Payment Details</h3>
                <p className="font-semibold text-lg">Invoice ID: WVA-{transaction.id}</p>
                <p className="text-gray-700">Payment Date: {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
        </div>

        <div className="mt-10">
            <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left font-bold text-gray-700">Description</th>
                        <th className="p-3 text-right font-bold text-gray-700">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="p-3">{transaction.details}</td>
                        <td className="p-3 text-right">PKR {transaction.amount.toLocaleString()}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td className="p-3 text-right font-bold text-xl">Net Payable</td>
                        <td className="p-3 text-right font-bold text-xl bg-gray-100">PKR {transaction.amount.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
            <p>This is a computer-generated salary slip and does not require a signature.</p>
            <p>&copy; {new Date().getFullYear()} {companyProfile.name}</p>
        </div>
    </div>
  );
};

export default Invoice;
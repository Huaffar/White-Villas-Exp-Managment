import React, { useEffect } from 'react';
import { Transaction, StaffMember } from '../types';
import { Logo } from './IconComponents';

interface InvoiceProps {
  transaction: Transaction;
  staffMember: StaffMember;
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ transaction, staffMember, onClose }) => {
    
    useEffect(() => {
        window.print();
        onClose();
    }, [onClose]);

    return (
        <div id="printable-invoice" className="bg-white text-gray-900 p-12 font-sans">
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">SALARY SLIP</h1>
                    <p className="text-gray-600">For the month of {new Date(transaction.date).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800">White Villas Lahore</h2>
                    <p className="text-sm text-gray-500">123 Bahria Orchard, Lahore, Pakistan</p>
                    <p className="text-sm text-gray-500">info@whitevillas.com</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Employee Details</h3>
                    <p className="font-bold text-lg">{staffMember.name}</p>
                    <p>{staffMember.designation}</p>
                    <p>Joining Date: {new Date(staffMember.joiningDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Details</h3>
                    <p><strong>Payment Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
                    <p><strong>Transaction ID:</strong> WV-{transaction.id}</p>
                </div>
            </div>

            <div className="mt-12">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left font-semibold">Description</th>
                            <th className="p-3 text-right font-semibold">Amount (PKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-3">{transaction.details}</td>
                            <td className="p-3 text-right">{transaction.amount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                    <tfoot className="font-bold">
                        <tr>
                            <td className="p-3 text-right">Net Salary Paid</td>
                            <td className="p-3 text-right text-xl bg-gray-200">{transaction.amount.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="mt-16 flex justify-between items-end">
                <div className="text-center">
                    <p className="border-t-2 border-gray-400 border-dotted px-8 pt-2 mt-16">Employee Signature</p>
                </div>
                <div className="text-center">
                     <p className="text-green-600 font-bold text-3xl transform -rotate-12 border-4 border-green-600 p-2">PAID</p>
                </div>
                <div className="text-center">
                    <p className="border-t-2 border-gray-400 border-dotted px-8 pt-2 mt-16">Authorized Signature</p>
                </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-16">
                <p>This is a computer-generated salary slip and does not require a physical signature for validation.</p>
                <p>&copy; {new Date().getFullYear()} White Villas Accounting Pro</p>
            </div>
        </div>
    );
};

export default Invoice;

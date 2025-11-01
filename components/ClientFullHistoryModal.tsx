

import React from 'react';
// FIX: Imported the 'Project' type for stronger type annotations.
import { Transaction, AdminProfile, ClientData, Project } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';

interface ClientFullHistoryModalProps {
  clientData: ClientData;
  adminProfile: AdminProfile;
  onClose: () => void;
}

const ClientFullHistoryModal: React.FC<ClientFullHistoryModalProps> = ({ clientData, adminProfile, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    const allTransactions = [
        // FIX: Explicitly cast the result of `Object.values` to resolve 'unknown' type inference for the 'p' parameter in `flatMap` due to the object's numeric index signature.
        ...(Object.values(clientData.projects) as { transactions: Transaction[] }[]).flatMap(p => p.transactions),
        ...clientData.maintenance.transactions
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const getProjectName = (transaction: Transaction): string => {
        if (transaction.projectId) {
            // FIX: Explicitly cast the result of `Object.values` to resolve 'unknown' type inference for the 'p' parameter in `find` due to the object's numeric index signature, which caused an error when accessing `p.project`.
            const projectData = (Object.values(clientData.projects) as { project: Project }[]).find(p => p.project.id === transaction.projectId);
            return projectData?.project.name || 'Unknown Project';
        }
        return 'Maintenance';
    };


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold primary-text">Full Payment History: {clientData.contact.name}</h2>
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
                        </div>
                        <div className="text-right">
                             <h2 className="text-2xl font-bold text-gray-500 uppercase">Full Payment History</h2>
                             <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    <section className="my-8">
                         <h3 className="text-sm text-gray-500 uppercase font-bold">Statement For</h3>
                         <p className="font-semibold text-lg">{clientData.contact.name}</p>
                         <p className="text-gray-700">{clientData.contact.company}</p>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">All Transactions</h3>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Project / Category</th>
                                    <th className="p-2 text-left">Details</th>
                                    <th className="p-2 text-right">Amount Paid (PKR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTransactions.map(t => (
                                    <tr key={t.id} className="border-b">
                                        <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-2">{getProjectName(t)}</td>
                                        <td className="p-2">{t.details}</td>
                                        <td className="p-2 text-right">{t.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                             <tfoot>
                                <tr className="font-bold bg-gray-200">
                                    <td colSpan={3} className="p-2 text-right">Total Payments</td>
                                    <td className="p-2 text-right">{clientData.totalPaid.toLocaleString()}</td>
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

export default ClientFullHistoryModal;
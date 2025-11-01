import React from 'react';
import { Transaction, Project, Contact, AdminProfile, ClientData } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';

interface ClientStatementProps {
  clientData: ClientData;
  adminProfile: AdminProfile;
  onClose: () => void;
}

const ClientStatement: React.FC<ClientStatementProps> = ({ clientData, adminProfile, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold primary-text">Client Statement: {clientData.contact.name}</h2>
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
                             <h2 className="text-2xl font-bold text-gray-500 uppercase">Client Statement</h2>
                             <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    <section className="grid grid-cols-2 gap-8 my-8">
                         <div>
                            <h3 className="text-sm text-gray-500 uppercase font-bold">Statement For</h3>
                            <p className="font-semibold text-lg">{clientData.contact.name}</p>
                            <p className="text-gray-700">{clientData.contact.company}</p>
                            <p className="text-gray-700">{clientData.contact.phone}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-bold text-center">Total Amount Paid</p>
                                <p className="text-4xl font-bold text-center mt-1">PKR {clientData.totalPaid.toLocaleString()}</p>
                            </div>
                        </div>
                    </section>
                    
                    {Object.values(clientData.projects).map(({ project, totalPaid, transactions }) => (
                         <section key={project.id} className="mb-8 break-inside-avoid">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 pb-1 border-b">{project.name}</h3>
                             <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                                <div><span className="font-semibold">Project Budget:</span> PKR {project.budget.toLocaleString()}</div>
                                <div><span className="font-semibold">Paid for Project:</span> PKR {totalPaid.toLocaleString()}</div>
                                <div><span className="font-semibold">Remaining:</span> PKR {(project.budget - totalPaid).toLocaleString()}</div>
                            </div>
                            <table className="w-full text-xs">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Details</th>
                                        <th className="p-2 text-right">Amount Paid (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => (
                                        <tr key={t.id} className="border-b">
                                            <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="p-2">{t.details}</td>
                                            <td className="p-2 text-right">{t.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    ))}

                    {clientData.maintenance.totalPaid > 0 && (
                        <section className="mb-8 break-inside-avoid">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 pb-1 border-b">Maintenance Payments</h3>
                             <table className="w-full text-xs">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="p-2 text-left">Date</th>
                                        <th className="p-2 text-left">Details</th>
                                        <th className="p-2 text-right">Amount Paid (PKR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientData.maintenance.transactions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(t => (
                                        <tr key={t.id} className="border-b">
                                            <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="p-2">{t.details}</td>
                                            <td className="p-2 text-right">{t.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}


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

export default ClientStatement;
import React, { useState, useMemo } from 'react';
import { Transaction, Project, Contact, ClientData, AdminProfile, TransactionType } from '../types';
import { SystemCategoryNames } from '../App';
import { ChevronDownIcon, PrinterIcon, WhatsAppIcon } from './IconComponents';
import ClientStatement from './ClientStatement';

interface ClientLedgerProps {
    transactions: Transaction[];
    projects: Project[];
    contacts: Contact[];
    systemCategoryNames: SystemCategoryNames;
    adminProfile: AdminProfile;
}

const ClientLedger: React.FC<ClientLedgerProps> = ({ transactions, projects, contacts, systemCategoryNames, adminProfile }) => {
    const [openClientId, setOpenClientId] = useState<number | null>(null);
    const [clientToPrint, setClientToPrint] = useState<ClientData | null>(null);

    const clientData = useMemo(() => {
        const clientIncome = transactions.filter(t => t.type === TransactionType.INCOME && (t.category === systemCategoryNames.projectPayment || t.category === 'Maintenance Bill'));
        
        const data: Record<number, ClientData> = {};

        clientIncome.forEach(t => {
            if (t.contactId) {
                const client = contacts.find(c => c.id === t.contactId);
                if (!client) return;

                if (!data[client.id]) {
                    data[client.id] = {
                        contact: client,
                        totalPaid: 0,
                        projects: {},
                        maintenance: { totalPaid: 0, transactions: [] }
                    };
                }

                data[client.id].totalPaid += t.amount;

                if (t.projectId && t.category === systemCategoryNames.projectPayment) {
                    const project = projects.find(p => p.id === t.projectId);
                    if (project) {
                        if (!data[client.id].projects[project.id]) {
                            data[client.id].projects[project.id] = { project, totalPaid: 0, transactions: [] };
                        }
                        data[client.id].projects[project.id].totalPaid += t.amount;
                        data[client.id].projects[project.id].transactions.push(t);
                    }
                } else if (t.category === 'Maintenance Bill') {
                    data[client.id].maintenance.totalPaid += t.amount;
                    data[client.id].maintenance.transactions.push(t);
                }
            }
        });
        
        return Object.values(data).sort((a,b) => b.totalPaid - a.totalPaid);

    }, [transactions, projects, contacts, systemCategoryNames]);

    const handleShareWhatsApp = (client: ClientData) => {
        if (!client.contact.phone) {
            alert('This client does not have a WhatsApp number saved.');
            return;
        }
        const message = `Dear ${client.contact.name},\n\nThis is a summary of your account with ${adminProfile.companyName}.\n\nTotal Amount Paid: PKR ${client.totalPaid.toLocaleString()}.\n\nThank you.`;
        const whatsappUrl = `https://wa.me/${client.contact.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    return (
        <>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold primary-text">Client Ledger</h1>
                <p className="text-gray-400 -mt-6">Track client payments for projects and maintenance.</p>
                
                <div className="space-y-4">
                    {clientData.map(client => {
                        const isExpanded = openClientId === client.contact.id;
                        return (
                            <div key={client.contact.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
                                <button onClick={() => setOpenClientId(isExpanded ? null : client.contact.id)} className="w-full flex justify-between items-center p-4 bg-gray-700/50 hover:bg-gray-700 text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full primary-bg flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0">
                                            {client.contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{client.contact.name}</h2>
                                            <p className="text-sm text-gray-400">{client.contact.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 text-right">Total Paid</p>
                                            <p className="text-xl font-bold text-green-400">PKR {client.totalPaid.toLocaleString()}</p>
                                        </div>
                                        <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                {isExpanded && (
                                    <div className="p-4 space-y-4 bg-gray-800">
                                        {Object.values(client.projects).map(({ project, totalPaid: projectTotalPaid, transactions: projectTransactions }) => {
                                            const progress = project.budget > 0 ? (projectTotalPaid / project.budget) * 100 : 0;
                                            return (
                                            <div key={project.id} className="bg-gray-900/50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-lg text-yellow-400">{project.name}</h3>
                                                <div className="my-2">
                                                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                                                        <span>Paid: PKR {projectTotalPaid.toLocaleString()}</span>
                                                        <span>Budget: PKR {project.budget.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                                    </div>
                                                    <p className="text-xs text-right mt-1 text-gray-400">{progress.toFixed(1)}% Completed</p>
                                                </div>
                                                <table className="w-full text-xs mt-3 text-gray-400">
                                                    <tbody>{projectTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => <tr key={t.id}><td className="py-1 pr-4">{new Date(t.date).toLocaleDateString()}</td><td className="py-1 pr-4">{t.details}</td><td className="py-1 text-right font-semibold text-gray-200">{t.amount.toLocaleString()}</td></tr>)}</tbody>
                                                </table>
                                            </div>
                                        )})}
                                        {client.maintenance.totalPaid > 0 && (
                                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-lg text-blue-300">Maintenance Payments</h3>
                                                <p className="text-sm text-gray-400">Total Paid: PKR {client.maintenance.totalPaid.toLocaleString()}</p>
                                                <table className="w-full text-xs mt-3 text-gray-400">
                                                    <tbody>{client.maintenance.transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => <tr key={t.id}><td className="py-1 pr-4">{new Date(t.date).toLocaleDateString()}</td><td className="py-1 pr-4">{t.details}</td><td className="py-1 text-right font-semibold text-gray-200">{t.amount.toLocaleString()}</td></tr>)}</tbody>
                                                </table>
                                            </div>
                                        )}
                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-700/50 mt-4">
                                            <button onClick={() => handleShareWhatsApp(client)} disabled={!client.contact.phone || !client.contact.phone.trim()} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                                                <WhatsAppIcon className="w-5 h-5" /> Share
                                            </button>
                                            <button onClick={() => setClientToPrint(client)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                                                <PrinterIcon className="w-5 h-5" /> Export Statement
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    {clientData.length === 0 && (
                        <div className="text-center py-16 bg-gray-800 rounded-lg">
                            <p className="text-gray-400">No client payments have been recorded.</p>
                        </div>
                    )}
                </div>
            </div>
            {clientToPrint && (
                <ClientStatement
                    clientData={clientToPrint}
                    adminProfile={adminProfile}
                    onClose={() => setClientToPrint(null)}
                />
            )}
        </>
    );
};

export default ClientLedger;
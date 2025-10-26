import React, { useState, useMemo } from 'react';
import { Transaction, Project, Contact, ClientData, AdminProfile, TransactionType } from '../types';
import { SystemCategoryNames } from '../App';
import { ChevronDownIcon, ShareIcon, ExportIcon, BookOpenIcon } from './IconComponents';
import ClientStatement from './ClientStatement';
import ClientFullHistoryModal from './ClientFullHistoryModal';

interface ClientLedgerProps {
    transactions: Transaction[];
    projects: Project[];
    contacts: Contact[];
    // FIX: Use `typeof SystemCategoryNames` to correctly type the prop based on the imported object value.
    systemCategoryNames: typeof SystemCategoryNames;
    adminProfile: AdminProfile;
}

type SortKey = 'name' | 'totalPaid';

const ClientLedger: React.FC<ClientLedgerProps> = ({ transactions, projects, contacts, systemCategoryNames, adminProfile }) => {
    const [openClientId, setOpenClientId] = useState<number | null>(null);
    const [clientToPrint, setClientToPrint] = useState<ClientData | null>(null);
    const [clientForFullHistory, setClientForFullHistory] = useState<ClientData | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('totalPaid');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    const sortedClientData = useMemo(() => {
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
        
        const dataArray = Object.values(data);
        
        return dataArray.sort((a, b) => {
            const valA = sortKey === 'name' ? a.contact.name : a.totalPaid;
            const valB = sortKey === 'name' ? b.contact.name : b.totalPaid;

            if (typeof valA === 'string' && typeof valB === 'string') {
                // FIX: Corrected sort logic to compare valB with valA instead of the entire 'a' object.
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                // FIX: Corrected sort logic to subtract valA from valB instead of the entire 'a' object.
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });

    }, [transactions, projects, contacts, systemCategoryNames, sortKey, sortDirection]);

    const handleShareWhatsApp = (client: ClientData) => {
        if (!client.contact.phone || !client.contact.phone.trim()) {
            alert('This client does not have a WhatsApp number saved.');
            return;
        }
        const message = `Dear ${client.contact.name},\n\nThis is a summary of your account with ${adminProfile.companyName}.\n\nTotal Amount Paid: PKR ${client.totalPaid.toLocaleString()}.\n\nThank you.`;
        const whatsappUrl = `https://wa.me/${client.contact.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    const sortedTransactions = (trans: Transaction[]) => trans.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const SortableHeader: React.FC<{ headerKey: SortKey, children: React.ReactNode, className?: string }> = ({ headerKey, children, className = '' }) => (
        <button onClick={() => handleSort(headerKey)} className={`flex items-center font-semibold text-sm text-gray-400 hover:text-white transition-colors ${className}`}>
            {children}
            {sortKey === headerKey && <span className="ml-1 text-yellow-400">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
        </button>
    );

    return (
        <>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold primary-text">Client Ledger</h1>
                <p className="text-gray-400 -mt-6">Track client payments for projects and maintenance.</p>
                
                <div className="bg-gray-800 rounded-lg shadow-md">
                    {/* Sorting Header */}
                    <div className="flex justify-between items-center px-6 py-3 bg-gray-900/50 border-b-2 border-gray-700">
                        <SortableHeader headerKey="name">Client Name</SortableHeader>
                        <div className="flex items-center justify-end flex-1">
                             <SortableHeader headerKey="totalPaid" className="justify-end">Total Paid</SortableHeader>
                             <div className="w-6 ml-4"></div> {/* Spacer for chevron */}
                        </div>
                    </div>
                    
                    <div className="space-y-2 p-2">
                        {sortedClientData.map(client => {
                            const isExpanded = openClientId === client.contact.id;
                            return (
                                <div key={client.contact.id} className="bg-gray-900/50 rounded-lg shadow-sm overflow-hidden transition-all duration-300">
                                    <button onClick={() => setOpenClientId(isExpanded ? null : client.contact.id)} className="w-full flex justify-between items-center p-4 hover:bg-gray-700/50 text-left">
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
                                                <p className="text-xl font-bold text-green-400 text-right">PKR {client.totalPaid.toLocaleString()}</p>
                                            </div>
                                            <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                    {isExpanded && (
                                        <div className="p-4 pt-2 space-y-4">
                                            {Object.values(client.projects).map(({ project, totalPaid: projectTotalPaid, transactions: projectTransactions }) => {
                                                const progress = project.budget > 0 ? (projectTotalPaid / project.budget) * 100 : 0;
                                                return (
                                                <div key={project.id} className="bg-gray-700/50 p-4 rounded-lg">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-xl text-white">{project.name}</h3>
                                                            <p className="text-sm text-gray-300">Paid: PKR {projectTotalPaid.toLocaleString()}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-sm text-gray-400">Budget: PKR {project.budget.toLocaleString()}</p>
                                                            <p className="text-xs text-gray-400">{progress.toFixed(1)}% Completed</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {sortedTransactions(projectTransactions).map(t => (
                                                            <div key={t.id} className="flex items-center text-sm text-gray-300">
                                                                <span className="w-1/4 text-gray-400">{new Date(t.date).toLocaleDateString('en-GB')}</span>
                                                                <span className="w-1/2 px-2">{t.details}</span>
                                                                <span className="w-1/4 text-right font-semibold">{t.amount.toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )})}
                                            {client.maintenance.totalPaid > 0 && (
                                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                                    <div className="mb-2">
                                                         <h3 className="font-bold text-xl text-white">Maintenance Payments</h3>
                                                         <p className="text-sm text-gray-400">Total Paid: PKR {client.maintenance.totalPaid.toLocaleString()}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {sortedTransactions(client.maintenance.transactions).map(t => (
                                                            <div key={t.id} className="flex items-center text-sm text-gray-300">
                                                                <span className="w-1/4 text-gray-400">{new Date(t.date).toLocaleDateString('en-GB')}</span>
                                                                <span className="w-1/2 px-2">{t.details}</span>
                                                                <span className="w-1/4 text-right font-semibold">{t.amount.toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-gray-700/50">
                                                <button onClick={() => handleShareWhatsApp(client)} disabled={!client.contact.phone || !client.contact.phone.trim()} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                                                    <ShareIcon className="w-5 h-5" /> Share
                                                </button>
                                                <button onClick={() => setClientToPrint(client)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                                                    <ExportIcon className="w-5 h-5" /> Export Statement
                                                </button>
                                                <button onClick={() => setClientForFullHistory(client)} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white font-semibold text-sm rounded-lg hover:bg-purple-500">
                                                    <BookOpenIcon className="w-5 h-5" /> View Full History
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {sortedClientData.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-gray-400">No client payments have been recorded.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {clientToPrint && (
                <ClientStatement
                    clientData={clientToPrint}
                    adminProfile={adminProfile}
                    onClose={() => setClientToPrint(null)}
                />
            )}
            {clientForFullHistory && (
                <ClientFullHistoryModal
                    clientData={clientForFullHistory}
                    adminProfile={adminProfile}
                    onClose={() => setClientForFullHistory(null)}
                />
            )}
        </>
    );
};

export default ClientLedger;
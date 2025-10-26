import React, { useMemo } from 'react';
import { Transaction, Project, Contact, ClientData, AdminProfile, TransactionType } from '../types';
import { SystemCategoryNames } from '../App';

interface ClientPortalProps {
    transactions: Transaction[];
    projects: Project[];
    clientContact: Contact;
    adminProfile: AdminProfile;
    // FIX: Use `typeof SystemCategoryNames` to correctly type the prop based on the imported object value.
    systemCategoryNames: typeof SystemCategoryNames;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ transactions, projects, clientContact, adminProfile, systemCategoryNames }) => {

    const clientData = useMemo(() => {
        const clientTransactions = transactions.filter(t => t.contactId === clientContact.id && t.type === TransactionType.INCOME);

        const data: ClientData = {
            contact: clientContact,
            totalPaid: 0,
            projects: {},
            maintenance: { totalPaid: 0, transactions: [] }
        };

        clientTransactions.forEach(t => {
            data.totalPaid += t.amount;

            if (t.projectId && t.category === systemCategoryNames.projectPayment) {
                const project = projects.find(p => p.id === t.projectId);
                if (project) {
                    if (!data.projects[project.id]) {
                        data.projects[project.id] = { project, totalPaid: 0, transactions: [] };
                    }
                    data.projects[project.id].totalPaid += t.amount;
                    data.projects[project.id].transactions.push(t);
                }
            } else if (t.category === 'Maintenance Bill') {
                data.maintenance.totalPaid += t.amount;
                data.maintenance.transactions.push(t);
            }
        });
        
        return data;

    }, [transactions, projects, clientContact, systemCategoryNames]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold primary-text">Welcome, {clientContact.name}</h1>
            <p className="text-gray-400 -mt-6">This is your personal portal to view project progress and financial statements.</p>
            
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <p className="text-sm text-gray-400 font-medium">Total Amount Paid to Date</p>
                <p className="text-4xl font-bold text-green-400 mt-2">PKR {clientData.totalPaid.toLocaleString()}</p>
            </div>

            {Object.values(clientData.projects).map(({ project, totalPaid, transactions: projectTransactions }) => {
                const progress = project.budget > 0 ? (totalPaid / project.budget) * 100 : 0;
                return (
                    <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                                <p className="text-sm text-gray-400">Status: <span className="font-semibold">{project.status}</span></p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-lg font-semibold text-white">PKR {totalPaid.toLocaleString()} / <span className="text-base text-gray-400">{project.budget.toLocaleString()}</span></p>
                                <p className="text-xs text-gray-400">Paid of Budget</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-right text-gray-400 mt-1">{progress.toFixed(1)}% Paid</p>
                    </div>
                );
            })}
            
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Payment History</h3>
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3">Project</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.filter(t => t.contactId === clientContact.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                                <tr key={t.id} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                    <td className="px-6 py-4">{projects.find(p => p.id === t.projectId)?.name || 'N/A'}</td>
                                    <td className={`px-6 py-4 text-right font-semibold text-green-400`}>
                                        {t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientPortal;
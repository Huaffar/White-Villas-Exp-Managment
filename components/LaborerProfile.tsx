import React from 'react';
// FIX: Corrected import path for types.
import { Laborer, Transaction, Project } from '../types';

interface LaborerProfileProps {
  laborer: Laborer;
  transactions: Transaction[];
  projects: Project[];
  onBack: () => void;
}

const LaborerProfile: React.FC<LaborerProfileProps> = ({ laborer, transactions, projects, onBack }) => {
    const payments = transactions
        .filter(t => t.laborerId === laborer.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
    const getProjectName = (projectId?: number) => projects.find(p => p.id === projectId)?.name || 'N/A';

    return (
        <div className="space-y-8">
            <div>
                <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300">
                    &larr; Back to Labor Management
                </button>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white">{laborer.name}</h2>
                <p className="text-gray-400">{laborer.trade}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <p><span className="text-gray-400">Daily Wage:</span> <span className="font-semibold">PKR {laborer.dailyWage.toLocaleString()}</span></p>
                    <p><span className="text-gray-400">Contact:</span> <span className="font-semibold">{laborer.contact}</span></p>
                    <p><span className="text-gray-400">Status:</span> <span className="font-semibold">{laborer.status}</span></p>
                </div>
            </div>

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
                            {payments.length > 0 ? payments.map(t => (
                                <tr key={t.id} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{t.details}</td>
                                    <td className="px-6 py-4">{getProjectName(t.projectId)}</td>
                                    <td className={`px-6 py-4 text-right font-semibold text-red-400`}>
                                        {t.amount.toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">No payments recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaborerProfile;
import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Laborer, Transaction, LaborerStatus, TransactionType, Project } from '../types';
import PayLaborerModal from './PayLaborerModal';
import LaborerFormModal from './LaborerFormModal';
import { PencilIcon, TrashIcon } from './IconComponents';
import { SystemCategoryNames } from '../App';

interface LaborManagementProps {
    laborers: Laborer[];
    projects: Project[];
    transactions: Transaction[];
    onSaveLaborer: (laborer: Laborer) => void;
    onDeleteLaborer: (laborer: Laborer) => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
    onViewProfile: (laborer: Laborer) => void;
    systemCategoryNames: SystemCategoryNames;
}

const LaborManagement: React.FC<LaborManagementProps> = ({ laborers, projects, transactions, onSaveLaborer, onDeleteLaborer, onAddTransaction, onViewProfile, systemCategoryNames }) => {
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [selectedLaborer, setSelectedLaborer] = useState<Laborer | null>(null);
    const [editingLaborer, setEditingLaborer] = useState<Laborer | undefined>(undefined);

    const handlePay = (laborer: Laborer, amount: number, remarks: string, paymentDate: string, projectId: number) => {
        onAddTransaction({
            date: paymentDate,
            details: `Labor Payment: ${remarks}`,
            category: systemCategoryNames.constructionLabor,
            type: TransactionType.EXPENSE,
            amount,
            laborerId: laborer.id,
            projectId,
        });
        setPayModalOpen(false);
    };

    const handleSave = (laborer: Laborer) => {
        onSaveLaborer(laborer);
        setFormModalOpen(false);
    };

    const openPayModal = (laborer: Laborer) => {
        setSelectedLaborer(laborer);
        setPayModalOpen(true);
    };

    const openFormModal = (laborer?: Laborer) => {
        setEditingLaborer(laborer);
        setFormModalOpen(true);
    };

    const getLastPaymentDate = (laborerId: number) => {
        const lastPayment = transactions
            .filter(t => t.laborerId === laborerId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'N/A';
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold primary-text">Labor Management</h1>
                <button onClick={() => openFormModal()} className="px-4 py-2 primary-bg text-gray-900 font-bold text-sm rounded-lg hover:opacity-90">
                    Add New Laborer
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Trade</th>
                                <th className="px-6 py-3 text-right">Daily Wage</th>
                                <th className="px-6 py-3">Last Payment</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {laborers.map(l => (
                                <tr key={l.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onViewProfile(l); }} className="hover:primary-text">
                                            {l.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">{l.trade}</td>
                                    <td className="px-6 py-4 text-right font-semibold">PKR {l.dailyWage.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-xs">{getLastPaymentDate(l.id)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${l.status === LaborerStatus.ACTIVE ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-4">
                                            <button onClick={() => openPayModal(l)} className="font-medium text-green-400 hover:text-green-300">Pay</button>
                                            <button onClick={() => openFormModal(l)} className="font-medium text-blue-400 hover:text-blue-300"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDeleteLaborer(l)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isPayModalOpen && selectedLaborer && (
                <PayLaborerModal
                    laborer={selectedLaborer}
                    projects={projects.filter(p => p.projectType === 'Construction')}
                    onPay={handlePay}
                    onClose={() => setPayModalOpen(false)}
                />
            )}
            {isFormModalOpen && (
                <LaborerFormModal
                    laborer={editingLaborer}
                    onSave={handleSave}
                    onClose={() => setFormModalOpen(false)}
                />
            )}
        </div>
    );
};

export default LaborManagement;
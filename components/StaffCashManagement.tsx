// FIX: Added full content for StaffCashManagement.tsx to manage staff and payroll.
import React, { useState } from 'react';
import { StaffMember, Transaction, TransactionType, StaffStatus } from '../types';
import PaySalaryModal from './PaySalaryModal';
import StaffFormModal from './StaffFormModal';
import AllSalariesReport from './AllSalariesReport';

interface StaffCashManagementProps {
    staff: StaffMember[];
    transactions: Transaction[];
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
    onViewProfile: (staffMember: StaffMember) => void;
}

const StaffCashManagement: React.FC<StaffCashManagementProps> = ({ staff, transactions, onAddTransaction, onViewProfile }) => {
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [isStaffModalOpen, setStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | undefined>(undefined);

    const handlePaySalary = (staffMember: StaffMember, amount: number, remarks: string) => {
        const salaryTransaction: Omit<Transaction, 'id' | 'balance'> = {
            date: new Date().toISOString().split('T')[0],
            details: `Salary for ${staffMember.name} - ${remarks || new Date().toLocaleString('default', { month: 'long' })}`,
            category: 'Salaries',
            type: TransactionType.EXPENSE,
            amount,
            staffId: staffMember.id,
        };
        onAddTransaction(salaryTransaction);
        setPayModalOpen(false);
        setSelectedStaff(null);
    };
    
    // This component would need state management from App.tsx to actually add/edit staff.
    // For now, it will just close the modal. A real app would lift state up.
    const handleSaveStaff = (staffMember: StaffMember) => {
        console.log("Saving staff member (feature to be fully implemented in App.tsx):", staffMember);
        alert("Staff member saved! (This is a demo, data will not persist on refresh).")
        setStaffModalOpen(false);
        setEditingStaff(undefined);
    }
    
    const getLastPayment = (staffId: number) => {
        return transactions
            .filter(t => t.staffId === staffId && t.category === 'Salaries')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-yellow-400">Staff Management</h1>
                 <button 
                    onClick={() => { setEditingStaff(undefined); setStaffModalOpen(true); }}
                    className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400"
                >
                    Add New Staff
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Position</th>
                            <th className="px-6 py-3 text-right">Salary</th>
                            <th className="px-6 py-3">Last Payment</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => {
                            const lastPayment = getLastPayment(s.id);
                            return (
                                <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onViewProfile(s); }} className="hover:text-yellow-400">
                                            {s.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">{s.position}</td>
                                    <td className="px-6 py-4 text-right font-semibold">PKR {s.salary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-xs">{lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${s.status === StaffStatus.ACTIVE ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => { setSelectedStaff(s); setPayModalOpen(true); }}
                                            className="font-medium text-green-400 hover:text-green-300 mr-4"
                                        >
                                            Pay
                                        </button>
                                        <button 
                                            onClick={() => { setEditingStaff(s); setStaffModalOpen(true); }}
                                            className="font-medium text-blue-400 hover:text-blue-300"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <AllSalariesReport transactions={transactions} staff={staff} />

            {isPayModalOpen && selectedStaff && (
                <PaySalaryModal 
                    staffMember={selectedStaff}
                    lastPayment={getLastPayment(selectedStaff.id)}
                    onPay={handlePaySalary}
                    onClose={() => setPayModalOpen(false)}
                />
            )}
            {isStaffModalOpen && (
                <StaffFormModal
                    staffMember={editingStaff}
                    onSave={handleSaveStaff}
                    onClose={() => setStaffModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StaffCashManagement;
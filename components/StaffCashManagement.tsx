// FIX: Added full content for StaffCashManagement.tsx to manage staff and payroll.
import React, { useState } from 'react';
import { StaffMember, Transaction, StaffStatus, TransactionType, AdminProfile } from '../types';
import PaySalaryModal from './PaySalaryModal';
import StaffFormModal from './StaffFormModal';
import InvoiceViewerModal from './InvoiceViewerModal';

interface StaffCashManagementProps {
    staff: StaffMember[];
    transactions: Transaction[];
    onSaveStaff: (staff: StaffMember) => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
    onViewProfile: (staffMember: StaffMember) => void;
    adminProfile: AdminProfile;
}

const StaffCashManagement: React.FC<StaffCashManagementProps> = ({ staff, transactions, onSaveStaff, onAddTransaction, onViewProfile, adminProfile }) => {
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [isStaffModalOpen, setStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | undefined>(undefined);
    const [invoiceToView, setInvoiceToView] = useState<{staff: StaffMember, transaction: Transaction} | null>(null);

    const handlePaySalaryAndShowInvoice = (staffMember: StaffMember, amount: number, remarks: string) => {
        const salaryTransactionData: Omit<Transaction, 'id' | 'balance'> = {
            date: new Date().toISOString().split('T')[0],
            details: `Salary: ${remarks || new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
            category: 'Salaries',
            type: TransactionType.EXPENSE,
            amount,
            staffId: staffMember.id,
        };
        onAddTransaction(salaryTransactionData);
        
        const transactionForInvoice: Transaction = {
            ...salaryTransactionData,
            id: Date.now(), // Use a temporary ID for the invoice.
            balance: 0 // Balance is not needed for the invoice.
        };

        setInvoiceToView({ staff: staffMember, transaction: transactionForInvoice });
        setPayModalOpen(false);
        setSelectedStaff(null);
    };
    
    const getLastPayment = (staffId: number) => {
        return transactions
            .filter(t => t.staffId === staffId && t.category === 'Salaries')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
    }
    
    const handleSaveAndClose = (staffMember: StaffMember) => {
        onSaveStaff(staffMember);
        setStaffModalOpen(false);
        setEditingStaff(undefined);
    }

    const ProfilePic: React.FC<{staff: StaffMember}> = ({staff}) => {
        if (staff.imageUrl) {
            return <img src={staff.imageUrl} alt={staff.name} className="w-10 h-10 rounded-full object-cover"/>
        }
        const initials = staff.name.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
             <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold">
                {initials}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold primary-text">Staff Management</h1>
                 <button 
                    onClick={() => { setEditingStaff(undefined); setStaffModalOpen(true); }}
                    className="px-4 py-2 primary-bg text-gray-900 font-bold text-sm rounded-lg hover:opacity-90"
                >
                    Add New Staff
                </button>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
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
                                            <div className="flex items-center gap-4">
                                                <ProfilePic staff={s} />
                                                <a href="#" onClick={(e) => { e.preventDefault(); onViewProfile(s); }} className="hover:primary-text">
                                                    {s.name}
                                                </a>
                                            </div>
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
            </div>

            {isPayModalOpen && selectedStaff && (
                <PaySalaryModal 
                    staffMember={selectedStaff}
                    lastPayment={getLastPayment(selectedStaff.id)}
                    onPay={handlePaySalaryAndShowInvoice}
                    onClose={() => setPayModalOpen(false)}
                />
            )}
            {isStaffModalOpen && (
                <StaffFormModal
                    staffMember={editingStaff}
                    onSave={handleSaveAndClose}
                    onClose={() => setStaffModalOpen(false)}
                />
            )}
            {invoiceToView && (
                <InvoiceViewerModal
                    staffMember={invoiceToView.staff}
                    transaction={invoiceToView.transaction}
                    adminProfile={adminProfile}
                    onClose={() => setInvoiceToView(null)}
                />
            )}
        </div>
    );
};

export default StaffCashManagement;

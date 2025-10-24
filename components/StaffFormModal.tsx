// FIX: Added full content for StaffFormModal.tsx to provide a form for adding/editing staff.
import React, { useState } from 'react';
import { StaffMember, StaffStatus } from '../types';

interface StaffFormModalProps {
    staffMember?: StaffMember;
    onSave: (staffMember: StaffMember) => void;
    onClose: () => void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ staffMember, onSave, onClose }) => {
    const [name, setName] = useState(staffMember?.name || '');
    const [position, setPosition] = useState(staffMember?.position || '');
    const [salary, setSalary] = useState(staffMember?.salary.toString() || '');
    const [joiningDate, setJoiningDate] = useState(staffMember?.joiningDate || new Date().toISOString().split('T')[0]);
    const [contact, setContact] = useState(staffMember?.contact || '');
    const [status, setStatus] = useState<StaffStatus>(staffMember?.status || StaffStatus.ACTIVE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newStaffMember: StaffMember = {
            id: staffMember?.id || 0, // 0 for new
            name,
            position,
            salary: parseFloat(salary),
            joiningDate,
            contact,
            status,
        };
        onSave(newStaffMember);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{staffMember ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                            <input type="text" id="position" value={position} onChange={e => setPosition(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary (PKR)</label>
                        <input type="number" id="salary" value={salary} onChange={e => setSalary(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-300 mb-1">Joining Date</label>
                            <input type="date" id="joiningDate" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">Contact No.</label>
                            <input type="tel" id="contact" value={contact} onChange={e => setContact(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as StaffStatus)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            {Object.values(StaffStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffFormModal;

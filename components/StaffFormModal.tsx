import React, { useState } from 'react';
import { StaffMember } from '../types';

interface StaffFormModalProps {
  staffMember?: StaffMember;
  onSave: (staffMember: StaffMember) => void;
  onClose: () => void;
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ staffMember, onSave, onClose }) => {
  const [name, setName] = useState(staffMember?.name || '');
  const [designation, setDesignation] = useState(staffMember?.designation || '');
  const [salary, setSalary] = useState(staffMember?.salary.toString() || '');
  const [joiningDate, setJoiningDate] = useState(staffMember?.joiningDate || new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaffMember: StaffMember = {
      id: staffMember?.id || 0, // 0 for new staff, will be replaced in App.tsx
      name,
      designation,
      salary: parseFloat(salary),
      joiningDate,
    };
    onSave(newStaffMember);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{staffMember ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">Designation</label>
            <input type="text" id="designation" value={designation} onChange={e => setDesignation(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary (PKR)</label>
            <input type="number" id="salary" value={salary} onChange={e => setSalary(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          <div>
            <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-300 mb-1">Joining Date</label>
            <input type="date" id="joiningDate" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">{staffMember ? 'Save Changes' : 'Add Staff'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormModal;

import React, { useState } from 'react';
import { StaffMember } from '../types';
import StatCard from './StatCard';
import { BalanceIcon, UserPlusIcon, UserCircleIcon } from './IconComponents';

interface StaffManagementProps {
  staff: StaffMember[];
  cashInHand: number;
  onPaySalary: (staffMember: StaffMember) => void;
  onAddStaff: () => void;
  onViewProfile: (staffMember: StaffMember) => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ staff, cashInHand, onPaySalary, onAddStaff, onViewProfile }) => {
  const [feedback, setFeedback] = useState('');

  const handlePaySalaryClick = (staffMember: StaffMember) => {
    onPaySalary(staffMember);
    // Feedback is now handled inside the modal/App logic after successful payment
  };

  return (
    <div className="space-y-8">
      <StatCard
        title="Current Cash in Hand"
        value={`PKR ${cashInHand.toLocaleString()}`}
        icon={<BalanceIcon />}
        colorClass="border-blue-500"
      />

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-400">Staff Management</h2>
            <button
              onClick={onAddStaff}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors duration-200"
            >
              <UserPlusIcon />
              Add New Staff
            </button>
        </div>
        
        {feedback && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 text-green-300 rounded-lg text-center">
            {feedback}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Staff Name</th>
                <th scope="col" className="px-6 py-3">Designation</th>
                <th scope="col" className="px-6 py-3 text-right">Salary Package</th>
                <th scope="col" className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                  <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                  <td className="px-6 py-4">{s.designation}</td>
                  <td className="px-6 py-4 text-right">{s.salary.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => handlePaySalaryClick(s)}
                            className="px-3 py-2 bg-green-600 text-white font-bold text-xs rounded-lg hover:bg-green-500 transition-colors duration-200"
                        >
                            Pay Salary
                        </button>
                        <button onClick={() => onViewProfile(s)} className="p-2 text-gray-300 hover:text-white flex items-center gap-1 text-xs" title="View Profile">
                            <UserCircleIcon className="h-4 w-4" /> Profile
                        </button>
                    </div>
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

export default StaffManagement;
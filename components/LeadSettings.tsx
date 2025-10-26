
import React, { useState } from 'react';
import { AdminProfile, LeadStatus } from '../types';
import { TrashIcon } from './IconComponents';

interface LeadSettingsProps {
    profile: AdminProfile;
    onSave: (profile: AdminProfile) => void;
}

const LeadSettings: React.FC<LeadSettingsProps> = ({ profile, onSave }) => {
    const [statuses, setStatuses] = useState<LeadStatus[]>(profile.leadStatuses || []);

    const handleStatusChange = (index: number, field: keyof LeadStatus, value: string) => {
        const newStatuses = [...statuses];
        // FIX: Ensure the value is assigned correctly based on the field type.
        (newStatuses[index] as any)[field] = value;
        setStatuses(newStatuses);
    };
    
    const addStatus = () => {
        setStatuses([...statuses, { id: `new-${Date.now()}`, name: 'New Status', color: '#808080' }]);
    };
    
    const deleteStatus = (id: string) => {
        setStatuses(statuses.filter(s => s.id !== id));
    };

    const handleSave = () => {
        onSave({ ...profile, leadStatuses: statuses });
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Lead Status Management</h2>
                <button onClick={handleSave} className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">
                    Save Changes
                </button>
            </div>
            <p className="text-sm text-gray-400">Define the stages of your sales pipeline.</p>
            
            <div className="space-y-4">
                {statuses.map((status, index) => (
                    <div key={status.id} className="flex items-center gap-4 bg-gray-700/50 p-3 rounded-lg">
                        <input
                            type="color"
                            value={status.color}
                            onChange={(e) => handleStatusChange(index, 'color', e.target.value)}
                            className="w-10 h-10 p-1 bg-gray-800 border-none rounded-md cursor-pointer"
                        />
                        <input
                            type="text"
                            value={status.name}
                            onChange={(e) => handleStatusChange(index, 'name', e.target.value)}
                            className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        />
                         <button onClick={() => deleteStatus(status.id)} className="p-2 text-red-500 hover:text-red-400">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            
            <button onClick={addStatus} className="px-4 py-2 bg-gray-600 text-white font-semibold text-sm rounded-lg hover:bg-gray-500">
                + Add New Status
            </button>
        </div>
    );
};

export default LeadSettings;

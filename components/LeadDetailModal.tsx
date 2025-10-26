import React, { useState } from 'react';
import { Lead, User, LeadStatus, LeadFollowUp } from '../types';
import { PencilIcon, TrashIcon, CloseIcon } from './IconComponents';

interface LeadDetailModalProps {
    lead: Lead;
    users: User[];
    statuses: LeadStatus[];
    onClose: () => void;
    onEdit: (lead: Lead) => void;
    onDelete: (lead: Lead) => void;
    onSave: (lead: Lead) => void; // For updating follow-ups
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, users, statuses, onClose, onEdit, onDelete, onSave }) => {
    const [newFollowUp, setNewFollowUp] = useState('');

    const getStatus = (id: string) => statuses.find(s => s.id === id);
    const getAssignee = (id?: number) => users.find(u => u.id === id);
    const getUser = (id: number) => users.find(u => u.id === id);

    const handleAddFollowUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFollowUp.trim()) return;

        const followUp: LeadFollowUp = {
            id: Date.now(),
            date: new Date().toISOString(),
            notes: newFollowUp,
            userId: 1, // This should be the logged-in user's ID
        };

        onSave({ ...lead, followUps: [...lead.followUps, followUp] });
        setNewFollowUp('');
    };

    const leadStatus = getStatus(lead.statusId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-full">
                <header className="p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
                        <p className="text-sm text-gray-400">{lead.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(lead)} className="p-2 text-blue-400 hover:text-blue-300"><PencilIcon className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(lead)} className="p-2 text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white"><CloseIcon className="w-6 h-6" /></button>
                    </div>
                </header>
                
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                            <div><span className="font-semibold text-gray-400">Phone:</span> <span className="text-white">{lead.phone}</span></div>
                            <div><span className="font-semibold text-gray-400">Email:</span> <span className="text-white">{lead.email || 'N/A'}</span></div>
                            <div><span className="font-semibold text-gray-400">Source:</span> <span className="text-white">{lead.source}</span></div>
                        </div>
                        <div className="space-y-3">
                             <div>
                                <span className="font-semibold text-gray-400">Status:</span> 
                                {leadStatus && <span style={{ backgroundColor: leadStatus.color, color: '#fff' }} className="ml-2 px-2 py-1 text-xs font-bold rounded-full">{leadStatus.name}</span>}
                            </div>
                            <div><span className="font-semibold text-gray-400">Assigned To:</span> <span className="text-white">{getAssignee(lead.assignedToId)?.name || 'Unassigned'}</span></div>
                            <div><span className="font-semibold text-gray-400">Potential Value:</span> <span className="text-white">{lead.potentialValue ? `PKR ${lead.potentialValue.toLocaleString()}` : 'N/A'}</span></div>
                        </div>
                    </div>
                    {lead.notes && (
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-1 text-sm">Notes</h4>
                            <p className="bg-gray-900/50 p-3 rounded-lg text-gray-300 text-sm">{lead.notes}</p>
                        </div>
                    )}
                    
                    {/* Follow-ups Section */}
                    <div>
                        <h3 className="text-lg font-bold text-yellow-400 mb-3">Follow-up History</h3>
                        <div className="space-y-4">
                            {lead.followUps.length > 0 ? lead.followUps.map(f => (
                                <div key={f.id} className="text-sm">
                                    <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                                        <span>{getUser(f.userId)?.name || 'Unknown User'}</span>
                                        <span>{new Date(f.date).toLocaleString()}</span>
                                    </div>
                                    <p className="bg-gray-700 p-3 rounded-lg text-gray-200">{f.notes}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-4">No follow-ups recorded.</p>
                            )}
                        </div>
                         <form onSubmit={handleAddFollowUp} className="mt-6 flex gap-2">
                            <input
                                type="text"
                                value={newFollowUp}
                                onChange={e => setNewFollowUp(e.target.value)}
                                placeholder="Add a new follow-up note..."
                                className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                            <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailModal;
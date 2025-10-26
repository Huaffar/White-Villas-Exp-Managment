
import React, { useState } from 'react';
import { Lead, User, LeadStatus, LeadSource } from '../types';

interface LeadFormModalProps {
    lead?: Lead;
    onSave: (lead: Lead) => void;
    onClose: () => void;
    users: User[];
    statuses: LeadStatus[];
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ lead, onSave, onClose, users, statuses }) => {
    const [name, setName] = useState(lead?.name || '');
    const [company, setCompany] = useState(lead?.company || '');
    const [phone, setPhone] = useState(lead?.phone || '');
    const [email, setEmail] = useState(lead?.email || '');
    const [statusId, setStatusId] = useState(lead?.statusId || statuses[0]?.id || '');
    const [source, setSource] = useState<LeadSource>(lead?.source || 'Other');
    const [assignedToId, setAssignedToId] = useState<number | undefined>(lead?.assignedToId);
    const [potentialValue, setPotentialValue] = useState(lead?.potentialValue?.toString() || '');
    const [notes, setNotes] = useState(lead?.notes || '');

    const leadSources: LeadSource[] = ['Website', 'Referral', 'Facebook', 'Cold Call', 'Other'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: lead?.id || 0,
            name,
            company,
            phone,
            email,
            statusId,
            source,
            assignedToId,
            potentialValue: potentialValue ? parseFloat(potentialValue) : undefined,
            notes,
            createdAt: lead?.createdAt || new Date().toISOString(),
            followUps: lead?.followUps || [],
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700 max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                            <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select value={statusId} onChange={e => setStatusId(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Source</label>
                            <select value={source} onChange={e => setSource(e.target.value as LeadSource)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {leadSources.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To</label>
                            <select value={assignedToId || ''} onChange={e => setAssignedToId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="">Unassigned</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Potential Value (PKR)</label>
                            <input type="number" value={potentialValue} onChange={e => setPotentialValue(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
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

export default LeadFormModal;

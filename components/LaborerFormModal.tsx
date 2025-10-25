import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Laborer, LaborerStatus } from '../types';

interface LaborerFormModalProps {
    laborer?: Laborer;
    onSave: (laborer: Laborer) => void;
    onClose: () => void;
}

const LaborerFormModal: React.FC<LaborerFormModalProps> = ({ laborer, onSave, onClose }) => {
    const [name, setName] = useState(laborer?.name || '');
    const [trade, setTrade] = useState(laborer?.trade || '');
    const [dailyWage, setDailyWage] = useState(laborer?.dailyWage.toString() || '');
    const [contact, setContact] = useState(laborer?.contact || '');
    const [status, setStatus] = useState<LaborerStatus>(laborer?.status || LaborerStatus.ACTIVE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: laborer?.id || 0,
            name,
            trade,
            dailyWage: parseFloat(dailyWage),
            contact,
            status,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{laborer ? 'Edit Laborer' : 'Add New Laborer'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="trade" className="block text-sm font-medium text-gray-300 mb-1">Trade</label>
                            <input type="text" id="trade" value={trade} onChange={e => setTrade(e.target.value)} required placeholder="e.g., Mason, Electrician" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="dailyWage" className="block text-sm font-medium text-gray-300 mb-1">Daily Wage (PKR)</label>
                        <input type="number" id="dailyWage" value={dailyWage} onChange={e => setDailyWage(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">Contact No.</label>
                            <input type="tel" id="contact" value={contact} onChange={e => setContact(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                         <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select id="status" value={status} onChange={e => setStatus(e.target.value as LaborerStatus)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {Object.values(LaborerStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
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

export default LaborerFormModal;
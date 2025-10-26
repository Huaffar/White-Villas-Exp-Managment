import React, { useState, useRef } from 'react';
// FIX: Corrected import path for types.
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
    const [phone, setPhone] = useState(staffMember?.phone || '');
    const [status, setStatus] = useState<StaffStatus>(staffMember?.status || StaffStatus.ACTIVE);
    const [openingBalance, setOpeningBalance] = useState(staffMember?.openingBalance?.toString() || '0');
    const [imageUrl, setImageUrl] = useState(staffMember?.imageUrl || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newStaffMember: StaffMember = {
            id: staffMember?.id || 0, // 0 for new
            name,
            position,
            salary: parseFloat(salary),
            joiningDate,
            contact,
            phone,
            status,
            openingBalance: parseFloat(openingBalance) || 0,
            imageUrl,
        };
        onSave(newStaffMember);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700 max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{staffMember ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {imageUrl ? <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xs text-center">No Image</span>}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-300">Profile Picture</p>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500">Upload</button>
                                {imageUrl && <button type="button" onClick={() => setImageUrl('')} className="px-3 py-1 bg-red-800/50 text-red-300 text-sm rounded-md hover:bg-red-800">Remove</button>}
                            </div>
                        </div>
                    </div>

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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary (PKR)</label>
                            <input type="number" id="salary" value={salary} onChange={e => setSalary(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="openingBalance" className="block text-sm font-medium text-gray-300 mb-1">Opening Balance (PKR)</label>
                            <input type="number" id="openingBalance" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} placeholder="e.g., 15000 or -5000" required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">WhatsApp No. (Int'l)</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g., 923001234567" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select id="status" value={status} onChange={e => setStatus(e.target.value as StaffStatus)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {/* FIX: Explicitly type the mapped variable `s` to resolve 'unknown' type error. */}
                                {Object.values(StaffStatus).map((s: StaffStatus) => <option key={s} value={s}>{s}</option>)}
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

export default StaffFormModal;
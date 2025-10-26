import React, { useState } from 'react';
import { Vendor, VendorCategory } from '../types';

interface VendorFormModalProps {
    vendor?: Vendor;
    categories: VendorCategory[];
    onSave: (item: Vendor) => void;
    onClose: () => void;
}

const VendorFormModal: React.FC<VendorFormModalProps> = ({ vendor, categories, onSave, onClose }) => {
    const [name, setName] = useState(vendor?.name || '');
    const [categoryId, setCategoryId] = useState(vendor?.categoryId || categories[0]?.id);
    const [contactPerson, setContactPerson] = useState(vendor?.contactPerson || '');
    const [phone, setPhone] = useState(vendor?.phone || '');
    const [address, setAddress] = useState(vendor?.address || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: vendor?.id || 0, name, categoryId, contactPerson, phone, address });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Vendor Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select value={categoryId} onChange={e => setCategoryId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Contact Person</label>
                            <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
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

export default VendorFormModal;
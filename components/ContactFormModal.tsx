import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Contact } from '../types';

interface ContactFormModalProps {
    contact?: Contact;
    onSave: (contact: Contact) => void;
    onClose: () => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ contact, onSave, onClose }) => {
    const [name, setName] = useState(contact?.name || '');
    const [company, setCompany] = useState(contact?.company || '');
    const [phone, setPhone] = useState(contact?.phone || '');
    const [email, setEmail] = useState(contact?.email || '');
    const [type, setType] = useState<Contact['type']>(contact?.type || 'Client');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: contact?.id || 0, name, company, phone, email, type });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
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
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value as Contact['type'])} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            <option value="Client">Client</option>
                            <option value="Supplier">Supplier</option>
                            <option value="Other">Other</option>
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

export default ContactFormModal;
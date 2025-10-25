import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Contact } from '../types';
import { PencilIcon, TrashIcon } from './IconComponents';
import ContactFormModal from './ContactFormModal';

interface ContactsProps {
    contacts: Contact[];
    onSaveContact: (contact: Contact) => void;
    onAddContact: (contact: Omit<Contact, 'id'>) => void;
    onDeleteContact: (contact: Contact) => void;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, onSaveContact, onAddContact, onDeleteContact }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

    const handleSave = (contact: Contact) => {
        if(contact.id === 0) {
            onAddContact({name: contact.name, company: contact.company, phone: contact.phone, email: contact.email, type: contact.type});
        } else {
            onSaveContact(contact);
        }
        setFormOpen(false);
        setEditingContact(undefined);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold primary-text">Contacts</h1>
                <button onClick={() => {setEditingContact(undefined); setFormOpen(true)}} className="px-4 py-2 primary-bg text-gray-900 font-bold text-sm rounded-lg hover:opacity-90">
                    Add New Contact
                </button>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Company</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(c => (
                                <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                    <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                                    <td className="px-6 py-4">{c.company}</td>
                                    <td className="px-6 py-4">{c.phone}</td>
                                    <td className="px-6 py-4">{c.type}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button onClick={() => {setEditingContact(c); setFormOpen(true)}} className="text-blue-400 hover:text-blue-300"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDeleteContact(c)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isFormOpen && (
                <ContactFormModal 
                    contact={editingContact}
                    onSave={handleSave}
                    onClose={() => setFormOpen(false)}
                />
            )}
        </div>
    );
};
export default Contacts;

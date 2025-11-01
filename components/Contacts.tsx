import React from 'react';
import { Contact } from '../types';
import { PencilIcon, TrashIcon, PlusIcon } from './IconComponents';

interface ClientProfilesProps {
    contacts: Contact[];
    onViewClient: (client: Contact) => void;
    onEditClient: (client: Contact) => void;
    onAddClient: () => void;
    onDeleteClient: (client: Contact) => void;
}

const ClientCard: React.FC<{ client: Contact, onView: () => void, onEdit: () => void, onDelete: () => void }> = ({ client, onView, onEdit, onDelete }) => {
    const initials = client.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="bg-background-secondary rounded-lg shadow-lg flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-on-accent font-bold text-2xl flex-shrink-0 overflow-hidden">
                        {client.imageUrl ? <img src={client.imageUrl} alt={client.name} className="w-full h-full object-cover" /> : <span>{initials}</span>}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-strong">{client.name}</h3>
                        <p className="text-sm text-text-secondary">{client.company || 'Individual Client'}</p>
                    </div>
                </div>
                <div className="text-sm space-y-2">
                    <p><span className="font-semibold text-text-secondary">Phone:</span> {client.phone}</p>
                    <p><span className="font-semibold text-text-secondary">CNIC:</span> {client.cnic || 'N/A'}</p>
                </div>
            </div>
            <div className="bg-background-tertiary p-3 flex justify-between items-center">
                 <button onClick={onView} className="text-sm font-semibold text-accent hover:text-accent-hover">View Full Profile</button>
                 <div className="flex gap-2">
                    <button onClick={onEdit} className="p-2 text-text-secondary hover:text-text-strong"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={onDelete} className="p-2 text-text-secondary hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                 </div>
            </div>
        </div>
    );
};


const ClientProfiles: React.FC<ClientProfilesProps> = ({ contacts, onViewClient, onEditClient, onAddClient, onDeleteClient }) => {
    const clients = contacts.filter(c => c.type === 'Client');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-accent">Client Profiles</h1>
                <button onClick={onAddClient} className="flex items-center gap-2 px-4 py-2 bg-accent text-on-accent font-bold text-sm rounded-lg hover:bg-accent-hover transition-colors">
                    <PlusIcon className="w-5 h-5" /> Add New Client
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(c => (
                    <ClientCard 
                        key={c.id} 
                        client={c}
                        onView={() => onViewClient(c)}
                        onEdit={() => onEditClient(c)}
                        onDelete={() => onDeleteClient(c)}
                    />
                ))}
            </div>
             {clients.length === 0 && (
                <div className="text-center py-16 bg-background-secondary rounded-lg">
                    <p className="text-text-secondary">No clients found. Click 'Add New Client' to get started.</p>
                </div>
            )}
        </div>
    );
};
export default ClientProfiles;
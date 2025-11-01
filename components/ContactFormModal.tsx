import React, { useState, useRef } from 'react';
import { Contact } from '../types';

interface ClientFormModalProps {
    contact?: Contact;
    onSave: (contact: Contact) => void;
    onClose: () => void;
}

const ClientFormModal: React.FC<ClientFormModalProps> = ({ contact, onSave, onClose }) => {
    const [name, setName] = useState(contact?.name || '');
    const [company, setCompany] = useState(contact?.company || '');
    const [phone, setPhone] = useState(contact?.phone || '');
    const [email, setEmail] = useState(contact?.email || '');
    const [cnic, setCnic] = useState(contact?.cnic || '');
    const [imageUrl, setImageUrl] = useState(contact?.imageUrl || '');
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
        onSave({ id: contact?.id || 0, name, company, phone, email, type: 'Client', cnic, imageUrl });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-background-secondary p-8 rounded-lg shadow-2xl w-full max-w-lg border border-primary max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold text-accent mb-6">{contact ? 'Edit Client' : 'Add New Client'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="flex items-center gap-4 p-4 bg-background-tertiary rounded-lg">
                        <div className="w-24 h-24 bg-background-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {imageUrl ? <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-text-secondary text-xs text-center">No Image</span>}
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-text-strong">Profile Picture</p>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1 bg-background-tertiary-hover text-text-strong text-sm rounded-md hover:opacity-80">Upload</button>
                                {imageUrl && <button type="button" onClick={() => setImageUrl('')} className="px-3 py-1 bg-red-800/50 text-red-300 text-sm rounded-md hover:bg-red-800">Remove</button>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-input border border-secondary rounded-lg px-3 py-2 text-text-strong" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-text-secondary mb-1">Company</label>
                            <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-input border border-secondary rounded-lg px-3 py-2 text-text-strong" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-input border border-secondary rounded-lg px-3 py-2 text-text-strong" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-input border border-secondary rounded-lg px-3 py-2 text-text-strong" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">CNIC</label>
                        <input type="text" value={cnic} onChange={e => setCnic(e.target.value)} placeholder="e.g., 35202-1234567-1" className="w-full bg-input border border-secondary rounded-lg px-3 py-2 text-text-strong" />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-background-tertiary-hover text-text-strong font-semibold rounded-lg hover:opacity-80">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-accent text-on-accent font-bold rounded-lg hover:bg-accent-hover">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientFormModal;
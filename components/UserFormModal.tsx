import React, { useState } from 'react';
import { User, UserRole, Contact } from '../types';

interface UserFormModalProps {
    user?: User;
    onSave: (user: User) => void;
    onClose: () => void;
    contacts: Contact[];
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onSave, onClose, contacts }) => {
    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState(user?.password || '');
    const [role, setRole] = useState<UserRole>(user?.role || UserRole.STAFF_ACCOUNTANT);
    const [contactId, setContactId] = useState<number | undefined>(user?.contactId);

    const clientContacts = contacts.filter(c => c.type === 'Client');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (role === UserRole.CLIENT && !contactId) {
            alert('A client user must be linked to a client contact.');
            return;
        }
        
        onSave({
            id: user?.id || 0,
            name,
            username,
            password,
            role,
            contactId: role === UserRole.CLIENT ? contactId : undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{user ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {/* FIX: Explicitly typed the mapped variable `r` to resolve 'unknown' type error. */}
                                {Object.values(UserRole).map((r: UserRole) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    {role === UserRole.CLIENT && (
                         <div>
                            <label className="block text-sm font-medium text-yellow-400 mb-1">Link to Client Contact (Required)</label>
                            <select value={contactId || ''} onChange={e => setContactId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="" disabled>Select a client</option>
                                {clientContacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
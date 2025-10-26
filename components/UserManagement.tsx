import React, { useState } from 'react';
import { User, Contact } from '../types';
import UserFormModal from './UserFormModal';
import ConfirmationModal from './ConfirmationModal';
import { PencilIcon, TrashIcon } from './IconComponents';

interface UserManagementProps {
    users: User[];
    contacts: Contact[];
    onSaveUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, contacts, onSaveUser, onDeleteUser }) => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleSave = (user: User) => {
        onSaveUser(user);
        setFormOpen(false);
    };

    const openFormModal = (user?: User) => {
        setEditingUser(user);
        setFormOpen(true);
    };
    
    const handleDelete = () => {
        if(userToDelete) {
            onDeleteUser(userToDelete);
            setUserToDelete(null);
        }
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">User Accounts</h2>
                <button
                    onClick={() => openFormModal()}
                    className="px-4 py-2 primary-bg text-gray-900 font-bold text-sm rounded-lg hover:opacity-90"
                >
                    Add New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.username}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openFormModal(user)} className="text-blue-400 hover:text-blue-300" title="Edit User">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setUserToDelete(user)} className="text-red-500 hover:text-red-400" title="Delete User">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <UserFormModal
                    user={editingUser}
                    onSave={handleSave}
                    onClose={() => setFormOpen(false)}
                    contacts={contacts}
                />
            )}
            
            {userToDelete && (
                 <ConfirmationModal 
                    title="Delete User"
                    message={`Are you sure you want to delete the user "${userToDelete.name}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setUserToDelete(null)}
                />
            )}
        </div>
    );
};

export default UserManagement;

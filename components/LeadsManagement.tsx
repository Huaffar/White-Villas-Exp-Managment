import React from 'react';
import { Contact, Project } from '../types';

interface ClientProfileDetailProps {
  client: Contact;
  projects: Project[];
  onBack: () => void;
}

const ClientProfileDetail: React.FC<ClientProfileDetailProps> = ({ client, projects, onBack }) => {
    const clientProjects = projects.filter(p => p.contactId === client.id);
    const initials = client.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return (
        <div className="space-y-8">
             <div>
                <button onClick={onBack} className="text-sm text-accent hover:text-accent-hover font-semibold">
                    &larr; Back to Client List
                </button>
            </div>
            <div className="bg-background-secondary p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center text-on-accent font-bold text-5xl flex-shrink-0 overflow-hidden border-4 border-background-tertiary">
                    {client.imageUrl ? <img src={client.imageUrl} alt={client.name} className="w-full h-full object-cover" /> : <span>{initials}</span>}
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-4xl font-bold text-text-strong">{client.name}</h2>
                    <p className="text-lg text-text-secondary">{client.company}</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-primary pt-4">
                        <p><span className="text-text-secondary">Phone:</span> <span className="font-semibold text-text-primary">{client.phone}</span></p>
                        <p><span className="text-text-secondary">Email:</span> <span className="font-semibold text-text-primary">{client.email || 'N/A'}</span></p>
                        <p><span className="text-text-secondary">CNIC:</span> <span className="font-semibold text-text-primary">{client.cnic || 'N/A'}</span></p>
                        <p><span className="text-text-secondary">Type:</span> <span className="font-semibold text-text-primary">{client.type}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-background-secondary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-text-strong mb-4">Properties / Projects</h3>
                <div className="space-y-4">
                    {clientProjects.length > 0 ? clientProjects.map(p => (
                        <div key={p.id} className="bg-background-tertiary p-4 rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-bold text-text-strong">{p.name}</p>
                                <p className="text-xs text-text-secondary">Budget: PKR {p.budget.toLocaleString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${p.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                {p.status}
                            </span>
                        </div>
                    )) : (
                        <p className="text-center text-text-secondary py-8">No projects are linked to this client.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientProfileDetail;
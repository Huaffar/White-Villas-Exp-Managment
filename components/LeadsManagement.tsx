import React, { useState } from 'react';
import { Lead, LeadStatus, User } from '../types';
import LeadDetailModal from './LeadDetailModal';
import LeadFormModal from './LeadFormModal';
import { PlusIcon } from './IconComponents';

interface LeadsManagementProps {
    leads: Lead[];
    users: User[];
    statuses: LeadStatus[];
    onSaveLead: (lead: Lead) => void;
    onDeleteLead: (lead: Lead) => void;
}

const LeadCard: React.FC<{ lead: Lead, onClick: () => void }> = ({ lead, onClick }) => (
    <div
        onClick={onClick}
        className="bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-600 transition-colors"
    >
        <p className="font-bold text-white">{lead.name}</p>
        <p className="text-sm text-gray-400">{lead.company}</p>
        <div className="mt-2 flex justify-between items-center text-xs">
            <span className="text-gray-400">{lead.source}</span>
            {lead.potentialValue && (
                <span className="font-semibold text-yellow-400">
                    PKR {lead.potentialValue.toLocaleString()}
                </span>
            )}
        </div>
    </div>
);

const StatusColumn: React.FC<{
    status: LeadStatus,
    leads: Lead[],
    onCardClick: (lead: Lead) => void
}> = ({ status, leads, onCardClick }) => {
    return (
        <div className="w-80 bg-gray-800 rounded-lg p-3 flex flex-col flex-shrink-0">
            <div className="flex items-center mb-4">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></span>
                <h3 className="font-semibold text-white">{status.name}</h3>
                <span className="ml-2 text-sm text-gray-500">{leads.length}</span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-grow" style={{maxHeight: 'calc(100vh - 20rem)'}}>
                {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onClick={() => onCardClick(lead)} />
                ))}
            </div>
        </div>
    );
};

const LeadsManagement: React.FC<LeadsManagementProps> = ({ leads, users, statuses, onSaveLead, onDeleteLead }) => {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);

    const handleSave = (lead: Lead) => {
        onSaveLead(lead);
        setFormOpen(false);
        // If we were editing the selected lead, update it
        if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(lead);
        }
    };
    
    const handleDelete = (lead: Lead) => {
        onDeleteLead(lead);
        setSelectedLead(null);
    }
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-yellow-400">Leads Pipeline</h1>
                    <button
                        onClick={() => { setEditingLead(undefined); setFormOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add New Lead
                    </button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {statuses.map(status => (
                        <StatusColumn
                            key={status.id}
                            status={status}
                            leads={leads.filter(l => l.statusId === status.id)}
                            onCardClick={setSelectedLead}
                        />
                    ))}
                </div>
            </div>

            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    users={users}
                    statuses={statuses}
                    onClose={() => setSelectedLead(null)}
                    onEdit={() => { setEditingLead(selectedLead); setFormOpen(true); }}
                    onDelete={handleDelete}
                    onSave={onSaveLead}
                />
            )}
            
            {isFormOpen && (
                <LeadFormModal
                    lead={editingLead}
                    users={users}
                    statuses={statuses}
                    onSave={handleSave}
                    onClose={() => setFormOpen(false)}
                />
            )}
        </>
    );
};

export default LeadsManagement;
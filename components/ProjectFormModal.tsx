import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Project, ProjectStatus, Contact } from '../types';

interface ProjectFormModalProps {
  project?: Project;
  onSave: (project: Project) => void;
  onClose: () => void;
  contacts: Contact[];
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, onSave, onClose, contacts }) => {
  const [name, setName] = useState(project?.name || '');
  const [clientName, setClientName] = useState(project?.clientName || '');
  const [budget, setBudget] = useState(project?.budget.toString() || '');
  const [startDate, setStartDate] = useState(project?.startDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ProjectStatus>(project?.status || ProjectStatus.PLANNED);
  const [projectType, setProjectType] = useState<'Construction' | 'General'>(project?.projectType || 'General');
  const [constructionType, setConstructionType] = useState<'House' | 'Apartment' | 'Other' | undefined>(project?.constructionType);
  const [contactId, setContactId] = useState<number | undefined>(project?.contactId);

  const clientContacts = contacts.filter(c => c.type === 'Client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: project?.id || 0, // 0 for new project, will be replaced in App.tsx
      name,
      clientName,
      budget: parseFloat(budget),
      startDate,
      status,
      projectType,
      constructionType: projectType === 'Construction' ? (constructionType || 'Other') : undefined,
      contactId,
    };
    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700 max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{project ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-1">Client Name (Display)</label>
                <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
             <div>
                <label htmlFor="contactId" className="block text-sm font-medium text-gray-300 mb-1">Link to Client Contact</label>
                <select id="contactId" value={contactId || ''} onChange={e => setContactId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                    <option value="">None</option>
                    {/* FIX: Explicitly type the mapped variable `c` to resolve 'unknown' type error. */}
                    {clientContacts.map((c: Contact) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">Budget (PKR)</label>
            <input type="number" id="budget" value={budget} onChange={e => setBudget(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                    {Object.values(ProjectStatus).map((s: ProjectStatus) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
           </div>
           <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-1">Project Type</label>
            <select id="projectType" value={projectType} onChange={e => setProjectType(e.target.value as 'Construction' | 'General')} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                <option value="General">General</option>
                <option value="Construction">Construction</option>
            </select>
          </div>
          {projectType === 'Construction' && (
            <div>
              <label htmlFor="constructionType" className="block text-sm font-medium text-gray-300 mb-1">Construction Type</label>
              <select id="constructionType" value={constructionType || ''} onChange={e => setConstructionType(e.target.value as 'House' | 'Apartment' | 'Other')} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500">
                  <option value="" disabled>Select a type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Other">Other</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">{project ? 'Save Changes' : 'Add Project'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;

import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectFormModalProps {
  project?: Project;
  onSave: (project: Project) => void;
  onClose: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, onSave, onClose }) => {
  const [name, setName] = useState(project?.name || '');
  const [clientName, setClientName] = useState(project?.clientName || '');
  const [budget, setBudget] = useState(project?.budget.toString() || '');
  const [startDate, setStartDate] = useState(project?.startDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ProjectStatus>(project?.status || ProjectStatus.PLANNED);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: project?.id || 0, // 0 for new project, will be replaced in App.tsx
      name,
      clientName,
      budget: parseFloat(budget),
      startDate,
      status,
    };
    onSave(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{project ? 'Edit Project' : 'Add New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
          </div>
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
            <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-yellow-500 focus:border-yellow-500" />
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
                    {Object.values(ProjectStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
           </div>
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

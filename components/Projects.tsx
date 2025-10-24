
import React, { useState, useMemo } from 'react';
import { Project, Transaction, TransactionType } from '../types';
import ProjectFormModal from './ProjectFormModal';
import { UserPlusIcon, PencilIcon } from './IconComponents';

interface ProjectsProps {
    projects: Project[];
    transactions: Transaction[];
    onSaveProject: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, transactions, onSaveProject }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(undefined);

    const projectFinancials = useMemo(() => {
        const financials: { [key: number]: { income: number, expense: number, profit: number } } = {};
        projects.forEach(p => {
            const projectTransactions = transactions.filter(t => t.projectId === p.id);
            const income = projectTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
            const expense = projectTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
            financials[p.id] = { income, expense, profit: income - expense };
        });
        return financials;
    }, [projects, transactions]);

    const handleOpenModal = (project?: Project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProjectToEdit(undefined);
    };

    const handleSave = (project: Project) => {
        onSaveProject(project);
        handleCloseModal();
    };
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ongoing': return 'text-blue-400 bg-blue-900/50';
            case 'Completed': return 'text-green-400 bg-green-900/50';
            case 'Planned': return 'text-yellow-400 bg-yellow-900/50';
            default: return 'text-gray-400 bg-gray-700';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-400">Project Management</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                >
                    <UserPlusIcon />
                    Add New Project
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                {projects.map(p => {
                    const financials = projectFinancials[p.id] || { income: 0, expense: 0, profit: 0 };
                    return (
                        <div key={p.id} className="bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{p.name}</h3>
                                        <p className="text-sm text-gray-400">{p.clientName}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-xs text-gray-400">Income</p>
                                        <p className="font-semibold text-green-400">{financials.income.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Expense</p>
                                        <p className="font-semibold text-red-400">{financials.expense.toLocaleString()}</p>
                                    </div>
                                     <div>
                                        <p className="text-xs text-gray-400">Profit / Loss</p>
                                        <p className={`font-bold ${financials.profit >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>{financials.profit.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-sm">
                                <div className="text-gray-400">
                                    <span>Budget: </span>
                                    <span className="font-medium text-white">{p.budget.toLocaleString()}</span>
                                </div>
                                <button onClick={() => handleOpenModal(p)} className="flex items-center gap-1 text-gray-300 hover:text-white" title="Edit Project">
                                    <PencilIcon /> Edit
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {isModalOpen && (
                <ProjectFormModal
                    project={projectToEdit}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Projects;

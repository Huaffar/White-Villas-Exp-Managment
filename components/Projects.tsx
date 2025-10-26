import React from 'react';
// FIX: Added Projects component that was missing.
// FIX: Corrected import path for types.
import { Project, ProjectStatus, Transaction, TransactionType } from '../types';
import { PencilIcon, TrashIcon, PrinterIcon } from './IconComponents';

interface ProjectsProps {
    projects: Project[];
    transactions: Transaction[];
    onViewProject: (project: Project) => void;
    onEditProject: (project: Project) => void;
    onAddProject: () => void;
    onDeleteProject: (project: Project) => void;
    onGenerateReport: (project: Project) => void;
}

const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
        case ProjectStatus.ONGOING:
            return 'bg-blue-500';
        case ProjectStatus.COMPLETED:
            return 'bg-green-500';
        case ProjectStatus.PLANNED:
            return 'bg-yellow-500';
        default:
            return 'bg-gray-500';
    }
}

const ProjectCard: React.FC<{ project: Project; income: number; expense: number; onViewProject: (p: Project) => void; onEditProject: (p: Project) => void; onDeleteProject: (p: Project) => void; onGenerateReport: (p: Project) => void; }> = ({ project, income, expense, onViewProject, onEditProject, onDeleteProject, onGenerateReport }) => {
    const profit = income - expense;
    const profitMargin = income > 0 ? (profit / income) * 100 : 0;
    
    return (
        <div className="bg-background-secondary p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                        <h3 className="text-xl font-bold text-text-strong mt-2">{project.name}</h3>
                        <p className="text-sm text-text-secondary">{project.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => onEditProject(project)} className="p-2 text-text-secondary hover:text-text-strong" title="Edit Project">
                            <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => onGenerateReport(project)} className="p-2 text-text-secondary hover:text-text-strong" title="Generate Report">
                            <PrinterIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDeleteProject(project)} className="p-2 text-text-secondary hover:text-red-400" title="Delete Project">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-text-secondary">Budget:</span>
                        <span className="font-semibold text-text-strong">PKR {project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-secondary">Total Income:</span>
                        <span className="font-semibold text-green-400">PKR {income.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-text-secondary">Total Expense:</span>
                        <span className="font-semibold text-red-400">PKR {expense.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span className="text-text-primary">Profit:</span>
                        <span className={profit >= 0 ? 'text-blue-300' : 'text-red-500'}>PKR {profit.toLocaleString()} ({profitMargin.toFixed(1)}%)</span>
                    </div>
                </div>
            </div>
            
            <button
                onClick={() => onViewProject(project)}
                className="mt-6 w-full py-2 bg-accent text-on-accent font-bold rounded-lg hover:bg-accent-hover transition-colors duration-200"
            >
                View Details
            </button>
        </div>
    );
};


const Projects: React.FC<ProjectsProps> = ({ projects, transactions, onViewProject, onEditProject, onAddProject, onDeleteProject, onGenerateReport }) => {

    const projectData = projects.map(p => {
        const projectTransactions = transactions.filter(t => t.projectId === p.id);
        const income = projectTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
        const expense = projectTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
        return { ...p, income, expense };
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-accent">Projects</h1>
                <button
                    onClick={onAddProject}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-on-accent font-bold text-sm rounded-lg hover:bg-accent-hover transition-colors duration-200"
                >
                    Add New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectData.map(p => (
                    <ProjectCard
                        key={p.id}
                        project={p}
                        income={p.income}
                        expense={p.expense}
                        onViewProject={onViewProject}
                        onEditProject={onEditProject}
                        onDeleteProject={onDeleteProject}
                        onGenerateReport={onGenerateReport}
                    />
                ))}
            </div>
        </div>
    );
};

export default Projects;
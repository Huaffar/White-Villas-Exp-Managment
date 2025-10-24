import React from 'react';
import { Project, Transaction, ProjectStatus, TransactionType } from '../types';

interface ConstructionHubProps {
    projects: Project[];
    transactions: Transaction[];
}

const ConstructionProjectCard: React.FC<{project: Project, transactions: Transaction[]}> = ({ project, transactions }) => {
    const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{project.name}</h3>
                    <p className="text-sm text-gray-400">{project.clientName}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Expense</p>
                    <p className="text-2xl font-bold text-red-400">PKR {totalExpense.toLocaleString()}</p>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-300 mb-2 border-t border-gray-700 pt-4">Expense List</h4>
                <div className="overflow-auto max-h-60">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Details</th>
                                <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {transactions.length > 0 ? transactions.map(t => (
                                <tr key={t.id}>
                                    <td className="px-4 py-2 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">{t.details}</td>
                                    <td className="px-4 py-2 text-right font-semibold">{t.amount.toLocaleString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-400">No expenses recorded for this project yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


const ConstructionHub: React.FC<ConstructionHubProps> = ({ projects, transactions }) => {

    const activeConstructionProjects = projects.filter(
        p => p.projectType === 'Construction' && p.status === ProjectStatus.ONGOING
    );

    const houseProjects = activeConstructionProjects.filter(p => p.constructionType === 'House');
    const apartmentProjects = activeConstructionProjects.filter(p => p.constructionType === 'Apartment');
    const otherProjects = activeConstructionProjects.filter(p => p.constructionType === 'Other' || !p.constructionType);


    const ProjectSection: React.FC<{title: string, projects: Project[]}> = ({title, projects}) => (
        <section>
            <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-yellow-500 pb-2">{title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projects.length > 0 ? (
                    projects.map(project => {
                        const projectExpenses = transactions.filter(
                            t => t.projectId === project.id && t.type === TransactionType.EXPENSE
                        );
                        return <ConstructionProjectCard key={project.id} project={project} transactions={projectExpenses} />
                    })
                ) : (
                    <div className="lg:col-span-2 text-center py-16 bg-gray-800 rounded-lg">
                        <p className="text-gray-400">No active projects of this type found.</p>
                    </div>
                )}
            </div>
        </section>
    )

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold primary-text">Construction Hub</h1>
            <p className="text-gray-400 -mt-4">Overview of all active construction projects and their expenses.</p>
            
            <ProjectSection title="Houses Under Construction" projects={houseProjects} />
            <ProjectSection title="Apartments Under Construction" projects={apartmentProjects} />
            <ProjectSection title="Other Construction Projects" projects={otherProjects} />
            
        </div>
    );
};

export default ConstructionHub;
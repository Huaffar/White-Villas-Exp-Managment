import React from 'react';
// FIX: Added ProjectDetail component that was missing.
import { Project, Transaction, TransactionType } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface ProjectDetailProps {
    project: Project;
    transactions: Transaction[];
    onBack: () => void;
    onGenerateReport: (project: Project) => void;
}

const COLORS = ['#48BB78', '#F56565'];

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, transactions, onBack, onGenerateReport }) => {
    
    const projectTransactions = transactions.filter(t => t.projectId === project.id);
    const totalIncome = projectTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = projectTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
    const profit = totalIncome - totalExpense;

    const chartData = [
        { name: 'Income', value: totalIncome },
        { name: 'Expense', value: totalExpense },
    ];
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300">
                    &larr; Back to Projects
                </button>
                 <button 
                    onClick={() => onGenerateReport(project)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500 transition-colors duration-200"
                >
                    Generate Report
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                <p className="text-gray-400">{project.clientName}</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="text-xl font-bold text-white">PKR {project.budget.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400">Income</p>
                        <p className="text-xl font-bold text-green-400">PKR {totalIncome.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400">Expense</p>
                        <p className="text-xl font-bold text-red-400">PKR {totalExpense.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400">Profit</p>
                        <p className={`text-xl font-bold ${profit >= 0 ? 'text-blue-300' : 'text-red-500'}`}>PKR {profit.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Project Transactions</h3>
                    <div className="overflow-auto max-h-96">
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Details</th>
                                    <th className="px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectTransactions.length > 0 ? projectTransactions.map(t => (
                                    <tr key={t.id} className="border-b border-gray-700">
                                        <td className="px-4 py-3 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{t.details}</td>
                                        <td className={`px-4 py-3 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.type === TransactionType.INCOME ? '+' : '-'} {t.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-400">No transactions for this project.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h3 className="text-xl font-semibold text-white mb-4">Financial Summary</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;

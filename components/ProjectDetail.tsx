import React, { useMemo } from 'react';
import { Project, Transaction, TransactionType, Contact, AdminProfile } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { SystemCategoryNames } from '../App';
import { ShareIcon, PrinterIcon } from './IconComponents';

interface ProjectDetailProps {
    project: Project;
    transactions: Transaction[];
    onBack: () => void;
    onGenerateReport: (project: Project) => void;
    systemCategoryNames: typeof SystemCategoryNames;
    contacts: Contact[];
    adminProfile: AdminProfile;
}

const COLORS = ['#48BB78', '#F56565'];

const DetailCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="bg-gray-700/50 p-3 rounded-lg text-center">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
);


const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, transactions, onBack, onGenerateReport, systemCategoryNames, contacts, adminProfile }) => {
    
    const projectTransactions = useMemo(() => {
        return transactions
            .filter(t => t.projectId === project.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [project.id, transactions]);

    const incomeTransactions = useMemo(() => projectTransactions.filter(t => t.type === TransactionType.INCOME), [projectTransactions]);
    const expenseTransactions = useMemo(() => projectTransactions.filter(t => t.type === TransactionType.EXPENSE), [projectTransactions]);

    const { totalIncome, totalExpense, totalMaterialCost, totalLaborCost, totalOtherExpense } = useMemo(() => {
        let income = 0;
        let expense = 0;
        let materialCost = 0;
        let laborCost = 0;
        let otherExpense = 0;

        for (const t of projectTransactions) {
            if (t.type === TransactionType.INCOME) {
                income += t.amount;
            } else if (t.type === TransactionType.EXPENSE) {
                expense += t.amount;
                if (t.category === systemCategoryNames.constructionMaterial) {
                    materialCost += t.amount;
                } else if (t.category === systemCategoryNames.constructionLabor) {
                    laborCost += t.amount;
                } else {
                    otherExpense += t.amount;
                }
            }
        }
        return { totalIncome: income, totalExpense: expense, totalMaterialCost: materialCost, totalLaborCost: laborCost, totalOtherExpense: otherExpense };
    }, [projectTransactions, systemCategoryNames]);

    const profit = totalIncome - totalExpense;

    const chartData = [
        { name: 'Income', value: totalIncome },
        { name: 'Expense', value: totalExpense },
    ];
    
    const handleShareWhatsApp = () => {
        const client = contacts.find(c => c.id === project.contactId);
        if (!client || !client.phone) {
            alert('Client contact or phone number not found for this project.');
            return;
        }

        const message = `
Project Summary: *${project.name}*
Client: ${project.clientName}

*Financials:*
- Budget: PKR ${project.budget.toLocaleString()}
- Total Income: PKR ${totalIncome.toLocaleString()}
- Total Expense: PKR ${totalExpense.toLocaleString()}
- *Current Profit: PKR ${profit.toLocaleString()}*

Shared from ${adminProfile.companyName}
        `.trim().replace(/^\s+/gm, '');

        const whatsappUrl = `https://wa.me/${client.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const TransactionTable: React.FC<{title: string, data: Transaction[], isExpense?: boolean}> = ({ title, data, isExpense = false }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <div className="overflow-auto max-h-[40vh]">
                 <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Details</th>
                            {isExpense && <th className="px-4 py-2">Category</th>}
                            <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map(t => (
                            <tr key={t.id} className="border-b border-gray-700">
                                <td className="px-4 py-3 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{t.details}</td>
                                {isExpense && <td className="px-4 py-3 text-xs">{t.category}</td>}
                                <td className={`px-4 py-3 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>{t.amount.toLocaleString()}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={isExpense ? 4 : 3} className="text-center py-8 text-gray-400">No transactions recorded in this category.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300">
                    &larr; Back to Projects
                </button>
                 <div className="flex gap-2">
                    <button 
                        onClick={handleShareWhatsApp}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500 transition-colors duration-200"
                    >
                        <ShareIcon className="h-4 w-4" /> Share
                    </button>
                    <button 
                        onClick={() => onGenerateReport(project)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500 transition-colors duration-200"
                    >
                        <PrinterIcon className="h-4 w-4" /> Generate Report
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                        <p className="text-gray-400">{project.clientName}</p>
                    </div>
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
                        <DetailCard label="Budget" value={`PKR ${project.budget.toLocaleString()}`} color="text-white" />
                        <DetailCard label="Income" value={`PKR ${totalIncome.toLocaleString()}`} color="text-green-400" />
                        <DetailCard label="Expense" value={`PKR ${totalExpense.toLocaleString()}`} color="text-red-400" />
                        <DetailCard label="Profit" value={`PKR ${profit.toLocaleString()}`} color={profit >= 0 ? 'text-blue-300' : 'text-orange-400'} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <TransactionTable title="Income / Client Payments" data={incomeTransactions} />
                    <TransactionTable title="All Project Expenses" data={expenseTransactions} isExpense />
                </div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center self-start sticky top-8">
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
                                <Legend wrapperStyle={{color: '#fff'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2 text-sm w-full">
                        <div className="flex justify-between font-semibold text-gray-300 border-t border-gray-700 pt-2"><span >Total Expenses:</span> <span >PKR {totalExpense.toLocaleString()}</span></div>
                        <div className="flex justify-between pl-4"><span className="text-gray-400">Material Costs:</span> <span className="font-semibold text-white">PKR {totalMaterialCost.toLocaleString()}</span></div>
                        <div className="flex justify-between pl-4"><span className="text-gray-400">Labor Costs:</span> <span className="font-semibold text-white">PKR {totalLaborCost.toLocaleString()}</span></div>
                        <div className="flex justify-between pl-4"><span className="text-gray-400">Other Expenses:</span> <span className="font-semibold text-white">PKR {totalOtherExpense.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
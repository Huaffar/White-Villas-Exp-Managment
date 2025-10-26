import React, { useMemo, useState } from 'react';
import { Project, Transaction, TransactionType } from '../types';
import { DownloadIcon } from './IconComponents';

interface ProjectProfitabilityReportProps {
    projects: Project[];
    transactions: Transaction[];
}

type SortKey = 'name' | 'profit' | 'income' | 'expense' | 'margin';

const ProjectProfitabilityReport: React.FC<ProjectProfitabilityReportProps> = ({ projects, transactions }) => {
    const [sortKey, setSortKey] = useState<SortKey>('profit');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const projectData = useMemo(() => {
        return projects.map(p => {
            const projectTransactions = transactions.filter(t => t.projectId === p.id);
            const income = projectTransactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
            const expense = projectTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
            const profit = income - expense;
            const margin = income > 0 ? (profit / income) * 100 : 0;
            return { ...p, income, expense, profit, margin };
        });
    }, [projects, transactions]);

    const sortedData = useMemo(() => {
        return [...projectData].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (typeof valA === 'string' && typeof valB === 'string') {
                 return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            if (typeof valA === 'number' && typeof valB === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            return 0;
        });
    }, [projectData, sortKey, sortDirection]);
    
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };
    
    const exportToCSV = () => {
        const headers = ['Project Name', 'Client', 'Status', 'Budget', 'Total Income', 'Total Expense', 'Profit/Loss', 'Profit Margin (%)'];
        const dataForCSV = sortedData.map(p => [
            `"${p.name.replace(/"/g, '""')}"`,
            `"${p.clientName.replace(/"/g, '""')}"`,
            p.status,
            p.budget,
            p.income,
            p.expense,
            p.profit,
            p.margin.toFixed(2)
        ]);

        const csvContent = [headers.join(','), ...dataForCSV.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "project_profitability_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const SortableHeader: React.FC<{ headerKey: SortKey, children: React.ReactNode, isNumeric?: boolean }> = ({ headerKey, children, isNumeric = false }) => (
        <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort(headerKey)}>
            <div className={`flex items-center ${isNumeric ? 'justify-end' : 'justify-start'}`}>
                {children}
                {sortKey === headerKey && (<span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>)}
            </div>
        </th>
    );

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Project Profitability Report</h2>
                <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white font-semibold text-sm rounded-lg hover:bg-gray-600">
                    <DownloadIcon className="w-5 h-5" /> Export CSV
                </button>
            </div>
             <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                        <tr>
                            <SortableHeader headerKey="name">Project Name</SortableHeader>
                            <th scope="col" className="px-6 py-3">Client</th>
                            <SortableHeader headerKey="income" isNumeric>Income</SortableHeader>
                            <SortableHeader headerKey="expense" isNumeric>Expense</SortableHeader>
                            <SortableHeader headerKey="profit" isNumeric>Profit/Loss</SortableHeader>
                            <SortableHeader headerKey="margin" isNumeric>Margin %</SortableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map(p => (
                             <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                <td className="px-6 py-4">{p.clientName}</td>
                                <td className="px-6 py-4 text-right text-green-400">{p.income.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-red-400">{p.expense.toLocaleString()}</td>
                                <td className={`px-6 py-4 text-right font-bold ${p.profit >= 0 ? 'text-blue-300' : 'text-orange-400'}`}>{p.profit.toLocaleString()}</td>
                                <td className={`px-6 py-4 text-right ${p.margin >= 0 ? 'text-gray-300' : 'text-orange-400'}`}>{p.margin.toFixed(1)}%</td>
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectProfitabilityReport;

import React, { useMemo, useState } from 'react';
import { StockMovement, Material, Project, MaterialCategory } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChevronDownIcon } from './IconComponents';

interface StockUsageReportProps {
    stockMovements: StockMovement[];
    materials: Material[];
    projects: Project[];
    materialCategories: MaterialCategory[];
}

const PIE_COLORS = ['#34d399', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#f472b6'];

const StockUsageReport: React.FC<StockUsageReportProps> = ({ stockMovements, materials, projects, materialCategories }) => {
    const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');

    const filteredStockMovements = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let startDate: Date;
        switch (filter) {
            case 'daily':
                startDate = today;
                break;
            case 'weekly':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - today.getDay());
                break;
            case 'monthly':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'all':
            default:
                return stockMovements;
        }
        
        return stockMovements.filter(t => new Date(t.date) >= startDate);

    }, [stockMovements, filter]);

    const reportData = useMemo(() => {
        const priceMap = new Map<number, number>();
        [...stockMovements]
            .filter(m => m.type === 'in' && m.unitPrice != null)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .forEach(m => { priceMap.set(m.materialId, m.unitPrice!); });

        const projectUsage: { [projectId: number]: { totalCost: number, materials: { [materialId: number]: { name: string, unit: string, quantity: number } }, categoryCosts: { [categoryId: number]: number } } } = {};

        filteredStockMovements
            .filter(m => m.type === 'out' && m.projectId != null)
            .forEach(m => {
                const projectId = m.projectId!;
                if (!projectUsage[projectId]) {
                    projectUsage[projectId] = { totalCost: 0, materials: {}, categoryCosts: {} };
                }

                const price = priceMap.get(m.materialId) || 0;
                const cost = m.quantity * price;
                projectUsage[projectId].totalCost += cost;
                
                const materialInfo = materials.find(mat => mat.id === m.materialId);
                if (materialInfo) {
                    const { categoryId, name, unit } = materialInfo;
                    // Aggregate material quantity
                    if (!projectUsage[projectId].materials[m.materialId]) {
                        projectUsage[projectId].materials[m.materialId] = { name, unit, quantity: 0 };
                    }
                    projectUsage[projectId].materials[m.materialId].quantity += m.quantity;
                    // Aggregate category cost
                    projectUsage[projectId].categoryCosts[categoryId] = (projectUsage[projectId].categoryCosts[categoryId] || 0) + cost;
                }
            });

        return projects
            .map(p => {
                const usage = projectUsage[p.id];
                const categoryCostData = usage ? Object.entries(usage.categoryCosts).map(([catId, cost]) => {
                    const categoryName = materialCategories.find(mc => mc.id === parseInt(catId))?.name || 'Uncategorized';
                    return { name: categoryName, value: cost };
                }) : [];

                return {
                    projectId: p.id,
                    projectName: p.name,
                    totalCost: usage?.totalCost || 0,
                    usedMaterials: usage?.materials || {},
                    categoryCosts: categoryCostData,
                };
            })
            .filter(p => p.totalCost > 0)
            .sort((a, b) => b.totalCost - a.totalCost);
    }, [filteredStockMovements, materials, projects, stockMovements, materialCategories]);

    const totalFilteredCost = useMemo(() => reportData.reduce((sum, p) => sum + p.totalCost, 0), [reportData]);

    const handleToggle = (projectId: number) => {
        setExpandedProjectId(prev => (prev === projectId ? null : projectId));
    };

    const getFilterButtonClass = (filterName: typeof filter) => 
        `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === filterName ? 'bg-accent text-on-accent' : 'bg-background-tertiary text-text-primary hover:bg-background-tertiary-hover'}`;

    return (
        <div className="space-y-8">
            <div className="bg-background-secondary p-4 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-text-secondary">Show report for:</p>
                    <div className="flex bg-background-primary rounded-lg p-1">
                        <button onClick={() => setFilter('daily')} className={getFilterButtonClass('daily')}>Today</button>
                        <button onClick={() => setFilter('weekly')} className={getFilterButtonClass('weekly')}>This Week</button>
                        <button onClick={() => setFilter('monthly')} className={getFilterButtonClass('monthly')}>This Month</button>
                        <button onClick={() => setFilter('all')} className={getFilterButtonClass('all')}>All Time</button>
                    </div>
                </div>
                <div className="bg-background-tertiary p-4 rounded-lg border-l-4 border-accent text-right">
                    <p className="text-sm text-text-secondary font-medium">Total Material Cost</p>
                    <p className="text-2xl font-bold text-text-strong">PKR {totalFilteredCost.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-background-secondary p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-text-strong mb-4">Material Cost by Project</h2>
                {reportData.length > 0 ? (
                    <div style={{ width: '100%', height: Math.max(200, reportData.length * 50) }}>
                        <ResponsiveContainer>
                            <BarChart data={reportData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                                <XAxis type="number" stroke="var(--text-secondary)" />
                                <YAxis type="category" dataKey="projectName" stroke="var(--text-secondary)" width={150} tick={{ fill: 'var(--text-primary)', fontSize: 12 }} interval={0} />
                                <Tooltip
                                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                                    contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-secondary)', borderRadius: '0.5rem' }}
                                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, "Total Cost"]}
                                />
                                <Legend wrapperStyle={{ color: 'var(--text-primary)' }}/>
                                <Bar dataKey="totalCost" name="Total Material Cost" fill="rgb(var(--primary-color-rgb))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-text-secondary py-16">No stock has been issued in this period.</p>
                )}
            </div>
            
            <div className="bg-background-secondary rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-text-strong p-6">Detailed Usage</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-primary">
                        <thead className="text-xs text-text-secondary uppercase bg-background-tertiary-hover">
                            <tr>
                                <th className="px-6 py-3">Project Name</th>
                                <th className="px-6 py-3 text-right">Total Material Cost</th>
                                <th className="px-6 py-3 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map(p => (
                                <React.Fragment key={p.projectId}>
                                    <tr className="border-b border-primary hover:bg-background-tertiary-hover">
                                        <td className="px-6 py-4 font-medium text-text-strong">{p.projectName}</td>
                                        <td className="px-6 py-4 text-right font-bold text-lg text-accent">PKR {p.totalCost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleToggle(p.projectId)} className="p-2 rounded-full hover:bg-background-tertiary">
                                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedProjectId === p.projectId ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedProjectId === p.projectId && (
                                        <tr className="bg-background-primary">
                                            <td colSpan={3} className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-background-tertiary rounded-md">
                                                        <h4 className="font-semibold text-text-strong mb-2">Materials Used:</h4>
                                                        <ul className="list-disc list-inside space-y-1 text-sm max-h-48 overflow-y-auto">
                                                            {Object.values(p.usedMaterials).map((mat: { name: string; quantity: number; unit: string; }) => (
                                                                <li key={mat.name}>
                                                                    <span className="font-semibold text-text-primary">{mat.name}:</span> {mat.quantity.toLocaleString()} {mat.unit}(s)
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="p-4 bg-background-tertiary rounded-md">
                                                         <h4 className="font-semibold text-text-strong mb-2">Cost by Category</h4>
                                                         {p.categoryCosts.length > 0 ? (
                                                            <ResponsiveContainer width="100%" height={160}>
                                                                <PieChart>
                                                                    <Pie data={p.categoryCosts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                                                        {p.categoryCosts.map((entry, index) => (
                                                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                                        ))}
                                                                    </Pie>
                                                                    <Tooltip contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-secondary)' }} formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                         ) : <p className="text-text-secondary text-center pt-10">No category cost data.</p>}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                     {reportData.length === 0 && (
                        <div className="text-center py-16 text-text-secondary">
                            <p>No project usage data for this period.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockUsageReport;
import React, { useMemo, useState } from 'react';
import { StockMovement, Material, Project } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChevronDownIcon } from './IconComponents';

interface StockUsageReportProps {
    stockMovements: StockMovement[];
    materials: Material[];
    projects: Project[];
}

const StockUsageReport: React.FC<StockUsageReportProps> = ({ stockMovements, materials, projects }) => {
    const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

    const reportData = useMemo(() => {
        const priceMap = new Map<number, number>();
        [...stockMovements]
            .filter(m => m.type === 'in' && m.unitPrice != null)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .forEach(m => {
                priceMap.set(m.materialId, m.unitPrice!);
            });

        const projectUsage: { [projectId: number]: { totalCost: number, materials: { [materialId: number]: { name: string, unit: string, quantity: number } } } } = {};

        stockMovements
            .filter(m => m.type === 'out' && m.projectId != null)
            .forEach(m => {
                const projectId = m.projectId!;
                if (!projectUsage[projectId]) {
                    projectUsage[projectId] = { totalCost: 0, materials: {} };
                }

                const price = priceMap.get(m.materialId) || 0;
                projectUsage[projectId].totalCost += m.quantity * price;

                if (!projectUsage[projectId].materials[m.materialId]) {
                    const materialInfo = materials.find(mat => mat.id === m.materialId);
                    projectUsage[projectId].materials[m.materialId] = {
                        name: materialInfo?.name || 'Unknown',
                        unit: materialInfo?.unit || '',
                        quantity: 0
                    };
                }
                projectUsage[projectId].materials[m.materialId].quantity += m.quantity;
            });

        return projects
            .map(p => ({
                projectId: p.id,
                projectName: p.name,
                totalCost: projectUsage[p.id]?.totalCost || 0,
                usedMaterials: projectUsage[p.id]?.materials || {}
            }))
            .filter(p => p.totalCost > 0)
            .sort((a, b) => b.totalCost - a.totalCost);
    }, [stockMovements, materials, projects]);

    const handleToggle = (projectId: number) => {
        setExpandedProjectId(prev => (prev === projectId ? null : projectId));
    };
    
    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Material Cost by Project</h2>
                {reportData.length > 0 ? (
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer>
                            <BarChart data={reportData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis type="number" stroke="#A0AEC0" />
                                <YAxis type="category" dataKey="projectName" stroke="#A0AEC0" width={150} tick={{ fill: '#A0AEC0' }} interval={0} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, "Total Cost"]}
                                />
                                <Legend verticalAlign="bottom" />
                                <Bar dataKey="totalCost" name="Total Material Cost" fill="#48BB78" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-16">No stock has been issued to any projects yet.</p>
                )}
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white p-6">Detailed Usage</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th className="px-6 py-3">Project Name</th>
                                <th className="px-6 py-3 text-right">Total Material Cost</th>
                                <th className="px-6 py-3 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map(p => (
                                <React.Fragment key={p.projectId}>
                                    <tr className="border-b border-gray-700 hover:bg-gray-600/50">
                                        <td className="px-6 py-4 font-medium text-white">{p.projectName}</td>
                                        <td className="px-6 py-4 text-right font-bold text-lg text-blue-300">PKR {p.totalCost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => handleToggle(p.projectId)} className="p-2 rounded-full hover:bg-gray-600">
                                                <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedProjectId === p.projectId ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedProjectId === p.projectId && (
                                        <tr className="bg-gray-900/50">
                                            <td colSpan={3} className="p-4">
                                                <div className="p-4 bg-gray-700 rounded-md">
                                                    <h4 className="font-semibold text-white mb-2">Materials Used:</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                                        {/* FIX: Added an explicit type to the 'mat' parameter to resolve 'unknown' type errors. */}
                                                        {Object.values(p.usedMaterials).map((mat: { name: string; quantity: number; unit: string; }) => (
                                                            <li key={mat.name}>
                                                                <span className="font-semibold text-gray-300">{mat.name}:</span> {mat.quantity.toLocaleString()} {mat.unit}(s)
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockUsageReport;
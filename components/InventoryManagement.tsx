import React, { useState, useMemo } from 'react';
import { Material, StockMovement, Vendor, Project, MaterialCategory } from '../types';
import StockInModal from './StockInModal';
import StockOutModal from './StockOutModal';
import StatCard from './StatCard';
import { PackageIcon, SquareStackIcon, AlertTriangleIcon } from './IconComponents';
// FIX: Add CartesianGrid to recharts import to resolve 'Cannot find name' error.
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';


interface InventoryManagementProps {
    materials: Material[];
    materialCategories: MaterialCategory[];
    stockMovements: StockMovement[];
    vendors: Vendor[];
    projects: Project[];
    onAddStock: (data: Omit<StockMovement, 'id' | 'type'>) => void;
    onIssueStock: (data: Omit<StockMovement, 'id' | 'type' | 'unitPrice' | 'vendorId'>) => void;
}

const LOW_STOCK_THRESHOLD = 10;
const COLORS = ["#48BB78", "#4299E1", "#A78BFA", "#F6E05E", "#ED8936", "#F56565"];

const InventoryManagement: React.FC<InventoryManagementProps> = ({ materials, materialCategories, stockMovements, vendors, projects, onAddStock, onIssueStock }) => {
    const [isStockInModalOpen, setStockInModalOpen] = useState(false);
    const [isStockOutModalOpen, setStockOutModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { materialStock, latestPrices } = useMemo(() => {
        const stockMap = new Map<number, number>();
        stockMovements.forEach(m => {
            const currentStock = stockMap.get(m.materialId) || 0;
            const change = m.type === 'in' ? m.quantity : -m.quantity;
            stockMap.set(m.materialId, currentStock + change);
        });
        
        const priceMap = new Map<number, number>();
        [...stockMovements]
            .filter(m => m.type === 'in' && m.unitPrice != null)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .forEach(m => {
                priceMap.set(m.materialId, m.unitPrice!);
            });

        return { materialStock: stockMap, latestPrices: priceMap };
    }, [stockMovements]);

    const inventorySummary = useMemo(() => {
        let totalValue = 0;
        let lowStockCount = 0;
        let distinctItems = 0;

        materials.forEach(material => {
            const stock = materialStock.get(material.id) || 0;
            if (stock > 0) {
                distinctItems++;
                const price = latestPrices.get(material.id) || 0;
                totalValue += stock * price;
            }
            if (stock > 0 && stock <= LOW_STOCK_THRESHOLD) {
                lowStockCount++;
            }
        });
        return { totalValue, lowStockCount, distinctItems };
    }, [materials, materialStock, latestPrices]);

    const chartData = useMemo(() => {
        return materials
            .map(m => ({
                name: m.name,
                stock: materialStock.get(m.id) || 0,
            }))
            .filter(m => m.stock > 0)
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 10);
    }, [materials, materialStock]);

    const getCategoryName = (categoryId: number) => {
        return materialCategories.find(c => c.id === categoryId)?.name || 'Uncategorized';
    };

    const filteredMaterials = useMemo(() => {
        return materials.filter(m => 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getCategoryName(m.categoryId).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [materials, searchTerm, materialCategories]);

    return (
        <>
            <div className="bg-background-secondary p-6 rounded-lg shadow-lg border border-secondary">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-accent">Inventory Overview</h2>
                    <div className="flex gap-4">
                        <button onClick={() => setStockOutModalOpen(true)} className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-500">Issue Stock</button>
                        <button onClick={() => setStockInModalOpen(true)} className="px-4 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-500">Add Stock</button>
                    </div>
                </div>
            
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard 
                      title="Total Inventory Value" 
                      value={`PKR ${inventorySummary.totalValue.toLocaleString()}`}
                      icon={<PackageIcon className="h-8 w-8 text-blue-400" />}
                      colorClass="bg-blue-500"
                    />
                    <StatCard 
                      title="Distinct Items in Stock" 
                      value={inventorySummary.distinctItems.toString()}
                      icon={<SquareStackIcon className="h-8 w-8 text-purple-400" />}
                      colorClass="bg-purple-500"
                    />
                    <StatCard 
                      title="Items Low on Stock" 
                      value={inventorySummary.lowStockCount.toString()}
                      icon={<AlertTriangleIcon className="h-8 w-8 text-yellow-400" />}
                      colorClass="bg-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-background-tertiary p-6 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-text-strong mb-4">Top 10 Stocked Items (by quantity)</h3>
                        {chartData.length > 0 ? (
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                                        <XAxis type="number" stroke="var(--text-secondary)" />
                                        <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={120} tick={{ fontSize: 12, fill: 'var(--text-primary)' }} interval={0} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--background-primary)', border: '1px solid var(--border-secondary)' }}
                                            formatter={(value: number) => [value.toLocaleString(), "Stock"]}
                                        />
                                        <Bar dataKey="stock" name="Current Stock">
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary">
                                No stock data to display.
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-background-tertiary p-6 rounded-lg shadow-inner">
                        <h3 className="text-xl font-semibold text-text-strong mb-4">Full Inventory List</h3>
                         <div className="mb-4">
                            <input 
                                type="text"
                                placeholder="Search materials..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-input border border-secondary rounded-lg px-3 py-2 text-text-strong placeholder-text-secondary"
                            />
                        </div>
                        <div className="overflow-x-auto max-h-[60vh]">
                            <table className="w-full text-sm text-left text-text-primary">
                                <thead className="text-xs text-text-secondary uppercase bg-background-tertiary-hover sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Material</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3 text-right">Current Stock</th>
                                        <th className="px-6 py-3">Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMaterials.map(m => {
                                        const stock = materialStock.get(m.id) || 0;
                                        const isLowStock = stock > 0 && stock <= LOW_STOCK_THRESHOLD;
                                        return (
                                            <tr key={m.id} className={`border-b border-secondary hover:bg-background-tertiary-hover ${isLowStock ? 'bg-amber-900/40' : ''}`}>
                                                <td className="px-6 py-4 font-medium text-text-strong">{m.name}</td>
                                                <td className="px-6 py-4">{getCategoryName(m.categoryId)}</td>
                                                <td className={`px-6 py-4 text-right font-bold text-2xl ${isLowStock ? 'text-yellow-400' : 'text-text-strong'}`}>
                                                    {stock.toLocaleString()}
                                                    {isLowStock && <span className="text-xs ml-1 align-top">(Low)</span>}
                                                </td>
                                                <td className="px-6 py-4">{m.unit}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                             {filteredMaterials.length === 0 && (
                                <div className="text-center py-16 text-text-secondary">
                                    <p>No materials found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isStockInModalOpen && (
                <StockInModal
                    materials={materials}
                    vendors={vendors}
                    projects={projects}
                    onAddStock={onAddStock}
                    onClose={() => setStockInModalOpen(false)}
                />
            )}
             {isStockOutModalOpen && (
                <StockOutModal
                    materials={materials}
                    projects={projects}
                    currentStock={materialStock}
                    onIssueStock={onIssueStock}
                    onClose={() => setStockOutModalOpen(false)}
                />
            )}
        </>
    );
};

export default InventoryManagement;
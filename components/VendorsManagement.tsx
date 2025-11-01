

import React, { useState, useMemo } from 'react';
import { Vendor, VendorCategory, StockMovement, Material, Project } from '../types';
import { PencilIcon, CurrencyDollarIcon, BuildingStorefrontIcon } from './IconComponents';
import VendorFormModal from './VendorFormModal';
import CategoryModal from './CategoryModal';
import StatCard from './StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface VendorsManagementProps {
    vendors: Vendor[];
    categories: VendorCategory[];
    stockMovements: StockMovement[];
    materials: Material[];
    projects: Project[];
    onSaveVendor: (item: Vendor) => void;
    onSaveCategory: (item: VendorCategory) => void;
    onViewVendor: (vendor: Vendor) => void;
}

const PIE_COLORS = ['#34d399', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#f472b6'];

const VendorsManagement: React.FC<VendorsManagementProps> = ({ vendors, categories, stockMovements, materials, projects, onSaveVendor, onSaveCategory, onViewVendor }) => {
    const [activeSubTab, setActiveSubTab] = useState('reports'); // Default to reports

    // State for modals from 'Manage' tab
    const [isVendorModalOpen, setVendorModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
    const [editingCategory, setEditingCategory] = useState<VendorCategory | undefined>(undefined);

    // Memoized calculations for reports
    const reportData = useMemo(() => {
        const purchases = stockMovements.filter(sm => sm.type === 'in');
        const totalSpent = purchases.reduce((sum, p) => sum + (p.quantity * (p.unitPrice || 0)), 0);

        const spendingByVendor = vendors.map(vendor => {
            const vendorPurchases = purchases.filter(p => p.vendorId === vendor.id);
            const total = vendorPurchases.reduce((sum, p) => sum + (p.quantity * (p.unitPrice || 0)), 0);
            return { name: vendor.name, totalSpent: total };
        }).filter(v => v.totalSpent > 0).sort((a, b) => b.totalSpent - a.totalSpent);

        const spendingByCategory = categories.map(category => {
            const categoryVendors = vendors.filter(v => v.categoryId === category.id);
            const categoryVendorIds = new Set(categoryVendors.map(v => v.id));
            const categoryPurchases = purchases.filter(p => p.vendorId && categoryVendorIds.has(p.vendorId));
            const total = categoryPurchases.reduce((sum, p) => sum + (p.quantity * (p.unitPrice || 0)), 0);
            return { name: category.name, value: total };
        }).filter(c => c.value > 0);

        return {
            totalSpent,
            topVendor: spendingByVendor[0] || null,
            spendingByVendor,
            spendingByCategory,
        };
    }, [stockMovements, vendors, categories]);
    
    // Purchase history data
    const purchaseHistory = useMemo(() => {
        return stockMovements
            .filter(sm => sm.type === 'in')
            .map(sm => {
                const vendor = vendors.find(v => v.id === sm.vendorId)?.name || 'N/A';
                const material = materials.find(m => m.id === sm.materialId)?.name || 'N/A';
                const project = projects.find(p => p.id === sm.projectId)?.name || 'General Purchase';
                const totalCost = sm.quantity * (sm.unitPrice || 0);
                return { ...sm, vendor, material, project, totalCost };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [stockMovements, vendors, materials, projects]);

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'N/A';
    
    const getSubTabClass = (tabName: string) => 
        `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeSubTab === tabName ? 'bg-accent text-on-accent' : 'text-text-primary bg-background-tertiary hover:bg-background-tertiary-hover'}`;


    const renderManageTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2 bg-background-primary p-6 rounded-lg shadow-inner">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-text-strong">Vendors List</h3>
                    <button onClick={() => { setEditingVendor(undefined); setVendorModalOpen(true); }} className="px-4 py-2 bg-accent text-on-accent font-bold text-sm rounded-lg hover:bg-accent-hover">Add Vendor</button>
                </div>
                <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-sm text-left text-text-primary">
                         <thead className="text-xs text-text-secondary uppercase bg-background-tertiary-hover sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Contact Person</th>
                                <th className="px-6 py-3">Phone</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map(v => (
                                <tr key={v.id} className="border-b border-primary hover:bg-background-tertiary-hover">
                                    <td className="px-6 py-4 font-medium text-text-strong">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onViewVendor(v); }} className="hover:text-accent">{v.name}</a>
                                    </td>
                                    <td className="px-6 py-4">{getCategoryName(v.categoryId)}</td>
                                    <td className="px-6 py-4">{v.contactPerson}</td>
                                    <td className="px-6 py-4">{v.phone}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => { setEditingVendor(v); setVendorModalOpen(true); }} className="text-blue-400 hover:text-blue-300">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-background-primary p-6 rounded-lg shadow-inner">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-text-strong">Vendor Categories</h3>
                    <button onClick={() => { setEditingCategory(undefined); setCategoryModalOpen(true); }} className="px-3 py-1 bg-background-tertiary text-text-strong font-semibold text-xs rounded-lg hover:bg-background-tertiary-hover">Add</button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {categories.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-background-tertiary p-3 rounded-md">
                            <span className="text-text-strong text-sm">{c.name}</span>
                            <button onClick={() => { setEditingCategory(c); setCategoryModalOpen(true); }} className="text-blue-400 hover:text-blue-300">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderReportsTab = () => (
        <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Purchase Value" 
                    value={`PKR ${reportData.totalSpent.toLocaleString()}`}
                    icon={<CurrencyDollarIcon className="h-8 w-8 text-green-400" />}
                    colorClass="bg-green-500"
                />
                <StatCard 
                    title="Total Vendors" 
                    value={vendors.length.toString()}
                    icon={<BuildingStorefrontIcon className="h-8 w-8 text-blue-400" />}
                    colorClass="bg-blue-500"
                />
                 <StatCard 
                    title="Top Vendor" 
                    value={reportData.topVendor?.name || 'N/A'}
                    icon={<BuildingStorefrontIcon className="h-8 w-8 text-yellow-400" />}
                    colorClass="bg-yellow-500"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-background-primary p-6 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold text-text-strong mb-4">Spending by Vendor</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.spendingByVendor.slice(0, 10)} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-secondary)'}} />
                            <Bar dataKey="totalSpent" name="Total Spent" fill="rgb(var(--primary-color-rgb))" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-background-primary p-6 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold text-text-strong mb-4">Spending by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                            <Pie data={reportData.spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {reportData.spendingByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--background-secondary)', border: '1px solid var(--border-secondary)'}} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
    
    const renderHistoryTab = () => (
        <div className="mt-6 bg-background-primary p-6 rounded-lg shadow-inner">
            <h3 className="text-xl font-semibold text-text-strong mb-4">All Purchase History</h3>
             <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full text-sm text-left text-text-primary">
                     <thead className="text-xs text-text-secondary uppercase bg-background-tertiary-hover sticky top-0">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Vendor</th>
                            <th className="px-6 py-3">Material</th>
                            <th className="px-6 py-3">Project</th>
                            <th className="px-6 py-3 text-right">Quantity</th>
                            <th className="px-6 py-3 text-right">Unit Price</th>
                            <th className="px-6 py-3 text-right">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseHistory.map(p => (
                            <tr key={p.id} className="border-b border-primary hover:bg-background-tertiary-hover">
                                <td className="px-6 py-4">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-text-strong">{p.vendor}</td>
                                <td className="px-6 py-4">{p.material}</td>
                                <td className="px-6 py-4 text-xs">{p.project}</td>
                                <td className="px-6 py-4 text-right">{p.quantity.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">{p.unitPrice?.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-semibold text-accent">{p.totalCost.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {purchaseHistory.length === 0 && <p className="text-center py-16 text-text-secondary">No purchase history found.</p>}
            </div>
        </div>
    );


    return (
        <div>
            <div className="bg-background-secondary p-2 rounded-xl shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setActiveSubTab('manage')} className={getSubTabClass('manage')}>Manage Vendors</button>
                    <button onClick={() => setActiveSubTab('reports')} className={getSubTabClass('reports')}>Purchase Reports</button>
                    <button onClick={() => setActiveSubTab('history')} className={getSubTabClass('history')}>Full History</button>
                </div>
            </div>

            {activeSubTab === 'manage' && renderManageTab()}
            {activeSubTab === 'reports' && renderReportsTab()}
            {activeSubTab === 'history' && renderHistoryTab()}

            {isVendorModalOpen && (
                <VendorFormModal
                    vendor={editingVendor}
                    categories={categories}
                    onSave={(v) => { onSaveVendor(v); setVendorModalOpen(false); }}
                    onClose={() => setVendorModalOpen(false)}
                />
            )}
            {isCategoryModalOpen && (
                <CategoryModal
                    item={editingCategory}
                    onSave={(name) => { onSaveCategory({ id: editingCategory?.id || 0, name }); setCategoryModalOpen(false); }}
                    onClose={() => setCategoryModalOpen(false)}
                    title="Vendor Category"
                />
            )}
        </div>
    );
};

export default VendorsManagement;
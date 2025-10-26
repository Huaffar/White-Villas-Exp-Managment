
import React, { useState } from 'react';
import { Vendor, VendorCategory } from '../types';
import { PencilIcon } from './IconComponents';
import VendorFormModal from './VendorFormModal';
import CategoryModal from './CategoryModal';

interface VendorsManagementProps {
    vendors: Vendor[];
    categories: VendorCategory[];
    onSaveVendor: (item: Vendor) => void;
    onSaveCategory: (item: VendorCategory) => void;
    onViewVendor: (vendor: Vendor) => void;
}

const VendorsManagement: React.FC<VendorsManagementProps> = ({ vendors, categories, onSaveVendor, onSaveCategory, onViewVendor }) => {
    const [isVendorModalOpen, setVendorModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
    const [editingCategory, setEditingCategory] = useState<VendorCategory | undefined>(undefined);

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'N/A';
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Vendors List</h2>
                    <button onClick={() => { setEditingVendor(undefined); setVendorModalOpen(true); }} className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:opacity-90">Add Vendor</button>
                </div>
                <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-sm text-left text-gray-300">
                         <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
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
                                <tr key={v.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onViewVendor(v); }} className="hover:text-yellow-400">{v.name}</a>
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
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Vendor Categories</h2>
                    <button onClick={() => { setEditingCategory(undefined); setCategoryModalOpen(true); }} className="px-3 py-1 bg-gray-600 text-white font-semibold text-xs rounded-lg hover:bg-gray-500">Add</button>
                </div>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {categories.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                            <span className="text-white text-sm">{c.name}</span>
                            <button onClick={() => { setEditingCategory(c); setCategoryModalOpen(true); }} className="text-blue-400 hover:text-blue-300">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
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

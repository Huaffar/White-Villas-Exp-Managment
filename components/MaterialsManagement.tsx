import React, { useState } from 'react';
import { Material, MaterialCategory } from '../types';
import { PencilIcon, TrashIcon } from './IconComponents';
import MaterialFormModal from './MaterialFormModal';
import CategoryModal from './CategoryModal';

interface MaterialsManagementProps {
    materials: Material[];
    categories: MaterialCategory[];
    onSaveMaterial: (item: Material) => void;
    onSaveCategory: (item: MaterialCategory) => void;
}

const MaterialsManagement: React.FC<MaterialsManagementProps> = ({ materials, categories, onSaveMaterial, onSaveCategory }) => {
    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(undefined);
    const [editingCategory, setEditingCategory] = useState<MaterialCategory | undefined>(undefined);

    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'N/A';
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Materials List</h2>
                    <button onClick={() => { setEditingMaterial(undefined); setMaterialModalOpen(true); }} className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:opacity-90">Add Material</button>
                </div>
                <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-sm text-left text-gray-300">
                         <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Unit</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map(m => (
                                <tr key={m.id} className="border-b border-gray-700 hover:bg-gray-600/50">
                                    <td className="px-6 py-4 font-medium text-white">{m.name}</td>
                                    <td className="px-6 py-4">{getCategoryName(m.categoryId)}</td>
                                    <td className="px-6 py-4">{m.unit}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => { setEditingMaterial(m); setMaterialModalOpen(true); }} className="text-blue-400 hover:text-blue-300">
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
                    <h2 className="text-xl font-semibold text-white">Categories</h2>
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
            {isMaterialModalOpen && (
                <MaterialFormModal
                    material={editingMaterial}
                    categories={categories}
                    onSave={onSaveMaterial}
                    onClose={() => setMaterialModalOpen(false)}
                />
            )}
            {isCategoryModalOpen && (
                <CategoryModal
                    item={editingCategory}
                    onSave={(name) => onSaveCategory({ id: editingCategory?.id || 0, name })}
                    onClose={() => setCategoryModalOpen(false)}
                    title="Material Category"
                />
            )}
        </div>
    );
};

export default MaterialsManagement;
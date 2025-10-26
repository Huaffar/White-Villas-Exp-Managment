import React, { useState } from 'react';
import { Material, MaterialCategory } from '../types';

interface MaterialFormModalProps {
    material?: Material;
    categories: MaterialCategory[];
    onSave: (item: Material) => void;
    onClose: () => void;
}

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ material, categories, onSave, onClose }) => {
    const [name, setName] = useState(material?.name || '');
    const [categoryId, setCategoryId] = useState(material?.categoryId || categories[0]?.id);
    const [unit, setUnit] = useState(material?.unit || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !categoryId || !unit) {
            alert('Please fill all fields.');
            return;
        }
        onSave({ id: material?.id || 0, name, categoryId, unit });
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">{material ? 'Edit Material' : 'Add New Material'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Material Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select value={categoryId} onChange={e => setCategoryId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Unit of Measurement</label>
                            <input type="text" value={unit} onChange={e => setUnit(e.target.value)} required placeholder="e.g., bag, ton, piece" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaterialFormModal;
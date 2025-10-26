import React, { useState } from 'react';
import { Material, Project, StockMovement } from '../types';

interface StockOutModalProps {
    materials: Material[];
    projects: Project[];
    currentStock: Map<number, number>;
    onIssueStock: (data: Omit<StockMovement, 'id' | 'type' | 'unitPrice' | 'vendorId'>) => void;
    onClose: () => void;
}

const StockOutModal: React.FC<StockOutModalProps> = ({ materials, projects, currentStock, onIssueStock, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [materialId, setMaterialId] = useState<number | undefined>(undefined);
    const [projectId, setProjectId] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState('');
    
    const availableStock = materialId ? (currentStock.get(materialId) || 0) : 0;
    const selectedMaterial = materials.find(m => m.id === materialId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!materialId || !projectId || !quantity) {
            alert('Please fill all fields.');
            return;
        }
        if (parseFloat(quantity) > availableStock) {
            alert(`Cannot issue ${quantity} units. Only ${availableStock} units are in stock.`);
            return;
        }
        onIssueStock({
            date,
            materialId,
            projectId,
            quantity: parseFloat(quantity),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Issue Stock to Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Material</label>
                            <select value={materialId || ''} onChange={e => setMaterialId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="" disabled>Select material</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                            <select value={projectId || ''} onChange={e => setProjectId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="" disabled>Select project</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Quantity to Issue</label>
                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="e.g., 50" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        {selectedMaterial && (
                             <p className="text-xs text-gray-400 mt-1">
                                Available Stock: <span className="font-bold">{availableStock}</span> {selectedMaterial.unit}(s)
                             </p>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500">Issue Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockOutModal;
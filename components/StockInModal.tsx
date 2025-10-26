import React, { useState } from 'react';
import { Material, Vendor, Project, StockMovement } from '../types';

interface StockInModalProps {
    materials: Material[];
    vendors: Vendor[];
    projects: Project[];
    onAddStock: (data: Omit<StockMovement, 'id' | 'type'>) => void;
    onClose: () => void;
}

const StockInModal: React.FC<StockInModalProps> = ({ materials, vendors, projects, onAddStock, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [materialId, setMaterialId] = useState<number | undefined>(undefined);
    const [vendorId, setVendorId] = useState<number | undefined>(undefined);
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [projectId, setProjectId] = useState<number | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!materialId || !vendorId || !quantity || !unitPrice) {
            alert('Please fill all required fields.');
            return;
        }
        onAddStock({
            date,
            materialId,
            vendorId,
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitPrice),
            projectId,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Add Stock (Purchase)</h2>
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
                            <label className="block text-sm font-medium text-gray-300 mb-1">Vendor</label>
                            <select value={vendorId || ''} onChange={e => setVendorId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                                <option value="" disabled>Select vendor</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="e.g., 100" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Unit Price</label>
                            <input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required placeholder="Price per unit" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Assign to Project (Optional)</label>
                        <select value={projectId || ''} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            <option value="">None</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500">Add Stock</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockInModal;
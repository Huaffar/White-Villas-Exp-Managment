import React, { useState } from 'react';
import { LayoutConfig } from './Dashboard';

interface DashboardLayoutModalProps {
    currentLayout: LayoutConfig;
    onSave: (newLayout: LayoutConfig) => void;
    onClose: () => void;
}

const LayoutOption: React.FC<{
    label: string;
    value: number;
    onChange: (newValue: number) => void;
}> = ({ label, value, onChange }) => {
    return (
        <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
            <span className="text-white">{label}</span>
            <div className="flex bg-gray-900 rounded-lg p-1">
                <button
                    type="button"
                    onClick={() => onChange(1)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${value === 1 ? 'bg-yellow-500 text-gray-900 font-semibold' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    Half Width
                </button>
                <button
                    type="button"
                    onClick={() => onChange(2)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${value === 2 ? 'bg-yellow-500 text-gray-900 font-semibold' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                    Full Width
                </button>
            </div>
        </div>
    );
};

const DashboardLayoutModal: React.FC<DashboardLayoutModalProps> = ({ currentLayout, onSave, onClose }) => {
    const [layout, setLayout] = useState(currentLayout);

    const handleSave = () => {
        onSave(layout);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Customize Dashboard Layout</h2>
                <div className="space-y-4">
                    <LayoutOption
                        label="Income vs Expense Chart"
                        value={layout.incomeExpense}
                        onChange={(v) => setLayout(prev => ({ ...prev, incomeExpense: v }))}
                    />
                    <LayoutOption
                        label="Income Trend Chart"
                        value={layout.incomeTrend}
                        onChange={(v) => setLayout(prev => ({ ...prev, incomeTrend: v }))}
                    />
                     <LayoutOption
                        label="Expense Trend Chart"
                        value={layout.expenseTrend}
                        onChange={(v) => setLayout(prev => ({ ...prev, expenseTrend: v }))}
                    />
                    <LayoutOption
                        label="Owner Payments Chart"
                        value={layout.ownerPayment}
                        onChange={(v) => setLayout(prev => ({ ...prev, ownerPayment: v }))}
                    />
                </div>
                <div className="flex justify-end gap-4 pt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400">Save Layout</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayoutModal;
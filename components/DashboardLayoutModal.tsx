import React, { useState } from 'react';
import { DashboardWidget } from './Dashboard';
import { ArrowUpIcon, ArrowDownIcon } from './IconComponents';

interface DashboardLayoutModalProps {
    widgets: DashboardWidget[];
    onSave: (newWidgets: DashboardWidget[]) => void;
    onClose: () => void;
}

const DashboardLayoutModal: React.FC<DashboardLayoutModalProps> = ({ widgets, onSave, onClose }) => {
    const [localWidgets, setLocalWidgets] = useState(widgets);
    
    // Ensure all possible widgets are present for customization
    const allWidgetDefinitions: Pick<DashboardWidget, 'id' | 'name'>[] = [
        { id: 'incomeExpense', name: 'Income vs Expense Chart' },
        { id: 'incomeTrend', name: 'Income Trend Chart' },
        { id: 'expenseTrend', name: 'Expense Trend Chart' },
        { id: 'expenseBreakdown', name: 'Expense Breakdown' },
        { id: 'ownerPayment', name: 'Owner Payments Chart' },
        { id: 'recentIncome', name: 'Recent Income' },
        { id: 'recentExpenses', name: 'Recent Expenses' },
    ];

    const fullWidgetList = allWidgetDefinitions.map(def => {
        const existing = localWidgets.find(w => w.id === def.id);
        return existing || { ...def, isVisible: false, size: 1 };
    });

    const [editableWidgets, setEditableWidgets] = useState(fullWidgetList);


    const handleSave = () => {
        onSave(editableWidgets);
        onClose();
    };

    const handleVisibilityChange = (id: string, isVisible: boolean) => {
        setEditableWidgets(prev => prev.map(w => w.id === id ? { ...w, isVisible } : w));
    };

    const handleSizeChange = (id: string, size: 1 | 2) => {
        setEditableWidgets(prev => prev.map(w => w.id === id ? { ...w, size } : w));
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newWidgets = [...editableWidgets];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newWidgets.length) return;

        [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
        setEditableWidgets(newWidgets);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-background-secondary p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-primary max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold text-accent mb-6">Customize Dashboard Layout</h2>
                <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                    {editableWidgets.map((widget, index) => (
                        <div key={widget.id} className="grid grid-cols-12 items-center gap-4 bg-background-tertiary p-3 rounded-md">
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    checked={widget.isVisible}
                                    onChange={(e) => handleVisibilityChange(widget.id, e.target.checked)}
                                    className="w-5 h-5 rounded bg-input border-secondary text-accent focus:ring-accent"
                                />
                            </div>
                            <div className="col-span-5">
                                <span className="text-text-strong">{widget.name}</span>
                            </div>
                            <div className="col-span-4 flex bg-background-primary rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => handleSizeChange(widget.id, 1)}
                                    className={`w-1/2 px-3 py-1 text-sm rounded-md transition-colors ${widget.size === 1 ? 'bg-accent text-on-accent font-semibold' : 'text-text-primary hover:bg-background-tertiary-hover'}`}
                                >
                                    Half
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSizeChange(widget.id, 2)}
                                    className={`w-1/2 px-3 py-1 text-sm rounded-md transition-colors ${widget.size === 2 ? 'bg-accent text-on-accent font-semibold' : 'text-text-primary hover:bg-background-tertiary-hover'}`}
                                >
                                    Full
                                </button>
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-2 rounded-md bg-background-tertiary-hover disabled:opacity-30 disabled:cursor-not-allowed">
                                    <ArrowUpIcon className="w-5 h-5 text-text-strong" />
                                </button>
                                <button onClick={() => handleMove(index, 'down')} disabled={index === editableWidgets.length - 1} className="p-2 rounded-md bg-background-tertiary-hover disabled:opacity-30 disabled:cursor-not-allowed">
                                    <ArrowDownIcon className="w-5 h-5 text-text-strong" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 pt-8 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-background-tertiary text-text-strong font-semibold rounded-lg hover:bg-background-tertiary-hover">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-6 py-2 bg-accent text-on-accent font-bold rounded-lg hover:bg-accent-hover">Save Layout</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayoutModal;
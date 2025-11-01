import React, { useState } from 'react';
import { Material, StockMovement, Vendor, Project, MaterialCategory, VendorCategory } from '../types';
import InventoryManagement from './InventoryManagement';
import MaterialsManagement from './MaterialsManagement';
import VendorsManagement from './VendorsManagement';
import StockUsageReport from './StockUsageReport';

interface ConstructionHubProps {
    materials: Material[];
    materialCategories: MaterialCategory[];
    stockMovements: StockMovement[];
    vendors: Vendor[];
    vendorCategories: VendorCategory[];
    projects: Project[];
    onAddStock: (data: Omit<StockMovement, 'id' | 'type'>) => void;
    onIssueStock: (data: Omit<StockMovement, 'id' | 'type' | 'unitPrice' | 'vendorId'>) => void;
    onSaveMaterial: (item: Material) => void;
    onSaveMaterialCategory: (item: MaterialCategory) => void;
    onSaveVendor: (item: Vendor) => void;
    onSaveVendorCategory: (item: VendorCategory) => void;
    onViewVendor: (vendor: Vendor) => void;
}

const ConstructionHub: React.FC<ConstructionHubProps> = (props) => {
    const [activeTab, setActiveTab] = useState('vendors');

    const getTabClass = (tabName: string) => 
        `${activeTab === tabName ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-secondary'} whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors`;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-accent">Construction Hub</h1>
            </div>
            
            <div className="border-b border-primary">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('inventory')} className={getTabClass('inventory')}>
                        Stock Inventory
                    </button>
                    <button onClick={() => setActiveTab('materials')} className={getTabClass('materials')}>
                        Materials
                    </button>
                    <button onClick={() => setActiveTab('vendors')} className={getTabClass('vendors')}>
                        Vendors
                    </button>
                    <button onClick={() => setActiveTab('usage')} className={getTabClass('usage')}>
                        Stock Usage Report
                    </button>
                </nav>
            </div>

             <div className="mt-8">
                {activeTab === 'inventory' && (
                    <InventoryManagement
                        materials={props.materials}
                        materialCategories={props.materialCategories}
                        stockMovements={props.stockMovements}
                        vendors={props.vendors}
                        projects={props.projects}
                        onAddStock={props.onAddStock}
                        onIssueStock={props.onIssueStock}
                    />
                )}
                {activeTab === 'materials' && (
                    <MaterialsManagement
                        materials={props.materials}
                        categories={props.materialCategories}
                        onSaveMaterial={props.onSaveMaterial}
                        onSaveCategory={props.onSaveMaterialCategory}
                    />
                )}
                {activeTab === 'vendors' && (
                    <VendorsManagement
                        vendors={props.vendors}
                        categories={props.vendorCategories}
                        onSaveVendor={props.onSaveVendor}
                        onSaveCategory={props.onSaveVendorCategory}
                        onViewVendor={props.onViewVendor}
                        stockMovements={props.stockMovements}
                        materials={props.materials}
                        projects={props.projects}
                    />
                )}
                {activeTab === 'usage' && (
                    <StockUsageReport
                        stockMovements={props.stockMovements}
                        materials={props.materials}
                        projects={props.projects}
                        materialCategories={props.materialCategories}
                    />
                )}
            </div>
        </div>
    );
};

export default ConstructionHub;
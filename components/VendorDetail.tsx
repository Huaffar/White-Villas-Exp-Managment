import React, { useState, useMemo } from 'react';
import { Vendor, StockMovement, Material, AdminProfile } from '../types';
import { PrinterIcon } from './IconComponents';
import VendorStatement from './VendorStatement';

interface VendorDetailProps {
    vendor: Vendor;
    materials: Material[];
    stockMovements: StockMovement[];
    adminProfile: AdminProfile;
    onBack: () => void;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor, materials, stockMovements, adminProfile, onBack }) => {
    const [isStatementVisible, setStatementVisible] = useState(false);
    
    const vendorPurchases = useMemo(() => {
        return stockMovements
            .filter(sm => sm.type === 'in' && sm.vendorId === vendor.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [stockMovements, vendor.id]);

    const totalSpent = useMemo(() => {
        return vendorPurchases.reduce((sum, p) => sum + (p.quantity * (p.unitPrice || 0)), 0);
    }, [vendorPurchases]);

    const getMaterialName = (id: number) => materials.find(m => m.id === id)?.name || 'Unknown Material';

    return (
        <>
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold">
                    &larr; Back to Vendors
                </button>
                <button onClick={() => setStatementVisible(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                    <PrinterIcon className="h-4 w-4" /> Print Statement
                </button>
            </div>


             <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start gap-6">
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold text-yellow-400">{vendor.name.charAt(0)}</span>
                </div>
                <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-white">{vendor.name}</h2>
                    <p className="text-gray-400 text-lg">{vendor.contactPerson}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-gray-700 pt-4">
                        <p><span className="text-gray-400">Phone:</span> <span className="font-semibold text-white">{vendor.phone}</span></p>
                        <p><span className="text-gray-400">Address:</span> <span className="font-semibold text-white">{vendor.address}</span></p>
                    </div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500 text-right">
                    <p className="text-sm text-gray-400 font-medium">Total Business</p>
                    <p className="text-2xl font-bold text-white">{adminProfile.currencySymbol} {totalSpent.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Purchase History</h3>
                <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Material</th>
                                <th className="px-6 py-3 text-right">Quantity</th>
                                <th className="px-6 py-3 text-right">Unit Price</th>
                                <th className="px-6 py-3 text-right">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendorPurchases.map(p => (
                                <tr key={p.id} className="border-b border-gray-700">
                                    <td className="px-6 py-4">{new Date(p.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">{getMaterialName(p.materialId)}</td>
                                    <td className="px-6 py-4 text-right">{p.quantity.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">{p.unitPrice?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-blue-300">
                                        {(p.quantity * (p.unitPrice || 0)).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {vendorPurchases.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">No purchases recorded from this vendor.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {isStatementVisible && (
            <VendorStatement
                vendor={vendor}
                purchases={vendorPurchases}
                materials={materials}
                adminProfile={adminProfile}
                onClose={() => setStatementVisible(false)}
            />
        )}
        </>
    );
};

export default VendorDetail;
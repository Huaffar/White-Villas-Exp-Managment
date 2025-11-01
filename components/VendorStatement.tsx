

import React from 'react';
import { Vendor, StockMovement, AdminProfile, Material } from '../types';
import { PrinterIcon, CloseIcon } from './IconComponents';

interface VendorStatementProps {
  vendor: Vendor;
  purchases: StockMovement[];
  materials: Material[];
  adminProfile: AdminProfile;
  onClose: () => void;
}

const VendorStatement: React.FC<VendorStatementProps> = ({ vendor, purchases, materials, adminProfile, onClose }) => {
    
    const handlePrint = () => {
        window.print();
    };

    const getMaterialName = (id: number) => materials.find(m => m.id === id)?.name || 'N/A';
    const totalSpent = purchases.reduce((sum, p) => sum + (p.quantity * (p.unitPrice || 0)), 0);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center p-4">
            <div className="no-print w-full max-w-4xl bg-gray-800 p-3 rounded-t-lg flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold primary-text">Vendor Statement: {vendor.name}</h2>
                <div className="flex gap-4">
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                        <PrinterIcon className="h-4 w-4" /> Print / Save PDF
                    </button>
                    <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold text-sm rounded-lg hover:bg-gray-500">
                        <CloseIcon className="h-4 w-4" /> Close
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto w-full max-w-4xl">
                <div id="printable-report" className="bg-white text-gray-900 p-12 font-sans">
                    <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
                        <div>
                            {adminProfile.logoUrl && <img src={adminProfile.logoUrl} alt="Company Logo" className="h-16 w-auto mb-4" />}
                            <h1 className="text-3xl font-bold">{adminProfile.companyName}</h1>
                            <p className="text-gray-600">{adminProfile.address}</p>
                        </div>
                        <div className="text-right">
                             <h2 className="text-2xl font-bold text-gray-500 uppercase">Vendor Statement</h2>
                             <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </header>

                    <section className="my-8">
                         <h3 className="text-sm text-gray-500 uppercase font-bold">Statement For</h3>
                         <p className="font-semibold text-lg">{vendor.name}</p>
                         <p className="text-gray-700">{vendor.address}</p>
                         <p className="text-gray-700">{vendor.phone}</p>
                    </section>
                    
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Purchase History</h3>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Material</th>
                                    <th className="p-2 text-right">Qty</th>
                                    <th className="p-2 text-right">Unit Price</th>
                                    <th className="p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map(p => (
                                    <tr key={p.id} className="border-b">
                                        <td className="p-2">{new Date(p.date).toLocaleDateString()}</td>
                                        <td className="p-2">{getMaterialName(p.materialId)}</td>
                                        <td className="p-2 text-right">{p.quantity.toLocaleString()}</td>
                                        <td className="p-2 text-right">{p.unitPrice?.toLocaleString() || 0}</td>
                                        <td className="p-2 text-right">{(p.quantity * (p.unitPrice || 0)).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold bg-gray-200">
                                    <td colSpan={4} className="p-2 text-right">Total Purchases</td>
                                    <td className="p-2 text-right">{totalSpent.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>

                    <footer className="relative text-center text-xs text-gray-500 mt-16 pt-4 border-t">
                         {adminProfile.stampUrl && (
                            <img src={adminProfile.stampUrl} alt="Stamp" className="absolute -top-16 right-0 w-28 h-28 object-contain opacity-70" />
                        )}
                        <p>&copy; {new Date().getFullYear()} {adminProfile.companyName}</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default VendorStatement;
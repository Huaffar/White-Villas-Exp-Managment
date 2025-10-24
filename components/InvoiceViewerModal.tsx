import React from 'react';
import { StaffMember, Transaction, AdminProfile } from '../types';
import Invoice from './Invoice';
import { PrinterIcon, WhatsAppIcon, CloseIcon } from './IconComponents';

interface InvoiceViewerModalProps {
  staffMember: StaffMember;
  transaction: Transaction;
  adminProfile: AdminProfile;
  onClose: () => void;
}

const InvoiceViewerModal: React.FC<InvoiceViewerModalProps> = ({ staffMember, transaction, adminProfile, onClose }) => {

    const handleSendWhatsApp = () => {
        const message = `Dear ${staffMember.name},\n\nYour salary of PKR ${transaction.amount.toLocaleString()} for the period ending ${new Date(transaction.date).toLocaleDateString()} has been processed.\n\nThank you,\n${adminProfile.companyName}`;
        const whatsappUrl = `https://wa.me/${staffMember.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    const handlePrint = () => {
        const printContents = document.getElementById('printable-invoice-wrapper')?.innerHTML;
        if (printContents) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to re-attach React
        }
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl border border-gray-700 flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
                 <h2 className="text-xl font-bold primary-text">Salary Paid Successfully</h2>
                 <div className="flex gap-4">
                    {staffMember.phone && (
                        <button onClick={handleSendWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500">
                           <WhatsAppIcon className="w-5 h-5" /> Send on WhatsApp
                        </button>
                    )}
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                        <PrinterIcon className="h-4 w-4" /> Print
                    </button>
                    <button onClick={onClose} className="p-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">
                        <CloseIcon className="h-5 w-5" />
                    </button>
                 </div>
            </div>
            <div className="p-4 overflow-y-auto" style={{maxHeight: '70vh'}}>
                <div id="printable-invoice-wrapper">
                    <Invoice 
                        staffMember={staffMember} 
                        transaction={transaction}
                        companyProfile={{ name: adminProfile.companyName, logoUrl: adminProfile.logoUrl }}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default InvoiceViewerModal;
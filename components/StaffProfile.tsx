import React, { useState, useMemo } from 'react';
import { StaffMember, Transaction, AdminProfile } from '../types';
import { SystemCategoryNames } from '../App';
import { WhatsAppIcon, PrinterIcon } from './IconComponents';
import StaffStatement from './StaffStatement';

interface StaffProfileProps {
  staffMember: StaffMember;
  transactions: Transaction[];
  onBack: () => void;
  onAddCommission: () => void;
  systemCategoryNames: SystemCategoryNames;
  adminProfile: AdminProfile;
}

const Stat: React.FC<{label: string, value: string, color?: string}> = ({ label, value, color = 'text-white' }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
)

const StaffProfile: React.FC<StaffProfileProps> = ({ staffMember, transactions, onBack, onAddCommission, systemCategoryNames, adminProfile }) => {
  const [isStatementVisible, setStatementVisible] = useState(false);
  
  const staffTransactions = useMemo(() => transactions
    .filter(t => t.staffId === staffMember.id && (t.category === systemCategoryNames.salaries || t.category === systemCategoryNames.commission))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
    [transactions, staffMember.id, systemCategoryNames]
  );

  const financialSummary = useMemo(() => {
    const today = new Date();
    const joiningDate = new Date(staffMember.joiningDate);
    
    // Calculate full months worked. If someone joins on 15th Jan and today is 14th Feb, it's 0 full months.
    // If today is 15th Feb, it's 1 full month.
    let months = (today.getFullYear() - joiningDate.getFullYear()) * 12;
    months -= joiningDate.getMonth();
    months += today.getMonth();
    if (today.getDate() < joiningDate.getDate()) {
        months--;
    }
    const totalMonths = months < 0 ? 0 : months;
    
    // Total earned is based on monthly salary over the months they have worked.
    const totalSalaryEarned = totalMonths * staffMember.salary;
    const totalCommissions = staffTransactions
        .filter(t => t.category === systemCategoryNames.commission)
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalPaid = staffTransactions.reduce((sum, t) => sum + t.amount, 0);
    const openingBalance = staffMember.openingBalance || 0;

    // Total due is opening balance + salary earned. Paid amount is subtracted from this.
    const currentBalance = (openingBalance + totalSalaryEarned + totalCommissions) - totalPaid;

    return { totalSalaryEarned: totalSalaryEarned + totalCommissions, totalPaid, currentBalance };
  }, [staffMember, staffTransactions, systemCategoryNames]);


  const handleSendWhatsApp = () => {
    if (!staffMember.phone) {
        alert('This staff member does not have a WhatsApp number saved.');
        return;
    }
    const message = `Dear ${staffMember.name},\n\nThis is a summary of your account with ${adminProfile.companyName}. Your current outstanding balance is PKR ${financialSummary.currentBalance.toLocaleString()}.\n\nThank you.`;
    const whatsappUrl = `https://wa.me/${staffMember.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  const ProfilePic: React.FC<{staff: StaffMember}> = ({staff}) => {
    if (staff.imageUrl) {
        return <img src={staff.imageUrl} alt={staff.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"/>
    }
    const initials = staff.name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
         <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-3xl border-4 border-gray-700">
            {initials}
        </div>
    )
  }

  return (
    <>
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button onClick={onBack} className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold">
                &larr; Back to Staff Management
            </button>
            <div className="flex flex-wrap gap-2">
                 <button onClick={handleSendWhatsApp} disabled={!staffMember.phone} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    <WhatsAppIcon className="w-5 h-5" /> Share on WhatsApp
                </button>
                 <button onClick={() => setStatementVisible(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-500">
                    <PrinterIcon className="w-5 h-5" /> Save as PDF
                </button>
                <button onClick={onAddCommission} className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold text-sm rounded-lg hover:bg-yellow-400">
                    Add Commission
                </button>
            </div>
        </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
        <ProfilePic staff={staffMember} />
        <div className="flex-grow">
            <h2 className="text-3xl font-bold text-white">{staffMember.name}</h2>
            <p className="text-gray-400 text-lg">{staffMember.position}</p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-gray-700 pt-4">
                <p><span className="text-gray-400">Salary:</span> <span className="font-semibold text-white">PKR {staffMember.salary.toLocaleString()}</span></p>
                <p><span className="text-gray-400">Joining Date:</span> <span className="font-semibold text-white">{new Date(staffMember.joiningDate).toLocaleDateString()}</span></p>
                <p><span className="text-gray-400">Contact:</span> <span className="font-semibold text-white">{staffMember.contact}</span></p>
                <p><span className="text-gray-400">Status:</span> <span className="font-semibold text-white">{staffMember.status}</span></p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Total Salary Earned" value={`PKR ${financialSummary.totalSalaryEarned.toLocaleString()}`} color="text-green-400" />
        <Stat label="Total Paid" value={`PKR ${financialSummary.totalPaid.toLocaleString()}`} color="text-red-400" />
        <Stat label="Current Balance" value={`PKR ${financialSummary.currentBalance.toLocaleString()}`} color={financialSummary.currentBalance >= 0 ? 'text-blue-300' : 'text-orange-400'} />
      </div>

       <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
         <h3 className="text-xl font-semibold text-white mb-4">Account Statement</h3>
         <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Details</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3 text-right">Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {staffTransactions.length > 0 ? staffTransactions.map(t => (
                        <tr key={t.id} className="border-b border-gray-700">
                            <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-white">{t.details}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${t.category === systemCategoryNames.salaries ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}>
                                    {t.category === systemCategoryNames.salaries ? 'Salaries' : 'Commission'}
                                </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-semibold text-red-400`}>
                                {t.amount.toLocaleString()}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-400">No transactions recorded.</td>
                        </tr>
                    )}
                </tbody>
            </table>
         </div>
      </div>
    </div>
    {isStatementVisible && (
        <StaffStatement 
            staffMember={staffMember}
            transactions={staffTransactions}
            summary={financialSummary}
            adminProfile={adminProfile}
            onClose={() => setStatementVisible(false)}
        />
    )}
    </>
  );
};

export default StaffProfile;
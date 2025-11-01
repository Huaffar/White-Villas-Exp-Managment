
import {
    Transaction, TransactionType, Category, Project, ProjectStatus, StaffMember, StaffStatus, Laborer, LaborerStatus, Contact, User, UserRole, AdminProfile, MaterialCategory, Material, VendorCategory, Vendor, StockMovement, LeadStatus, Commission
} from '../types';


export const mockUsers: User[] = [
    { id: 1, name: 'Super Admin', username: 'superadmin', password: 'password', role: UserRole.SUPER_ADMIN },
    { id: 2, name: 'Admin', username: 'admin', password: 'password', role: UserRole.ADMIN },
    { id: 3, name: 'Fatima Ahmed', username: 'fatima', password: 'password', role: UserRole.STAFF_ACCOUNTANT },
    { id: 4, name: 'Ali Khan', username: 'ali', password: 'password', role: UserRole.CONSTRUCTION_MANAGER },
    { id: 5, name: 'Asif Malik', username: 'asif', password: 'password', role: UserRole.CLIENT, contactId: 1 },
];

export const mockContacts: Contact[] = [
    { id: 1, name: 'Asif Malik', company: 'Malik Corp', phone: '923001112222', email: 'asif@malik.com', type: 'Client', cnic: '35202-1234567-1', imageUrl: '' },
    { id: 2, name: 'Builders Supply Co.', phone: '923213334444', type: 'Supplier' },
    { id: 3, name: 'Zainab Ansari', phone: '923335556666', email: 'zainab@ansari.com', type: 'Client', cnic: '35202-7654321-2', imageUrl: '' },
];

export const mockLeadStatuses: LeadStatus[] = [
    { id: 'new', name: 'New', color: '#3B82F6' },
    { id: 'contacted', name: 'Contacted', color: '#F97316' },
    { id: 'qualified', name: 'Qualified', color: '#22C55E' },
    { id: 'proposal', name: 'Proposal Sent', color: '#A855F7' },
    { id: 'won', name: 'Won', color: '#14B8A6' },
    { id: 'lost', name: 'Lost', color: '#EF4444' },
];

export const mockAdminProfile: AdminProfile = {
    companyName: 'White Villas Accounting Pro',
    logoUrl: 'https://img.icons8.com/ios-filled/50/ffffff/villa.png',
    stampUrl: '',
    address: '123 Villa Street, Lahore, Pakistan',
    phone: '+92 42 3000 0000',
    currencySymbol: 'PKR',
    smsSettings: {
        apiUrl: 'https://sms.whiteice.com.pk/services/send.php',
        apiKey: 'YOUR_API_KEY',
        smsDemoMode: true,
    },
    smsTemplates: [
        { id: 'clientPayment', name: 'Client Payment Confirmation', content: 'Dear {{clientName}}, we have received your payment of PKR {{amount}}. Thank you for your business. - {{companyName}}', placeholders: ['{{clientName}}', '{{amount}}', '{{companyName}}'], active: true },
        { id: 'staffSalary', name: 'Staff Salary Notification', content: 'Hi {{staffName}}, your salary of PKR {{amount}} has been transferred to your account. - {{companyName}}', placeholders: ['{{staffName}}', '{{amount}}', '{{companyName}}'], active: true },
    ],
    leadStatuses: mockLeadStatuses,
    themeColor: '234 88 12',
};

export const mockIncomeCategories: Category[] = [
    { id: 1, name: 'Project Payments from Clients', type: TransactionType.INCOME, systemLink: 'projectPayment' },
    { id: 2, name: 'Client Investment / Capital', type: TransactionType.INCOME, systemLink: 'clientInvestment' },
    { id: 3, name: 'Maintenance Bill', type: TransactionType.INCOME },
    { id: 4, name: 'Rental Income', type: TransactionType.INCOME },
];

export const mockExpenseCategories: Category[] = [
    { id: 101, name: 'Staff Salaries', type: TransactionType.EXPENSE, systemLink: 'salaries' },
    { id: 102, name: 'Staff Commission', type: TransactionType.EXPENSE, systemLink: 'commission' },
    { id: 103, name: 'House Expenses', type: TransactionType.EXPENSE, systemLink: 'houseExpense' },
    { id: 104, name: 'Construction Material', type: TransactionType.EXPENSE, systemLink: 'constructionMaterial' },
    { id: 105, name: 'Construction Labor', type: TransactionType.EXPENSE, systemLink: 'constructionLabor' },
    { id: 106, name: 'Vendor Payment', type: TransactionType.EXPENSE, systemLink: 'vendorPayment' },
    { id: 107, name: 'Office Rent', type: TransactionType.EXPENSE },
    { id: 108, name: 'Utilities', type: TransactionType.EXPENSE },
];

export const mockOwnerCategories: Category[] = [
    { id: 201, name: 'Owner Withdrawal', type: TransactionType.AMOUNT_OUT },
    { id: 202, name: 'Partner Payout', type: TransactionType.AMOUNT_OUT },
];

export const mockProjects: Project[] = [
    { id: 1, name: 'Villa Renovation DHA', clientName: 'Asif Malik', budget: 5000000, startDate: '2023-01-15', status: ProjectStatus.ONGOING, projectType: 'Construction', constructionType: 'House', contactId: 1 },
    { id: 2, name: 'Garden Design', clientName: 'Zainab Ansari', budget: 500000, startDate: '2023-03-01', status: ProjectStatus.COMPLETED, projectType: 'General', contactId: 3 },
];

export const mockStaff: StaffMember[] = [
    { id: 1, name: 'M Ghaffar', position: 'Manager', salary: 120000, joiningDate: '2022-01-01', contact: '0300-1234567', phone: '923001234567', status: StaffStatus.ACTIVE, openingBalance: 10000 },
    { id: 2, name: 'Sana Javed', position: 'Accountant', salary: 75000, joiningDate: '2022-06-15', contact: '0321-7654321', phone: '923217654321', status: StaffStatus.ACTIVE, openingBalance: -5000 },
];

export const mockLaborers: Laborer[] = [
    { id: 1, name: 'Karam Din', trade: 'Mason', dailyWage: 2500, contact: '0333-1112223', status: LaborerStatus.ACTIVE },
    { id: 2, name: 'Allah Ditta', trade: 'Electrician', dailyWage: 3000, contact: '0345-4445556', status: LaborerStatus.ACTIVE },
];

export const mockTransactions: Transaction[] = [
    { id: 1, date: '2023-04-01', details: 'Initial Capital from Asif Malik', category: 'Client Investment / Capital', type: TransactionType.INCOME, amount: 2000000, balance: 2000000, projectId: 1, contactId: 1 },
    { id: 2, date: '2023-04-05', details: 'Salary for M Ghaffar - March', category: 'Staff Salaries', type: TransactionType.EXPENSE, amount: 120000, balance: 1880000, staffId: 1 },
    { id: 3, date: '2023-04-10', details: 'Payment for Villa Renovation - Phase 1', category: 'Project Payments from Clients', type: TransactionType.INCOME, amount: 1000000, balance: 2880000, projectId: 1, contactId: 1 },
    { id: 4, date: '2023-04-12', details: 'Payment to Karam Din for 5 days work', category: 'Construction Labor', type: TransactionType.EXPENSE, amount: 12500, balance: 2867500, laborerId: 1, projectId: 1 },
    { id: 8, date: '2023-04-15', details: 'Paid commission: Bonus for Villa Renovation milestone', category: 'Staff Commission', type: TransactionType.EXPENSE, amount: 25000, balance: 2842500, staffId: 1 },
    { id: 5, date: '2023-04-15', details: 'Office Electricity Bill', category: 'Utilities', type: TransactionType.EXPENSE, amount: 15000, balance: 2827500 },
    { id: 6, date: '2023-04-20', details: 'Owner withdrawal for personal use', category: 'Owner Withdrawal', type: TransactionType.AMOUNT_OUT, amount: 50000, balance: 2777500 },
    { id: 7, date: '2023-04-22', details: 'Payment to Builders Supply Co.', category: 'Vendor Payment', type: TransactionType.EXPENSE, amount: 250000, balance: 2527500, vendorId: 1, paymentMethod: 'Bank' },
];

export const mockCommissions: Commission[] = [
    { id: 1, staffId: 1, date: '2023-04-10', amount: 25000, remarks: 'Bonus for Villa Renovation milestone', isPaid: true, paidTransactionId: 8 },
    { id: 2, staffId: 1, date: '2023-04-25', amount: 15000, remarks: 'Commission for Garden Design project', isPaid: false },
    { id: 3, staffId: 2, date: '2023-04-18', amount: 10000, remarks: 'Client referral bonus', isPaid: false },
];

export const mockMaterialCategories: MaterialCategory[] = [
    { id: 1, name: 'Cement' },
    { id: 2, name: 'Steel Bars' },
    { id: 3, name: 'Piping' },
    { id: 4, name: 'Electrical' },
];

export const mockMaterials: Material[] = [
    { id: 1, name: 'OPC Cement Bag', categoryId: 1, unit: 'bag' },
    { id: 2, name: 'Grade 60 Steel Bar', categoryId: 2, unit: 'ton' },
    { id: 3, name: 'PPR Pipe 1-inch', categoryId: 3, unit: 'piece' },
];

export const mockVendorCategories: VendorCategory[] = [
    { id: 1, name: 'Hardware Supplier' },
    { id: 2, name: 'Sanitary Fittings' },
];

export const mockVendors: Vendor[] = [
    { id: 1, name: 'Builders Supply Co.', categoryId: 1, contactPerson: 'Mr. Imran', phone: '0321-3334444', address: 'Township, Lahore' },
    { id: 2, name: 'Lahore Sanitary Store', categoryId: 2, contactPerson: 'Shakeel Ahmed', phone: '0300-9998888', address: 'Main Market, Gulberg' },
];

export const mockStockMovements: StockMovement[] = [
    { id: 1, date: '2023-04-08', materialId: 1, type: 'in', quantity: 200, unitPrice: 1200, vendorId: 1, projectId: 1 },
    { id: 2, date: '2023-04-09', materialId: 2, type: 'in', quantity: 5, unitPrice: 280000, vendorId: 1, projectId: 1 },
    { id: 3, date: '2023-04-11', materialId: 1, type: 'out', quantity: 50, projectId: 1 },
];

const appMockData = {
    transactions: mockTransactions,
    incomeCategories: mockIncomeCategories,
    expenseCategories: mockExpenseCategories,
    ownerCategories: mockOwnerCategories,
    projects: mockProjects,
    staff: mockStaff,
    laborers: mockLaborers,
    contacts: mockContacts,
    users: mockUsers,
    adminProfile: mockAdminProfile,
    materialCategories: mockMaterialCategories,
    materials: mockMaterials,
    vendorCategories: mockVendorCategories,
    vendors: mockVendors,
    stockMovements: mockStockMovements,
    commissions: mockCommissions,
};

export default appMockData;
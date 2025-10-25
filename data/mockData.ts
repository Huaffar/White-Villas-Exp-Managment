import { Transaction, TransactionType, StaffMember, StaffStatus, Project, ProjectStatus, Category, Laborer, LaborerStatus, Contact, AdminProfile } from '../types';

// Utility to create dates
const d = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

export const mockIncomeCategories: Category[] = [
    { id: 1, name: 'Project Payment', type: TransactionType.INCOME, systemLink: 'PROJECT_PAYMENT' },
    { id: 15, name: 'Client Investment', type: TransactionType.INCOME, systemLink: 'CLIENT_INVESTMENT' },
    { id: 2, name: 'Asset Sale', type: TransactionType.INCOME },
    { id: 13, name: 'Maintenance Bill', type: TransactionType.INCOME },
    { id: 3, name: 'Other', type: TransactionType.INCOME },
];

export const mockExpenseCategories: Category[] = [
    { id: 4, name: 'Salaries', type: TransactionType.EXPENSE, systemLink: 'SALARIES' },
    { id: 5, name: 'Construction Material', type: TransactionType.EXPENSE, systemLink: 'CONSTRUCTION_MATERIAL' },
    { id: 6, name: 'Construction Labor', type: TransactionType.EXPENSE, systemLink: 'CONSTRUCTION_LABOR' },
    { id: 7, name: 'Utilities', type: TransactionType.EXPENSE },
    { id: 8, name: 'Office Rent', type: TransactionType.EXPENSE },
    { id: 9, name: 'Marketing', type: TransactionType.EXPENSE },
    { id: 10, name: 'Commission', type: TransactionType.EXPENSE, systemLink: 'COMMISSION' },
    { id: 11, name: 'Other', type: TransactionType.EXPENSE },
    { id: 12, name: 'House Expense', type: TransactionType.EXPENSE, systemLink: 'HOUSE_EXPENSE' },
];

export const mockAmountOutCategories: Category[] = [
    { id: 14, name: 'Owner/Partner Payment', type: TransactionType.AMOUNT_OUT, systemLink: 'OWNER_PAYMENT' },
];

export const mockStaff: StaffMember[] = [
    { id: 1, name: 'Ali Khan', position: 'Project Manager', salary: 120000, joiningDate: d(400), contact: '0300-1234567', status: StaffStatus.ACTIVE, phone: '923001234567', openingBalance: 15000 },
    { id: 2, name: 'Fatima Ahmed', position: 'Accountant', salary: 85000, joiningDate: d(200), contact: '0321-7654321', status: StaffStatus.ACTIVE, phone: '923217654321', openingBalance: 0 },
    { id: 3, name: 'Zainab Bibi', position: 'Site Supervisor', salary: 95000, joiningDate: d(100), contact: '0333-1122334', status: StaffStatus.ACTIVE, phone: '923331122334', openingBalance: 0 },
];

export const mockLaborers: Laborer[] = [
    { id: 1, name: 'Babar Azam', trade: 'Mason', dailyWage: 2500, contact: '0345-9876543', status: LaborerStatus.ACTIVE },
    { id: 2, name: 'Rizwan Ahmed', trade: 'Electrician', dailyWage: 3000, contact: '0312-3456789', status: LaborerStatus.ACTIVE },
];


export const mockProjects: Project[] = [
    { id: 1, name: 'Villa Renovation', clientName: 'Mr. Asif', budget: 5000000, startDate: d(90), status: ProjectStatus.ONGOING, projectType: 'Construction', constructionType: 'House', contactId: 1 },
    { id: 2, name: 'Downtown Apartments Plumbing', clientName: 'City Builders', budget: 2500000, startDate: d(45), status: ProjectStatus.ONGOING, projectType: 'Construction', constructionType: 'Apartment', contactId: 2 },
    { id: 3, name: 'Corporate Office Setup', clientName: 'Tech Solutions Inc.', budget: 1000000, startDate: d(120), status: ProjectStatus.COMPLETED, projectType: 'General', contactId: 4 },
];

let balance = 0;
const rawTransactions: Omit<Transaction, 'id' | 'balance'>[] = [
    { date: d(80), details: 'Initial Capital', category: 'Other', type: TransactionType.INCOME, amount: 10000000 },
    { date: d(75), details: 'Down payment for Villa Renovation', category: 'Project Payment', type: TransactionType.INCOME, amount: 1500000, projectId: 1, contactId: 1 },
    { date: d(70), details: 'Cement purchase', category: 'Construction Material', type: TransactionType.EXPENSE, amount: 200000, projectId: 1 },
    { date: d(65), details: 'Salary for Ali Khan', category: 'Salaries', type: TransactionType.EXPENSE, amount: 120000, staffId: 1 },
    { date: d(60), details: 'Labor payment to Babar Azam', category: 'Construction Labor', type: TransactionType.EXPENSE, amount: 25000, laborerId: 1, projectId: 1 },
    { date: d(55), details: 'First milestone for Downtown Apts', category: 'Project Payment', type: TransactionType.INCOME, amount: 750000, projectId: 2, contactId: 2 },
    { date: d(50), details: 'Pipes and fittings', category: 'Construction Material', type: TransactionType.EXPENSE, amount: 150000, projectId: 2 },
    { date: d(45), details: 'Monthly Maintenance Fee - Villa', category: 'Maintenance Bill', type: TransactionType.INCOME, amount: 25000, contactId: 1 },
    { date: d(40), details: 'Final payment for Office Setup', category: 'Project Payment', type: TransactionType.INCOME, amount: 500000, projectId: 3, contactId: 4 },
    { date: d(35), details: 'Salary for Fatima Ahmed', category: 'Salaries', type: TransactionType.EXPENSE, amount: 85000, staffId: 2 },
    { date: d(30), details: 'Payment to Land Owner', category: 'Owner/Partner Payment', type: TransactionType.AMOUNT_OUT, amount: 500000 },
    { date: d(25), details: 'Investment from Mr. Asif', category: 'Client Investment', type: TransactionType.INCOME, amount: 500000, contactId: 1 },
    { date: d(20), details: 'Salary for Fatima Ahmed', category: 'Salaries', type: TransactionType.EXPENSE, amount: 85000, staffId: 2 },
    { date: d(15), details: 'Groceries for home', category: 'House Expense', type: TransactionType.EXPENSE, amount: 15000 },
    { date: d(10), details: 'Final payment for Office Setup', category: 'Project Payment', type: TransactionType.INCOME, amount: 500000, projectId: 3, contactId: 4 },
    { date: d(5), details: 'House gas bill', category: 'House Expense', type: TransactionType.EXPENSE, amount: 5000 },
];

// Calculate balance and add id
export const mockTransactions: Transaction[] = rawTransactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t, index) => {
        if (t.type === TransactionType.INCOME) {
            balance += t.amount;
        } else { // Handles EXPENSE and AMOUNT_OUT
            balance -= t.amount;
        }
        return { ...t, id: index + 1, balance };
    });

export const mockContacts: Contact[] = [
    {id: 1, name: 'Mr. Asif', phone: '0300-1112233', type: 'Client', company: 'Self'},
    {id: 2, name: 'City Builders', phone: '0321-4455667', type: 'Client', company: 'City Builders'},
    {id: 3, name: 'National Cement', phone: '0333-7788990', type: 'Supplier', company: 'National Cement'},
    {id: 4, name: 'Tech Solutions Inc.', phone: '0311-9998877', type: 'Client', company: 'Tech Solutions'},
];

export const mockAdminProfile: AdminProfile = {
    companyName: 'White Villas Construction',
    logoUrl: '',
    address: '123 Construction Lane, Lahore, Pakistan',
    phone: '+92 42 35000000',
    taxId: 'P-1234567',
    currencySymbol: 'PKR',
    themeColor: '234 88 12', // Default yellow-500
    mode: 'dark',
};
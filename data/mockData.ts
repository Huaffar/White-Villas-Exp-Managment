// FIX: Added full content for mockData.ts to provide sample data for the application.
import { Transaction, TransactionType, Project, ProjectStatus, StaffMember, StaffStatus, Category, AdminProfile } from '../types';

export const initialAdminProfile: AdminProfile = {
    name: "Admin User",
    companyName: "White Villas Lahore",
    logoUrl: "https://i.imgur.com/gcy8O2D.png", // A sample logo
    contact: "0300-1234567",
    location: "Lahore, Pakistan",
    themeColor: "234 88 12", // Default yellow-500
};

export const mockIncomeCategories: Category[] = [
    { id: 1, name: 'Project Payment' },
    { id: 2, name: 'Consulting Fee' },
    { id: 3, name: 'Asset Sale' },
    { id: 4, name: 'Other' },
];

export const mockExpenseCategories: Category[] = [
    { id: 1, name: 'Salaries' },
    { id: 2, name: 'Commission' },
    { id: 3, name: 'Rent' },
    { id: 4, name: 'Utilities' },
    { id: 5, name: 'Office Supplies' },
    { id: 6, name: 'Marketing' },
    { id: 7, name: 'Travel' },
    { id: 8, name: 'Project Materials' },
    { id: 9, name: 'Construction' },
    { id: 10, name: 'Other' },
];


// FIX: Add 'projectType' and 'constructionType' to each project object to support the Construction Hub feature.
export const mockProjects: Project[] = [
    { id: 1, name: 'Villa Renovation', clientName: 'Mr. Khan', budget: 5000000, startDate: '2023-01-15', status: ProjectStatus.COMPLETED, projectType: 'Construction', constructionType: 'House' },
    { id: 2, name: 'Commercial Plaza Design', clientName: 'Builders Inc.', budget: 2500000, startDate: '2023-03-01', status: ProjectStatus.ONGOING, projectType: 'General' },
    { id: 3, name: 'Landscaping Project', clientName: 'Green Gardens', budget: 1000000, startDate: '2023-05-20', status: ProjectStatus.ONGOING, projectType: 'Construction', constructionType: 'Other' },
    { id: 4, name: 'Apartment Complex Blueprint', clientName: 'Realty Group', budget: 1500000, startDate: '2023-08-01', status: ProjectStatus.PLANNED, projectType: 'General' },
    { id: 5, name: 'Luxury Apartment Finishing', clientName: 'Prestige Homes', budget: 8000000, startDate: '2023-07-10', status: ProjectStatus.ONGOING, projectType: 'Construction', constructionType: 'Apartment' },

];

export const mockStaff: StaffMember[] = [
    { id: 1, name: 'Ahmed Ali', position: 'Project Manager', salary: 150000, joiningDate: '2022-02-01', contact: '0300-1234567', status: StaffStatus.ACTIVE, imageUrl: 'https://i.imgur.com/Q9qFt8x.jpeg', phone: '923001234567' },
    { id: 2, name: 'Fatima Zahra', position: 'Architect', salary: 120000, joiningDate: '2022-05-10', contact: '0321-7654321', status: StaffStatus.ACTIVE, imageUrl: 'https://i.imgur.com/A2szH2Z.jpeg', phone: '923217654321' },
    { id: 3, name: 'Bilal Hassan', position: 'Accountant', salary: 90000, joiningDate: '2022-07-20', contact: '0333-1122334', status: StaffStatus.ACTIVE, imageUrl: 'https://i.imgur.com/o2k7d7v.jpeg', phone: '923331122334' },
    { id: 4, name: 'Sana Javed', position: 'Intern Architect', salary: 40000, joiningDate: '2023-06-01', contact: '0345-5566778', status: StaffStatus.ACTIVE, phone: '923455566778' },
];


const rawTransactions: Omit<Transaction, 'id' | 'balance'>[] = [
    // Project 1
    { date: '2023-01-20', details: 'Initial payment for Villa Renovation', category: 'Project Payment', type: TransactionType.INCOME, amount: 2000000, projectId: 1 },
    { date: '2023-02-05', details: 'Material purchase for Villa Renovation', category: 'Project Materials', type: TransactionType.EXPENSE, amount: 800000, projectId: 1 },
    { date: '2023-03-10', details: 'Labor charges for Villa', category: 'Project Materials', type: TransactionType.EXPENSE, amount: 400000, projectId: 1 },
    { date: '2023-04-15', details: 'Mid-project payment for Villa Renovation', category: 'Project Payment', type: TransactionType.INCOME, amount: 2000000, projectId: 1 },
    { date: '2023-05-25', details: 'Final payment for Villa Renovation', category: 'Project Payment', type: TransactionType.INCOME, amount: 1500000, projectId: 1 },
    { date: '2023-05-20', details: 'Finishing materials for Villa', category: 'Project Materials', type: TransactionType.EXPENSE, amount: 600000, projectId: 1 },
    { date: '2023-05-26', details: 'Completion bonus for Villa project', category: 'Commission', type: TransactionType.EXPENSE, amount: 50000, projectId: 1, staffId: 1 },

    // Project 2
    { date: '2023-03-05', details: 'Advance for Commercial Plaza', category: 'Project Payment', type: TransactionType.INCOME, amount: 1000000, projectId: 2 },
    { date: '2023-04-01', details: 'Software licenses for design', category: 'Office Supplies', type: TransactionType.EXPENSE, amount: 150000, projectId: 2 },
    { date: '2023-05-10', details: 'Site survey expenses', category: 'Travel', type: TransactionType.EXPENSE, amount: 50000, projectId: 2 },

    // Project 3
    { date: '2023-05-22', details: 'Payment for Landscaping project', category: 'Project Payment', type: TransactionType.INCOME, amount: 500000, projectId: 3 },
    
    // Project 5 (New Apartment)
    { date: '2023-07-12', details: 'Initial payment for Apartment Finishing', category: 'Project Payment', type: TransactionType.INCOME, amount: 4000000, projectId: 5 },
    { date: '2023-07-15', details: 'Purchase of tiles and flooring', category: 'Construction', type: TransactionType.EXPENSE, amount: 1200000, projectId: 5 },
    { date: '2023-07-20', details: 'Electrical wiring and fixtures', category: 'Construction', type: TransactionType.EXPENSE, amount: 750000, projectId: 5 },

    // General Expenses
    { date: '2023-01-31', details: 'Salary for Jan 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 150000, staffId: 1 },
    { date: '2023-02-28', details: 'Salary for Feb 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 150000, staffId: 1 },
    { date: '2023-02-28', details: 'Salary for Feb 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 120000, staffId: 2 },
    { date: '2023-03-31', details: 'Salary for Mar 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 150000, staffId: 1 },
    { date: '2023-03-31', details: 'Salary for Mar 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 120000, staffId: 2 },
    { date: '2023-03-31', details: 'Salary for Mar 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 90000, staffId: 3 },
    { date: '2023-04-30', details: 'Salary for Apr 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 150000, staffId: 1 },
    { date: '2023-04-30', details: 'Salary for Apr 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 120000, staffId: 2 },
    { date: '2023-05-31', details: 'Salary for May 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 120000, staffId: 2 },
    { date: '2023-06-30', details: 'Salary for Jun 2023', category: 'Salaries', type: TransactionType.EXPENSE, amount: 40000, staffId: 4 },
    
    { date: '2023-06-01', details: 'Office Rent', category: 'Rent', type: TransactionType.EXPENSE, amount: 100000 },
    { date: '2023-06-05', details: 'Electricity Bill', category: 'Utilities', type: TransactionType.EXPENSE, amount: 25000 },
    { date: '2023-06-10', details: 'Internet Bill', category: 'Utilities', type: TransactionType.EXPENSE, amount: 8000 },
];

// Process transactions to add IDs and calculate running balance
export const mockTransactions: Transaction[] = rawTransactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t, index) => {
        const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        const newBalance = t.type === TransactionType.INCOME ? lastBalance + t.amount : lastBalance - t.amount;
        acc.push({ ...t, id: index + 1, balance: newBalance });
        return acc;
    }, [] as Transaction[]);
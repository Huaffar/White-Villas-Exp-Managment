// FIX: Replaced mock data and circular import with actual type definitions.
export enum TransactionType {
    INCOME = 'Income',
    EXPENSE = 'Expense',
    AMOUNT_OUT = 'Amount Out',
}

export enum StaffStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export enum ProjectStatus {
    PLANNED = 'Planned',
    ONGOING = 'Ongoing',
    COMPLETED = 'Completed',
}

export enum LaborerStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export type SystemLinkType =
    | 'SALARIES'
    | 'COMMISSION'
    | 'PROJECT_PAYMENT'
    | 'CONSTRUCTION_MATERIAL'
    | 'CONSTRUCTION_LABOR'
    | 'HOUSE_EXPENSE'
    | 'OWNER_PAYMENT'
    | 'CLIENT_INVESTMENT';
    
export const SystemLinkMap: Record<SystemLinkType, string> = {
    SALARIES: 'Salary Payments',
    COMMISSION: 'Commission Payments',
    PROJECT_PAYMENT: 'Project Payments',
    CONSTRUCTION_MATERIAL: 'Construction Material Costs',
    CONSTRUCTION_LABOR: 'Construction Labor Costs',
    HOUSE_EXPENSE: 'House Expenses',
    OWNER_PAYMENT: 'Owner/Partner Payments',
    CLIENT_INVESTMENT: 'Client Investments',
};

export interface Transaction {
    id: number;
    date: string;
    details: string;
    category: string;
    type: TransactionType;
    amount: number;
    balance: number;
    projectId?: number;
    staffId?: number;
    laborerId?: number;
    contactId?: number;
}

export interface StaffMember {
    id: number;
    name: string;
    position: string;
    salary: number;
    joiningDate: string;
    contact: string;
    status: StaffStatus;
    phone?: string;
    openingBalance?: number;
    imageUrl?: string;
}

export interface Project {
    id: number;
    name: string;
    clientName: string;
    budget: number;
    startDate: string;
    status: ProjectStatus;
    projectType: 'Construction' | 'General';
    constructionType?: 'House' | 'Apartment' | 'Other';
    contactId?: number;
}

export interface Category {
    id: number;
    name: string;
    type: TransactionType;
    systemLink?: SystemLinkType;
}

export interface Laborer {
    id: number;
    name: string;
    trade: string;
    dailyWage: number;
    contact: string;
    status: LaborerStatus;
}

export interface Contact {
    id: number;
    name: string;
    phone: string;
    type: 'Client' | 'Supplier' | 'Other';
    company?: string;
    email?: string;
}

export interface AdminProfile {
    companyName: string;
    logoUrl: string;
    address: string;
    phone: string;
    taxId: string;
    currencySymbol: string;
    themeColor: string;
    mode: 'light' | 'dark';
}

export type ExpenseCategory = Category;

export interface ClientData {
    contact: Contact;
    totalPaid: number;
    projects: {
        [projectId: number]: {
            project: Project;
            totalPaid: number;
            transactions: Transaction[];
        }
    };
    maintenance: {
        totalPaid: number;
        transactions: Transaction[];
    };
}
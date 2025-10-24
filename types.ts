// FIX: Added full content for types.ts to define data structures for the application.
export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export interface Transaction {
    id: number;
    date: string; // YYYY-MM-DD
    details: string;
    category: string;
    type: TransactionType;
    amount: number;
    balance: number;
    projectId?: number;
    staffId?: number;
}

export interface Category {
    id: number;
    name: string;
}

export enum ProjectStatus {
    PLANNED = 'Planned',
    ONGOING = 'Ongoing',
    COMPLETED = 'Completed',
}

export interface Project {
    id: number;
    name: string;
    clientName: string;
    budget: number;
    startDate: string; // YYYY-MM-DD
    status: ProjectStatus;
}

export enum StaffStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}

export interface StaffMember {
    id: number;
    name: string;
    position: string;
    salary: number;
    joiningDate: string; // YYYY-MM-DD
    contact: string;
    status: StaffStatus;
}

// For reports, etc.
export type IncomeCategory = Category;
export type ExpenseCategory = Category;
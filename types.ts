
export enum TransactionType {
    INCOME = 'Income',
    EXPENSE = 'Expense',
    AMOUNT_OUT = 'Amount Out',
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
    laborerId?: number;
    contactId?: number;
    vendorId?: number;
    paymentMethod?: 'Cash' | 'Bank';
}

export interface Category {
    id: number;
    name: string;
    type: TransactionType | TransactionType.AMOUNT_OUT;
    systemLink?: SystemLinkType;
}

export type SystemLinkType = 'salaries' | 'commission' | 'houseExpense' | 'projectPayment' | 'clientInvestment' | 'constructionMaterial' | 'constructionLabor' | 'vendorPayment';

export const SystemLinkMap: Record<SystemLinkType, string> = {
    salaries: 'Staff Salaries',
    commission: 'Staff Commission',
    houseExpense: 'House Expenses',
    projectPayment: 'Project Payments from Clients',
    clientInvestment: 'Client Investment / Capital',
    constructionMaterial: 'Construction Material Costs',
    constructionLabor: 'Construction Labor Costs',
    vendorPayment: 'Vendor Payments'
};


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
    projectType: 'Construction' | 'General';
    constructionType?: 'House' | 'Apartment' | 'Other';
    contactId?: number;
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
    phone: string; // For WhatsApp, international format e.g. 923001234567
    status: StaffStatus;
    openingBalance?: number;
    imageUrl?: string;
}

export interface Commission {
    id: number;
    staffId: number;
    date: string; // Date earned
    amount: number;
    remarks: string;
    isPaid: boolean;
    paidTransactionId?: number;
}

export enum LaborerStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
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
    company?: string;
    phone: string;
    email?: string;
    type: 'Client' | 'Supplier' | 'Other';
    cnic?: string;
    imageUrl?: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    password?: string;
    role: UserRole;
    contactId?: number; // Link to a contact if role is Client
}

export enum UserRole {
    SUPER_ADMIN = 'Super Admin',
    ADMIN = 'Admin',
    STAFF_ACCOUNTANT = 'Accountant',
    CONSTRUCTION_MANAGER = 'Construction Manager',
    CLIENT = 'Client'
}

// FIX: Added missing Lead-related types.
export type LeadSource = 'Website' | 'Referral' | 'Facebook' | 'Cold Call' | 'Other';

export interface LeadFollowUp {
    id: number;
    date: string; // ISO string
    notes: string;
    userId: number; // ID of the user who made the follow-up
}

export interface Lead {
    id: number;
    name: string;
    company?: string;
    phone: string;
    email?: string;
    statusId: string; // Corresponds to LeadStatus.id
    source: LeadSource;
    assignedToId?: number; // ID of the user it's assigned to
    potentialValue?: number;
    notes?: string;
    createdAt: string; // ISO string
    followUps: LeadFollowUp[];
}

export interface LeadStatus {
    id: string;
    name: string;
    color: string;
}

export interface AdminProfile {
    companyName: string;
    logoUrl?: string;
    stampUrl?: string;
    address?: string;
    phone?: string;
    currencySymbol: string;
    smsSettings: SmsSettings;
    smsTemplates: SmsTemplate[];
    leadStatuses: LeadStatus[];
    themeColor?: string;
}

export interface SmsSettings {
    apiUrl: string;
    apiKey: string;
    smsDemoMode: boolean;
}

export interface SmsTemplate {
    id: string; // e.g., 'salaryPayment', 'clientReceipt'
    name: string;
    content: string;
    placeholders: string[];
    active: boolean;
}

// Construction Hub Types
export interface MaterialCategory {
    id: number;
    name: string;
}

export interface Material {
    id: number;
    name: string;
    categoryId: number;
    unit: string; // e.g., 'bag', 'ton', 'piece'
}

export interface StockMovement {
    id: number;
    date: string;
    materialId: number;
    type: 'in' | 'out';
    quantity: number;
    unitPrice?: number; // Only for 'in'
    vendorId?: number;   // Only for 'in'
    projectId?: number;
}

export interface VendorCategory {
    id: number;
    name: string;
}

export interface Vendor {
    id: number;
    name: string;
    categoryId: number;
    contactPerson?: string;
    phone: string;
    address?: string;
}

// Client Ledger Types
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
    }
}

export type View = 'dashboard' | 'addEntry' | 'clientLedger' | 'staff' | 'staffProfile' | 'labor' | 'laborerProfile' | 'projects' | 'projectDetail' | 'houseExpense' | 'ownerPayments' | 'construction' | 'vendorDetail' | 'reports' | 'clientProfiles' | 'clientDetail' | 'accounts' | 'settings' | 'clientPortal';
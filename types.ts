
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum IncomeCategory {
  CLIENT_PAYMENT = 'Client Payment',
  OTHER_INCOME = 'Other Income',
  PROJECT_ADVANCE = 'Project Advance',
  ASSET_SALE = 'Asset Sale',
}

export enum ExpenseCategory {
  OFFICE = 'Office',
  STAFF_EXPENSE = 'Staff Expense',
  VEHICLE = 'Vehicle',
  CONSTRUCTION = 'Construction',
  SALARY = 'Salary',
  UTILITIES = 'Utilities',
  LABOUR = 'Labour',
  CHARITY = 'Charity',
  MISC = 'Misc',
  BANK_CHARGES = 'Bank Charges',
  MARKETING = 'Marketing',
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
    startDate: string;
    status: ProjectStatus;
}

export interface Transaction {
  id: number;
  date: string;
  details: string;
  type: TransactionType;
  amount: number;
  category: IncomeCategory | ExpenseCategory;
  balance: number;
  staffId?: number;
  projectId?: number;
}

export interface StaffMember {
  id: number;
  name: string;
  designation: string;
  salary: number;
  joiningDate: string;
}

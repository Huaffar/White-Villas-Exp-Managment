
import { Transaction, TransactionType, IncomeCategory, ExpenseCategory, StaffMember, Project, ProjectStatus } from '../types';

let transactionIdCounter = 0;

const rawTransactions: Omit<Transaction, 'balance' | 'id'>[] = [
  { date: '2025-10-01', details: 'Instsar Shukat RNO#716', type: TransactionType.INCOME, amount: 40000, category: IncomeCategory.CLIENT_PAYMENT, projectId: 1 },
  { date: '2025-10-01', details: 'Jutt 4 Marla House Bill', type: TransactionType.INCOME, amount: 10000, category: IncomeCategory.OTHER_INCOME, projectId: 1 },
  { date: '2025-10-01', details: 'Office Expense', type: TransactionType.EXPENSE, amount: 1500, category: ExpenseCategory.OFFICE },
  { date: '2025-10-01', details: 'Ahmad For Exp', type: TransactionType.EXPENSE, amount: 7500, category: ExpenseCategory.STAFF_EXPENSE },
  { date: '2025-10-01', details: 'Vehicle', type: TransactionType.EXPENSE, amount: 2000, category: ExpenseCategory.VEHICLE },
  { date: '2025-10-01', details: 'Construction Exp - 3k Vaibrator, 27k Rat 3 Marla', type: TransactionType.EXPENSE, amount: 30000, category: ExpenseCategory.CONSTRUCTION, projectId: 1 },
  { date: '2025-10-02', details: 'Sheik Tanveer RNO#717-719', type: TransactionType.INCOME, amount: 200000, category: IncomeCategory.CLIENT_PAYMENT, projectId: 2 },
  { date: '2025-10-02', details: 'Office Exp', type: TransactionType.EXPENSE, amount: 200, category: ExpenseCategory.OFFICE },
  { date: '2025-10-02', details: 'Ahmad For Exp', type: TransactionType.EXPENSE, amount: 4900, category: ExpenseCategory.STAFF_EXPENSE },
  { date: '2025-10-02', details: 'Vehicle', type: TransactionType.EXPENSE, amount: 8000, category: ExpenseCategory.VEHICLE },
  { date: '2025-10-02', details: 'Construction Exp - 2400 Bound + Meeti Shabaz 12000', type: TransactionType.EXPENSE, amount: 14400, category: ExpenseCategory.CONSTRUCTION, projectId: 2 },
  { date: '2025-10-02', details: 'Salary for Ahmad', type: TransactionType.EXPENSE, amount: 5000, category: ExpenseCategory.SALARY, staffId: 1 },
  { date: '2025-10-02', details: 'Electricity Bill', type: TransactionType.EXPENSE, amount: 89300, category: ExpenseCategory.UTILITIES },
  { date: '2025-10-03', details: 'AliRaza RNO# 721-724 + Sehar Yar #420', type: TransactionType.INCOME, amount: 165000, category: IncomeCategory.CLIENT_PAYMENT, projectId: 3 },
  { date: '2025-10-03', details: 'Bandara + Jutt House Bill', type: TransactionType.INCOME, amount: 15000, category: IncomeCategory.OTHER_INCOME },
  { date: '2025-10-03', details: 'Ahmad For Exp', type: TransactionType.EXPENSE, amount: 3300, category: ExpenseCategory.STAFF_EXPENSE },
  { date: '2025-10-03', details: 'Vehicle', type: TransactionType.EXPENSE, amount: 3000, category: ExpenseCategory.VEHICLE },
  { date: '2025-10-03', details: 'Labour - Iftkhar', type: TransactionType.EXPENSE, amount: 2500, category: ExpenseCategory.LABOUR, projectId: 3 },
  { date: '2025-10-03', details: 'Charity / Madicen', type: TransactionType.EXPENSE, amount: 2420, category: ExpenseCategory.CHARITY },
];

export const mockTransactions = (): Transaction[] => {
    let runningBalance = 11500; // Previous Month Balance
    return rawTransactions.map(t => {
        if (t.type === TransactionType.INCOME) {
            runningBalance += t.amount;
        } else {
            runningBalance -= t.amount;
        }
        return { ...t, id: ++transactionIdCounter, balance: runningBalance };
    });
};

export const previousMonthBalance = 11500;

export const mockStaff: StaffMember[] = [
    { id: 1, name: 'Ahmad', designation: 'Site Supervisor', salary: 35000, joiningDate: '2024-01-15' },
    { id: 2, name: 'Sajjad Sab', designation: 'Project Manager', salary: 75000, joiningDate: '2023-05-20' },
    { id: 3, name: 'Abdulla', designation: 'Labour', salary: 20000, joiningDate: '2024-03-10' },
    { id: 4, name: 'Haroon', designation: 'Office Assistant', salary: 25000, joiningDate: '2024-02-01' },
    { id: 5, name: 'Murtaza', designation: 'Driver', salary: 22000, joiningDate: '2023-11-05' },
];

export const mockProjects: Project[] = [
    { id: 1, name: '3 Marla House - Bahria', clientName: 'Instsar Shukat', budget: 500000, startDate: '2025-09-15', status: ProjectStatus.ONGOING },
    { id: 2, name: 'Apartment Complex - DHA', clientName: 'Sheik Tanveer', budget: 2500000, startDate: '2025-08-01', status: ProjectStatus.ONGOING },
    { id: 3, name: 'Commercial Plaza - Gulberg', clientName: 'Ali Raza', budget: 1200000, startDate: '2025-10-01', status: ProjectStatus.PLANNED },
];

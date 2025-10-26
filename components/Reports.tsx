import React, { useState } from 'react';
import { Transaction, StaffMember, Category, Project, AdminProfile } from '../types';
import { SystemCategoryNames } from '../App';
import ProfitAndLossStatement from './ProfitAndLossStatement';
import ProjectProfitabilityReport from './ProjectProfitabilityReport';
import StaffPayrollReport from './StaffPayrollReport';
import FullLedgerReport from './FullLedgerReport';

interface ReportsProps {
  projects: Project[];
  transactions: Transaction[];
  staff: StaffMember[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  systemCategoryNames: typeof SystemCategoryNames;
  onEditTransaction: (transaction: Transaction) => void;
  adminProfile: AdminProfile;
}

type ReportType = 'pnl' | 'projects' | 'payroll' | 'ledger' | 'history';

const Reports: React.FC<ReportsProps> = (props) => {
    const [activeReport, setActiveReport] = useState<ReportType>('pnl');

    const getTabClass = (reportName: ReportType) => {
        return `px-4 py-3 text-sm font-bold rounded-lg transition-colors ${activeReport === reportName ? 'primary-bg text-on-accent' : 'text-text-primary bg-background-tertiary hover:bg-background-tertiary-hover'}`;
    };

    const renderReport = () => {
        switch (activeReport) {
            case 'pnl':
                return <ProfitAndLossStatement transactions={props.transactions} />;
            case 'projects':
                return <ProjectProfitabilityReport projects={props.projects} transactions={props.transactions} />;
            case 'payroll':
                return <StaffPayrollReport staff={props.staff} transactions={props.transactions} systemCategoryNames={props.systemCategoryNames} />;
            case 'ledger':
                return <FullLedgerReport transactions={props.transactions} incomeCategories={props.incomeCategories} expenseCategories={props.expenseCategories} onEditTransaction={props.onEditTransaction} adminProfile={props.adminProfile} />;
            case 'history':
                return <FullLedgerReport transactions={props.transactions} incomeCategories={props.incomeCategories} expenseCategories={props.expenseCategories} onEditTransaction={props.onEditTransaction} adminProfile={props.adminProfile} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-accent">Reports</h1>

            <div className="bg-background-secondary p-2 rounded-xl shadow-lg">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setActiveReport('pnl')} className={getTabClass('pnl')}>Profit & Loss</button>
                    <button onClick={() => setActiveReport('projects')} className={getTabClass('projects')}>Project Profitability</button>
                    <button onClick={() => setActiveReport('payroll')} className={getTabClass('payroll')}>Staff Payroll</button>
                    <button onClick={() => setActiveReport('ledger')} className={getTabClass('ledger')}>General Ledger</button>
                    <button onClick={() => setActiveReport('history')} className={getTabClass('history')}>All Transaction History</button>
                </div>
            </div>
            
            <div className="mt-6">
                {renderReport()}
            </div>
        </div>
    );
};

export default Reports;
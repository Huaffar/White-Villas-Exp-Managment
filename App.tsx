// FIX: Added full content for App.tsx to create the main application component.
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import TransactionHistory from './components/TransactionHistory';
import Reports from './components/Reports';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import ProjectFormModal from './components/ProjectFormModal';
import ProjectReport from './components/ProjectReport';
import StaffCashManagement from './components/StaffCashManagement';
import StaffProfile from './components/StaffProfile';
import AddCommissionModal from './components/AddCommissionModal';
import Settings from './components/Settings';
import ImageEditor from './components/ImageEditor';
import TransactionFormModal from './components/TransactionFormModal';
import {
  mockTransactions,
  mockProjects,
  mockStaff,
  mockIncomeCategories,
  mockExpenseCategories,
  initialAdminProfile
} from './data/mockData';
import { Transaction, Project, StaffMember, TransactionType, Category, AdminProfile } from './types';

const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>(mockIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(mockExpenseCategories);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(initialAdminProfile);

  // Sub-view states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [isProjectReportVisible, setIsProjectReportVisible] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

  // UI State
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Transaction editing state
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);


  const handleNavigate = (newView: string) => {
    // Reset sub-views when changing main navigation
    setSelectedProject(null);
    setSelectedStaff(null);
    setIsProjectReportVisible(false);
    setView(newView);
    setMobileMenuOpen(false); // Close mobile menu on navigation
  };
  
  const handleViewStaffProfile = (staffMember: StaffMember) => {
      setSelectedStaff(staffMember);
      setView('staffProfile');
  }
  
  const handleAddOrUpdateTransaction = (transactionData: Omit<Transaction, 'id' | 'balance'> | Transaction) => {
    setTransactions(prevTransactions => {
        let tempTransactions: Transaction[];
        if ('id' in transactionData && transactionData.id !== 0) { // It's an update
            tempTransactions = prevTransactions.map(t => t.id === transactionData.id ? transactionData : t);
        } else { // It's a new one
            const newId = prevTransactions.length > 0 ? Math.max(...prevTransactions.map(t => t.id)) + 1 : 1;
            tempTransactions = [...prevTransactions, { ...transactionData, id: newId, balance: 0 }];
        }
        
        tempTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
        let runningBalance = 0;
        return tempTransactions.map((t) => {
            runningBalance = t.type === TransactionType.INCOME ? runningBalance + t.amount : runningBalance - t.amount;
            return { ...t, balance: runningBalance };
        });
    });

    setTransactionModalOpen(false);
    setEditingTransaction(undefined);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'balance'>) => {
    handleAddOrUpdateTransaction(newTransaction);
    alert('Transaction added successfully!');
     if(newTransaction.category === 'Commission' || newTransaction.category === 'Salaries') {
        // Stay on profile if adding salary/commission
     } else {
        setView('transactions'); // Navigate to transactions list after adding
     }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTransactionModalOpen(true);
  };
  
    const handleAddCommission = (staffMember: StaffMember, amount: number, remarks: string) => {
        const commissionTransaction: Omit<Transaction, 'id' | 'balance'> = {
            date: new Date().toISOString().split('T')[0],
            details: `Commission: ${remarks}`,
            category: 'Commission',
            type: TransactionType.EXPENSE,
            amount,
            staffId: staffMember.id,
        };
        handleAddTransaction(commissionTransaction);
        setIsCommissionModalOpen(false);
    };

  const handleSaveProject = (project: Project) => {
    if (project.id === 0) { // New project
        const newProject = { ...project, id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1 };
        setProjects([...projects, newProject]);
    } else { // Editing existing project
        setProjects(projects.map(p => p.id === project.id ? project : p));
    }
    setIsProjectModalOpen(false);
    setEditingProject(undefined);
  };
  
  const handleSaveStaff = (staffMember: StaffMember) => {
        if (staffMember.id === 0) { // New staff
            const newStaff = { ...staffMember, id: staff.length > 0 ? Math.max(...staff.map(p => p.id)) + 1 : 1 };
            setStaff([...staff, newStaff]);
        } else { // Editing
            setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
        }
    };
  
  const handleUpdateAdminProfile = (profile: AdminProfile) => {
    setAdminProfile(profile);
  };

  const handleExportData = () => {
    const headers = ["ID", "Date", "Details", "Category", "Type", "Amount", "Balance", "ProjectID", "StaffID"];
    const rows = transactions.map(t => [t.id, t.date, `"${t.details.replace(/"/g, '""')}"`, t.category, t.type, t.amount, t.balance, t.projectId || '', t.staffId || ''].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearData = () => {
     setTransactions([]);
     alert("All transaction data has been cleared.");
  };

  const getTitleForView = (view: string): string => {
    if (selectedProject) return `Project: ${selectedProject.name}`;
    if (view === 'staffProfile' && selectedStaff) return `Staff: ${selectedStaff.name}`;
    switch(view) {
        case 'dashboard': return 'Dashboard';
        case 'addTransaction': return 'Add New Transaction';
        case 'transactions': return 'Transaction History';
        case 'reports': return 'Financial Reports';
        case 'projects': return 'Projects Overview';
        case 'staff': return 'Staff Management';
        case 'settings': return 'Application Settings';
        case 'imageEditor': return 'AI Image Editor';
        default: return 'Accounting Pro';
    }
  }


  const renderContent = () => {
    if (isProjectReportVisible && selectedProject) {
        return <ProjectReport project={selectedProject} transactions={transactions.filter(t => t.projectId === selectedProject.id)} onClose={() => setIsProjectReportVisible(false)} />;
    }
    if (view === 'staffProfile' && selectedStaff) {
        return <StaffProfile 
                    staffMember={selectedStaff} 
                    transactions={transactions} 
                    onBack={() => handleNavigate('staff')}
                    onAddCommission={() => setIsCommissionModalOpen(true)}
                />;
    }
    if (selectedProject) {
        return <ProjectDetail project={selectedProject} transactions={transactions} onBack={() => setSelectedProject(null)} onGenerateReport={() => setIsProjectReportVisible(true)} />;
    }

    switch (view) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'addTransaction':
        return <AddTransaction onAddTransaction={handleAddTransaction} projects={projects} staff={staff} incomeCategories={incomeCategories} expenseCategories={expenseCategories} />;
      case 'transactions':
        return <TransactionHistory transactions={transactions} incomeCategories={incomeCategories} expenseCategories={expenseCategories} onEditTransaction={handleEditTransaction} />;
      case 'reports':
        return <Reports transactions={transactions} staff={staff} />;
      case 'projects':
        return <Projects 
          projects={projects} 
          transactions={transactions} 
          onViewProject={setSelectedProject}
          onEditProject={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }}
          onAddProject={() => { setEditingProject(undefined); setIsProjectModalOpen(true); }}
        />;
      case 'staff':
        return <StaffCashManagement staff={staff} transactions={transactions} onSaveStaff={handleSaveStaff} onAddTransaction={handleAddTransaction} onViewProfile={handleViewStaffProfile} adminProfile={adminProfile} />;
      case 'settings':
        return <Settings 
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
          setIncomeCategories={setIncomeCategories}
          setExpenseCategories={setExpenseCategories}
          adminProfile={adminProfile}
          updateAdminProfile={handleUpdateAdminProfile}
          exportData={handleExportData}
          clearData={handleClearData}
        />;
      case 'imageEditor': 
        return <ImageEditor />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <Sidebar 
        currentView={view} 
        onNavigate={handleNavigate} 
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        adminProfile={adminProfile}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitleForView(view)} onMenuClick={() => setMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
      {isProjectModalOpen && (
        <ProjectFormModal 
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
      {isCommissionModalOpen && selectedStaff && (
        <AddCommissionModal
            staffMember={selectedStaff}
            onAdd={handleAddCommission}
            onClose={() => setIsCommissionModalOpen(false)}
        />
      )}
      {isTransactionModalOpen && (
        <TransactionFormModal
            transactionToEdit={editingTransaction}
            onSave={handleAddOrUpdateTransaction}
            onClose={() => { setEditingTransaction(undefined); setTransactionModalOpen(false); }}
            projects={projects}
            staff={staff}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
        />
      )}
    </div>
  );
};

export default App;

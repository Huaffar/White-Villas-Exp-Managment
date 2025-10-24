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
import {
  mockTransactions,
  mockProjects,
  mockStaff,
  mockIncomeCategories,
  mockExpenseCategories,
} from './data/mockData';
import { Transaction, Project, StaffMember, TransactionType, Category } from './types';

const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>(mockIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(mockExpenseCategories);

  // Sub-view states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [isProjectReportVisible, setIsProjectReportVisible] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);


  const handleNavigate = (newView: string) => {
    // Reset sub-views when changing main navigation
    setSelectedProject(null);
    setSelectedStaff(null);
    setIsProjectReportVisible(false);
    setView(newView);
  };
  
  const handleViewStaffProfile = (staffMember: StaffMember) => {
      setSelectedStaff(staffMember);
      setView('staffProfile');
  }

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'balance'>) => {
    setTransactions(prevTransactions => {
      const tempTransactions = [...prevTransactions, { ...newTransaction, id: Date.now(), balance: 0 }]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Recalculate all balances
      let runningBalance = 0;
      return tempTransactions.map((t) => {
          runningBalance = t.type === TransactionType.INCOME ? runningBalance + t.amount : runningBalance - t.amount;
          return { ...t, balance: runningBalance };
      });
    });
    alert('Transaction added successfully!');
     if(newTransaction.category === 'Commission' || newTransaction.category === 'Salaries') {
        // Stay on profile if adding salary/commission
     } else {
        setView('transactions'); // Navigate to transactions list after adding
     }
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
        return <TransactionHistory transactions={transactions} incomeCategories={incomeCategories} expenseCategories={expenseCategories} />;
      case 'reports':
        return <Reports transactions={transactions} />;
      case 'projects':
        return <Projects 
          projects={projects} 
          transactions={transactions} 
          onViewProject={setSelectedProject}
          onEditProject={(p) => { setEditingProject(p); setIsProjectModalOpen(true); }}
          onAddProject={() => { setEditingProject(undefined); setIsProjectModalOpen(true); }}
        />;
      case 'staff':
        return <StaffCashManagement staff={staff} transactions={transactions} onAddTransaction={handleAddTransaction} onViewProfile={handleViewStaffProfile} />;
      case 'settings':
        return <Settings 
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
          setIncomeCategories={setIncomeCategories}
          setExpenseCategories={setExpenseCategories}
        />;
      case 'imageEditor': 
        return <ImageEditor />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <Sidebar currentView={view} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-8">
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
    </div>
  );
};

export default App;
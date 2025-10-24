
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionsTable from './components/TransactionsTable';
import AddTransaction from './components/AddTransaction';
import { Transaction, TransactionType, Project, StaffMember, Category, AdminProfile } from './types';
import { mockTransactions, mockProjects, mockStaff, mockIncomeCategories, mockExpenseCategories, initialAdminProfile } from './data/mockData';
import TransactionHistory from './components/TransactionHistory';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import ProjectFormModal from './components/ProjectFormModal';
import StaffCashManagement from './components/StaffCashManagement';
import StaffProfile from './components/StaffProfile';
import AddCommissionModal from './components/AddCommissionModal';
import TransactionFormModal from './components/TransactionFormModal';
import ProjectReport from './components/ProjectReport';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ExpenseHub from './components/ExpenseHub';
import ConstructionHub from './components/ConstructionHub';

type Page = 'dashboard' | 'add-transaction' | 'history' | 'projects' | 'project-detail' | 'staff' | 'staff-profile' | 'reports' | 'settings' | 'expense-hub' | 'construction-hub';

const App: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    const [adminProfile, setAdminProfile] = useState<AdminProfile>(initialAdminProfile);

    // For detail pages
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

    // For modals
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);
    const [isCommissionModalOpen, setCommissionModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [projectForReport, setProjectForReport] = useState<Project | null>(null);

    // Load data from localStorage or use mock data
    useEffect(() => {
        try {
            const storedTransactions = localStorage.getItem('transactions');
            const storedProjects = localStorage.getItem('projects');
            const storedStaff = localStorage.getItem('staff');
            const storedIncomeCategories = localStorage.getItem('incomeCategories');
            const storedExpenseCategories = localStorage.getItem('expenseCategories');
            const storedAdminProfile = localStorage.getItem('adminProfile');

            setTransactions(storedTransactions ? JSON.parse(storedTransactions) : mockTransactions);
            setProjects(storedProjects ? JSON.parse(storedProjects) : mockProjects);
            setStaff(storedStaff ? JSON.parse(storedStaff) : mockStaff);
            setIncomeCategories(storedIncomeCategories ? JSON.parse(storedIncomeCategories) : mockIncomeCategories);
            setExpenseCategories(storedExpenseCategories ? JSON.parse(storedExpenseCategories) : mockExpenseCategories);
            setAdminProfile(storedAdminProfile ? JSON.parse(storedAdminProfile) : initialAdminProfile);
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            // Fallback to mock data if parsing fails
            setTransactions(mockTransactions);
            setProjects(mockProjects);
            setStaff(mockStaff);
            setIncomeCategories(mockIncomeCategories);
            setExpenseCategories(mockExpenseCategories);
            setAdminProfile(initialAdminProfile);
        }
    }, []);

    const saveData = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    };

    // Save data to localStorage whenever it changes
    useEffect(() => { saveData('transactions', transactions) }, [transactions]);
    useEffect(() => { saveData('projects', projects) }, [projects]);
    useEffect(() => { saveData('staff', staff) }, [staff]);
    useEffect(() => { saveData('incomeCategories', incomeCategories) }, [incomeCategories]);
    useEffect(() => { saveData('expenseCategories', expenseCategories) }, [expenseCategories]);
    useEffect(() => { saveData('adminProfile', adminProfile) }, [adminProfile]);

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', adminProfile.themeColor);
    }, [adminProfile.themeColor]);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        setSidebarOpen(false);
    };

    const processTransactions = (newTransactions: (Omit<Transaction, 'id' | 'balance'> | Transaction)[]) => {
         return newTransactions
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .reduce((acc, t, index) => {
                const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
                const newBalance = t.type === TransactionType.INCOME ? lastBalance + t.amount : lastBalance - t.amount;
                // 'id' in t checks if it's an existing transaction
                const id = 'id' in t ? t.id : (transactions.length > 0 ? Math.max(...transactions.map(tr => tr.id)) + 1 : 1);
                acc.push({ ...t, id, balance: newBalance });
                return acc;
            }, [] as Transaction[]);
    }

    const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'balance'>) => {
        setTransactions(prev => processTransactions([...prev, transactionData]));
        alert('Transaction added successfully!');
        handleNavigate('history');
    };
    
    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'balance'> | Transaction) => {
        let updatedTransactions;
        if ('id' in transactionData) { // Editing existing
            updatedTransactions = transactions.map(t => t.id === transactionData.id ? transactionData : t);
        } else { // Adding new
            updatedTransactions = [...transactions, transactionData];
        }
        setTransactions(processTransactions(updatedTransactions));
        setTransactionModalOpen(false);
        setEditingTransaction(undefined);
    }
    
    const handleSaveProject = (project: Project) => {
        if (project.id === 0) { // New project
            const newProject = { ...project, id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1 };
            setProjects([...projects, newProject]);
        } else { // Editing
            setProjects(projects.map(p => p.id === project.id ? project : p));
        }
        setProjectModalOpen(false);
    };

    const handleSaveStaff = (staffMember: StaffMember) => {
        if (staffMember.id === 0) { // New staff
            const newStaff = { ...staffMember, id: staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1 };
            setStaff([...staff, newStaff]);
        } else { // Editing
            setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
        }
    };
    
    const handleDeleteStaff = (staffMember: StaffMember) => {
        if (window.confirm(`Are you sure you want to delete ${staffMember.name}? This cannot be undone.`)) {
            setStaff(staff.filter(s => s.id !== staffMember.id));
        }
    }

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
        setCommissionModalOpen(false);
    };
    
    const exportData = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "id,date,details,category,type,amount,balance,projectId,staffId\n"
            + transactions.map(t => Object.values(t).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const clearData = () => {
        setTransactions([]);
    }

    const pageTitles: { [key in Page]: string } = {
        'dashboard': 'Dashboard',
        'add-transaction': 'Add Transaction',
        'history': 'Transaction History',
        'projects': 'Projects',
        'project-detail': `Project: ${selectedProject?.name || ''}`,
        'staff': 'Staff Management',
        'staff-profile': `Staff: ${selectedStaff?.name || ''}`,
        'reports': 'Reports',
        'settings': 'Settings',
        'expense-hub': 'Expense Hub',
        'construction-hub': 'Construction Hub',
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <Dashboard transactions={transactions} />;
            case 'add-transaction': return <AddTransaction onAddTransaction={handleAddTransaction} projects={projects} staff={staff} incomeCategories={incomeCategories} expenseCategories={expenseCategories} />;
            case 'history': return <TransactionHistory transactions={transactions} incomeCategories={incomeCategories} expenseCategories={expenseCategories} onEditTransaction={(t) => {setEditingTransaction(t); setTransactionModalOpen(true);}} />;
            case 'projects': return <Projects projects={projects} transactions={transactions} onViewProject={(p) => { setSelectedProject(p); handleNavigate('project-detail'); }} onEditProject={(p) => { setEditingProject(p); setProjectModalOpen(true); }} onAddProject={() => { setEditingProject(undefined); setProjectModalOpen(true); }} />;
            case 'project-detail':
                if (!selectedProject) return <div>Project not found.</div>
                return <ProjectDetail project={selectedProject} transactions={transactions.filter(t => t.projectId === selectedProject.id)} onBack={() => handleNavigate('projects')} onGenerateReport={(p) => setProjectForReport(p)} />;
            case 'staff': return <StaffCashManagement staff={staff} transactions={transactions} onSaveStaff={handleSaveStaff} onAddTransaction={handleAddTransaction} onViewProfile={(s) => {setSelectedStaff(s); handleNavigate('staff-profile')}} onDeleteStaff={handleDeleteStaff} adminProfile={adminProfile} />;
            case 'staff-profile':
                if (!selectedStaff) return <div>Staff member not found.</div>
                return <StaffProfile staffMember={selectedStaff} transactions={transactions} onBack={() => handleNavigate('staff')} onAddCommission={() => setCommissionModalOpen(true)} />;
            case 'reports': return <Reports transactions={transactions} staff={staff} />;
            case 'settings': return <Settings incomeCategories={incomeCategories} expenseCategories={expenseCategories} setIncomeCategories={setIncomeCategories} setExpenseCategories={setExpenseCategories} adminProfile={adminProfile} updateAdminProfile={setAdminProfile} exportData={exportData} clearData={clearData} />;
            case 'expense-hub': return <ExpenseHub transactions={transactions} />;
            case 'construction-hub': return <ConstructionHub projects={projects} transactions={transactions} />;
            default: return <Dashboard transactions={transactions} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigate} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={pageTitles[currentPage]} onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
            {isProjectModalOpen && <ProjectFormModal project={editingProject} onSave={handleSaveProject} onClose={() => setProjectModalOpen(false)} />}
            {isCommissionModalOpen && selectedStaff && <AddCommissionModal staffMember={selectedStaff} onAdd={handleAddCommission} onClose={() => setCommissionModalOpen(false)} />}
            {isTransactionModalOpen && <TransactionFormModal onSave={handleSaveTransaction} onClose={() => setTransactionModalOpen(false)} transactionToEdit={editingTransaction} projects={projects} staff={staff} incomeCategories={incomeCategories} expenseCategories={expenseCategories} />}
            {projectForReport && <ProjectReport project={projectForReport} transactions={transactions.filter(t => t.projectId === projectForReport.id)} onClose={() => setProjectForReport(null)} />}
        </div>
    );
};

export default App;

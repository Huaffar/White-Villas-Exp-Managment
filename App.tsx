import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddEntry from './components/AddEntry';
import TransactionHistory from './components/TransactionHistory';
import StaffCashManagement from './components/StaffCashManagement';
import LaborManagement from './components/LaborManagement';
import Projects from './components/Projects';
import Reports from './components/Reports';
import Settings from './components/Settings';
import { mockTransactions, mockStaff, mockProjects, mockIncomeCategories, mockExpenseCategories, mockLaborers, mockContacts, mockAdminProfile, mockAmountOutCategories } from './data/mockData';
import { Transaction, StaffMember, Project, Category, TransactionType, Laborer, Contact, AdminProfile, SystemLinkType } from './types';
import StaffProfile from './components/StaffProfile';
import AddCommissionModal from './components/AddCommissionModal';
import ConfirmationModal from './components/ConfirmationModal';
import ProjectDetail from './components/ProjectDetail';
import ProjectReport from './components/ProjectReport';
import ProjectFormModal from './components/ProjectFormModal';
import LaborerProfile from './components/LaborerProfile';
import TransactionFormModal from './components/TransactionFormModal';
import ConstructionHub from './components/ConstructionHub';
import Contacts from './components/Contacts';
import AccountManagement from './components/AccountManagement';
import HouseExpense from './components/HouseExpense';
import HouseExpenseReport from './components/HouseExpenseReport';
import OwnerPayments from './components/OwnerPayments';
import ClientLedger from './components/ClientLedger';

type View = 
    | 'dashboard' | 'addEntry' | 'history' | 'staff' | 'staffProfile'
    | 'labor' | 'laborProfile' | 'projects' | 'projectDetail' | 'construction' 
    | 'reports' | 'contacts' | 'accounts' | 'settings' | 'houseExpense'
    | 'ownerPayments' | 'clientLedger';

export type SystemCategoryNames = {
    salaries: string;
    commission: string;
    projectPayment: string;
    constructionMaterial: string;
    constructionLabor: string;
    houseExpense: string;
    ownerPayment: string;
    clientInvestment: string;
};


const App: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState<View>('addEntry');
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
    const [laborers, setLaborers] = useState<Laborer[]>(mockLaborers);
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const [incomeCategories, setIncomeCategories] = useState<Category[]>(mockIncomeCategories);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>(mockExpenseCategories);
    const [amountOutCategories, setAmountOutCategories] = useState<Category[]>(mockAmountOutCategories);
    const [contacts, setContacts] = useState<Contact[]>(mockContacts);
    const [adminProfile, setAdminProfile] = useState<AdminProfile>(mockAdminProfile);

    // For modals and detailed views
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedLaborer, setSelectedLaborer] = useState<Laborer | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const [isCommissionModalOpen, setCommissionModalOpen] = useState(false);
    const [isProjectReportVisible, setProjectReportVisible] = useState(false);
    const [isProjectFormModalOpen, setProjectFormModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

    const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const getCategoryNameByLink = (link: SystemLinkType): string => {
        const allCategories = [...incomeCategories, ...expenseCategories, ...amountOutCategories];
        const category = allCategories.find(c => c.systemLink === link);
        // Fallback to a sensible default if not linked, though this shouldn't happen with good data.
        if (!category) {
            console.warn(`System link "${link}" is not assigned to any category.`);
            const fallbackMap: Record<SystemLinkType, string> = {
                SALARIES: 'Salaries',
                COMMISSION: 'Commission',
                PROJECT_PAYMENT: 'Project Payment',
                CONSTRUCTION_MATERIAL: 'Construction Material',
                CONSTRUCTION_LABOR: 'Construction Labor',
                HOUSE_EXPENSE: 'House Expense',
                OWNER_PAYMENT: 'Owner/Partner Payments',
                CLIENT_INVESTMENT: 'Client Investment',
            };
            return fallbackMap[link];
        }
        return category.name;
    };

    const systemCategoryNames: SystemCategoryNames = {
        salaries: getCategoryNameByLink('SALARIES'),
        commission: getCategoryNameByLink('COMMISSION'),
        projectPayment: getCategoryNameByLink('PROJECT_PAYMENT'),
        constructionMaterial: getCategoryNameByLink('CONSTRUCTION_MATERIAL'),
        constructionLabor: getCategoryNameByLink('CONSTRUCTION_LABOR'),
        houseExpense: getCategoryNameByLink('HOUSE_EXPENSE'),
        ownerPayment: getCategoryNameByLink('OWNER_PAYMENT'),
        clientInvestment: getCategoryNameByLink('CLIENT_INVESTMENT'),
    };

    useEffect(() => {
        if (adminProfile.themeColor) {
            document.documentElement.style.setProperty('--primary-color', adminProfile.themeColor);
        }
    }, [adminProfile.themeColor]);

    useEffect(() => {
        const body = document.body;
        if (adminProfile.mode === 'dark') {
            body.classList.add('dark', 'bg-gray-900');
            body.classList.remove('bg-gray-100');
        } else {
            body.classList.remove('dark', 'bg-gray-900');
            body.classList.add('bg-gray-100');
        }
    }, [adminProfile.mode]);


    const recalculateBalances = (transactions: Transaction[]): Transaction[] => {
        let balance = 0;
        return transactions
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id)
            .map(t => {
                if (t.type === TransactionType.INCOME) {
                    balance += t.amount;
                } else { // Handles EXPENSE and AMOUNT_OUT
                    balance -= t.amount;
                }
                return { ...t, balance };
            });
    };

    const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'balance'>) => {
        setTransactions(prev => {
            const nextId = Math.max(...prev.map(t => t.id), 0) + 1;
            return recalculateBalances([...prev, { ...newTransaction, id: nextId, balance: 0 }]);
        });
    };

    const handleSaveStaff = (staffMember: StaffMember) => {
        setStaff(prev => {
            if (staffMember.id === 0) { // New staff
                const nextId = Math.max(...prev.map(s => s.id), 0) + 1;
                return [...prev, { ...staffMember, id: nextId }];
            }
            return prev.map(s => s.id === staffMember.id ? staffMember : s);
        });
    };
    
    const handleDeleteStaff = () => {
        if (staffToDelete) {
            setStaff(prev => prev.filter(s => s.id !== staffToDelete.id));
            setStaffToDelete(null);
        }
    };
    
    const handleSaveProject = (project: Project) => {
        setProjects(prev => {
            if (project.id === 0) { // New project
                const nextId = Math.max(...prev.map(p => p.id), 0) + 1;
                return [...prev, { ...project, id: nextId }];
            }
            return prev.map(p => p.id === project.id ? project : p);
        });
        setProjectFormModalOpen(false);
        setEditingProject(undefined);
    };

    const handleDeleteProject = () => {
        if (projectToDelete) {
            setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
            setTransactions(prev => recalculateBalances(prev.filter(t => t.projectId !== projectToDelete.id)));
            setProjectToDelete(null);
        }
    };

    const handleSaveLaborer = (laborer: Laborer) => {
        setLaborers(prev => {
            if (laborer.id === 0) {
                 const nextId = Math.max(...prev.map(l => l.id), 0) + 1;
                return [...prev, { ...laborer, id: nextId }];
            }
            return prev.map(l => l.id === laborer.id ? laborer : l);
        });
    }

    const handleDeleteLaborer = (laborer: Laborer) => {
        setLaborers(prev => prev.filter(l => l.id !== laborer.id));
    }
    
    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
    }
    
    const handleSaveTransaction = (transaction: Transaction) => {
        setTransactions(prev => recalculateBalances(prev.map(t => t.id === transaction.id ? transaction : t)));
        setEditingTransaction(null);
    }

    const handleSaveCategory = (updatedCategory: Category) => {
        let newIncome = [...incomeCategories];
        let newExpense = [...expenseCategories];

        // 1. Unlink any other category using the same link
        if (updatedCategory.systemLink) {
            const unlink = (c: Category) => (c.systemLink === updatedCategory.systemLink && c.id !== updatedCategory.id) ? { ...c, systemLink: undefined } : c;
            newIncome = newIncome.map(unlink);
            newExpense = newExpense.map(unlink);
        }

        // 2. Find which list the original category was in
        const originalIncomeIndex = newIncome.findIndex(c => c.id === updatedCategory.id);
        const originalExpenseIndex = newExpense.findIndex(c => c.id === updatedCategory.id);

        if (originalIncomeIndex > -1) {
            const originalCategory = newIncome[originalIncomeIndex];
            if (originalCategory.type === updatedCategory.type) {
                // Just update in income list
                newIncome[originalIncomeIndex] = updatedCategory;
            } else {
                // Move from income to expense
                newIncome.splice(originalIncomeIndex, 1);
                newExpense.push(updatedCategory);
            }
        } else if (originalExpenseIndex > -1) {
            const originalCategory = newExpense[originalExpenseIndex];
            if (originalCategory.type === updatedCategory.type) {
                // Just update in expense list
                newExpense[originalExpenseIndex] = updatedCategory;
            } else {
                // Move from expense to income
                newExpense.splice(originalExpenseIndex, 1);
                newIncome.push(updatedCategory);
            }
        }
        
        setIncomeCategories(newIncome.sort((a, b) => a.name.localeCompare(b.name)));
        setExpenseCategories(newExpense.sort((a, b) => a.name.localeCompare(b.name)));
    };
    
    const handleAddCategory = (cat: Omit<Category, 'id'>) => {
        const newCat = {...cat, id: Date.now()};
        
        let newIncome = [...incomeCategories];
        let newExpense = [...expenseCategories];

        // If assigning a new link, unlink the old category
        if (newCat.systemLink) {
            const unlink = (c: Category) => (c.systemLink === newCat.systemLink) ? { ...c, systemLink: undefined } : c;
            newIncome = newIncome.map(unlink);
            newExpense = newExpense.map(unlink);
        }

        if (newCat.type === TransactionType.INCOME) {
            newIncome.push(newCat);
        } else {
            newExpense.push(newCat);
        }

        setIncomeCategories(newIncome.sort((a, b) => a.name.localeCompare(b.name)));
        setExpenseCategories(newExpense.sort((a, b) => a.name.localeCompare(b.name)));
    };

    const titles: Record<View, string> = {
        dashboard: 'Dashboard',
        addEntry: 'Add New Entry',
        history: 'Transaction History',
        staff: 'Staff Management',
        staffProfile: selectedStaff?.name || 'Staff Profile',
        labor: 'Labor Management',
        laborProfile: selectedLaborer?.name || 'Laborer Profile',
        projects: 'Projects Overview',
        projectDetail: selectedProject?.name || 'Project Details',
        construction: 'Construction Hub',
        reports: 'Reports',
        contacts: 'Contacts',
        accounts: 'Account Management',
        settings: 'Settings',
        houseExpense: 'House Expense',
        ownerPayments: 'Owner & Partner Payments',
        clientLedger: 'Client Ledger',
    };

    const renderView = () => {
        switch (view) {
            case 'dashboard': return <Dashboard transactions={transactions} />;
            case 'addEntry': return <AddEntry onAddTransaction={handleAddTransaction} projects={projects} staff={staff} laborers={laborers} incomeCategories={incomeCategories} expenseCategories={expenseCategories} transactions={transactions} contacts={contacts} systemCategoryNames={systemCategoryNames} />;
            case 'history': return <TransactionHistory transactions={transactions} incomeCategories={incomeCategories} expenseCategories={expenseCategories} onEditTransaction={handleEditTransaction} adminProfile={adminProfile} />;
            case 'staff': return <StaffCashManagement staff={staff} transactions={transactions} onSaveStaff={handleSaveStaff} onAddTransaction={handleAddTransaction} onViewProfile={(s) => { setSelectedStaff(s); setView('staffProfile'); }} onDeleteStaff={(s) => setStaffToDelete(s)} adminProfile={adminProfile} systemCategoryNames={systemCategoryNames} />;
            case 'staffProfile': return selectedStaff && <StaffProfile staffMember={selectedStaff} transactions={transactions} onBack={() => setView('staff')} onAddCommission={() => setCommissionModalOpen(true)} systemCategoryNames={systemCategoryNames} adminProfile={adminProfile} />;
            case 'labor': return <LaborManagement laborers={laborers} projects={projects} transactions={transactions} onSaveLaborer={handleSaveLaborer} onDeleteLaborer={handleDeleteLaborer} onAddTransaction={handleAddTransaction} onViewProfile={(l) => { setSelectedLaborer(l); setView('laborProfile'); }} systemCategoryNames={systemCategoryNames} />;
            case 'laborProfile': return selectedLaborer && <LaborerProfile laborer={selectedLaborer} transactions={transactions} projects={projects} onBack={() => setView('labor')} />;
            case 'projects': return <Projects projects={projects} transactions={transactions} onViewProject={(p) => { setSelectedProject(p); setView('projectDetail'); }} onEditProject={(p) => { setEditingProject(p); setProjectFormModalOpen(true); }} onAddProject={() => { setEditingProject(undefined); setProjectFormModalOpen(true); }} onDeleteProject={(p) => setProjectToDelete(p)} onGenerateReport={(p) => { setSelectedProject(p); setProjectReportVisible(true); }} />;
            case 'projectDetail': return selectedProject && <ProjectDetail project={selectedProject} transactions={transactions.filter(t => t.projectId === selectedProject.id)} onBack={() => setView('projects')} onGenerateReport={() => setProjectReportVisible(true)} />;
            case 'construction': return <ConstructionHub projects={projects} transactions={transactions} />;
            case 'reports': return <Reports transactions={transactions} staff={staff} incomeCategories={incomeCategories} expenseCategories={expenseCategories} systemCategoryNames={systemCategoryNames} />;
            case 'contacts': return <Contacts contacts={contacts} onSaveContact={(c) => setContacts(prev => prev.map(p => p.id === c.id ? c : p))} onAddContact={(c) => setContacts(prev => [...prev, {...c, id: Date.now()}])} onDeleteContact={(c) => setContacts(prev => prev.filter(p => p.id !== c.id))} />;
            case 'accounts': return <AccountManagement incomeCategories={incomeCategories} expenseCategories={expenseCategories} onSaveCategory={handleSaveCategory} onAddCategory={handleAddCategory} onDeleteCategory={(cat) => { if(cat.type === TransactionType.INCOME) { setIncomeCategories(prev => prev.filter(c => c.id !== cat.id)) } else { setExpenseCategories(prev => prev.filter(c => c.id !== cat.id)) } }} />;
            case 'settings': return <Settings profile={adminProfile} onSave={setAdminProfile} />;
            case 'houseExpense': return <HouseExpense transactions={transactions} adminProfile={adminProfile} systemCategoryNames={systemCategoryNames} />;
            case 'ownerPayments': return <OwnerPayments transactions={transactions} categories={amountOutCategories} onAddTransaction={handleAddTransaction} />;
            case 'clientLedger': return <ClientLedger transactions={transactions} projects={projects} contacts={contacts} systemCategoryNames={systemCategoryNames} adminProfile={adminProfile} />;
            default: return <Dashboard transactions={transactions} />;
        }
    };
    
    return (
        <div className="flex h-screen text-gray-800 dark:text-gray-200">
            <Sidebar currentView={view} setView={setView} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex flex-col flex-1">
                <Header title={titles[view]} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>

            {isCommissionModalOpen && selectedStaff && (
                <AddCommissionModal 
                    staffMember={selectedStaff}
                    onAdd={(staffMember, amount, remarks) => {
                        handleAddTransaction({
                            date: new Date().toISOString().split('T')[0],
                            details: `Commission: ${remarks}`,
                            category: systemCategoryNames.commission,
                            type: TransactionType.EXPENSE,
                            amount,
                            staffId: staffMember.id,
                        });
                        setCommissionModalOpen(false);
                    }}
                    onClose={() => setCommissionModalOpen(false)}
                />
            )}

            {staffToDelete && (
                <ConfirmationModal 
                    title="Delete Staff Member"
                    message={`Are you sure you want to delete ${staffToDelete.name}? This action cannot be undone.`}
                    onConfirm={handleDeleteStaff}
                    onCancel={() => setStaffToDelete(null)}
                />
            )}

            {projectToDelete && (
                <ConfirmationModal 
                    title="Delete Project"
                    message={`Are you sure you want to delete the project "${projectToDelete.name}"? All associated transactions will also be deleted. This action cannot be undone.`}
                    onConfirm={handleDeleteProject}
                    onCancel={() => setProjectToDelete(null)}
                />
            )}

            {isProjectReportVisible && selectedProject && (
                <ProjectReport project={selectedProject} transactions={transactions.filter(t => t.projectId === selectedProject.id)} onClose={() => setProjectReportVisible(false)} />
            )}

            {isProjectFormModalOpen && (
                <ProjectFormModal project={editingProject} onSave={handleSaveProject} onClose={() => setProjectFormModalOpen(false)} contacts={contacts} />
            )}
            
            {editingTransaction && (
                <TransactionFormModal
                    transaction={editingTransaction}
                    onSave={handleSaveTransaction}
                    onClose={() => setEditingTransaction(null)}
                    projects={projects}
                    staff={staff}
                    laborers={laborers}
                    categories={[...incomeCategories, ...expenseCategories]}
                    systemCategoryNames={systemCategoryNames}
                />
            )}
        </div>
    );
};

export default App;
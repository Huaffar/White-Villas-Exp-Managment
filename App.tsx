import React, { useState, useMemo, useEffect } from 'react';
import { View, Transaction, Project, StaffMember, Laborer, Contact, User, AdminProfile, Category, Material, MaterialCategory, StockMovement, Vendor, VendorCategory, SystemLinkType, SystemLinkMap, TransactionType, Commission } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import appMockData from './data/appMockData';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddEntry from './components/AddEntry';
import StaffCashManagement from './components/StaffCashManagement';
import StaffProfile from './components/StaffProfile';
import AddCommissionModal from './components/AddCommissionModal';
import LaborManagement from './components/LaborManagement';
import LaborerProfile from './components/LaborerProfile';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import ProjectReport from './components/ProjectReport';
import ProjectFormModal from './components/ProjectFormModal';
import HouseExpense from './components/HouseExpense';
import OwnerPayments from './components/OwnerPayments';
import ClientLedger from './components/ClientLedger';
import Reports from './components/Reports';
import ClientProfiles from './components/Contacts';
import ClientProfileDetail from './components/LeadsManagement';
import ClientFormModal from './components/ContactFormModal';
import AccountManagement from './components/AccountManagement';
import Settings from './components/Settings';
import ClientPortal from './components/ClientPortal';
import ConstructionHub from './components/ConstructionHub';
import VendorDetail from './components/VendorDetail';
import TransactionFormModal from './components/TransactionFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast, { ToastProps } from './components/Toast';
import { Theme } from './components/ThemeSwitcherModal';

export const SystemCategoryNames: Record<SystemLinkType, string> = SystemLinkMap;

export const themes: Theme[] = [
    {
      name: 'Default Dark',
      colors: {
        '--primary-color-rgb': '234 88 12',
        '--background-primary': '#111827',
        '--background-secondary': '#1F2937',
        '--background-tertiary': '#374151',
        '--background-tertiary-hover': '#4B5563',
        '--background-input': '#111827',
        '--border-primary': '#374151',
        '--border-secondary': '#4B5563',
        '--text-primary': '#D1D5DB',
        '--text-secondary': '#9CA3AF',
        '--text-strong': '#F9FAFB',
        '--text-on-accent': '#111827',
      }
    },
    {
      name: 'Midnight Blue',
      colors: {
        '--primary-color-rgb': '34 211 238',
        '--background-primary': '#0d1b2a',
        '--background-secondary': '#1b263b',
        '--background-tertiary': '#415a77',
        '--background-tertiary-hover': '#526f91',
        '--background-input': '#0d1b2a',
        '--border-primary': '#415a77',
        '--border-secondary': '#526f91',
        '--text-primary': '#e0e1dd',
        '--text-secondary': '#778da9',
        '--text-strong': '#ffffff',
        '--text-on-accent': '#0d1b2a',
      }
    },
    {
      name: 'Forest Green',
      colors: {
        '--primary-color-rgb': '163 230 53',
        '--background-primary': '#1a2e24',
        '--background-secondary': '#223d31',
        '--background-tertiary': '#3d6e56',
        '--background-tertiary-hover': '#4a896b',
        '--background-input': '#1a2e24',
        '--border-primary': '#3d6e56',
        '--border-secondary': '#4a896b',
        '--text-primary': '#d1e0d9',
        '--text-secondary': '#829d90',
        '--text-strong': '#ffffff',
        '--text-on-accent': '#1a2e24',
      }
    },
    {
      name: 'Crimson Night',
      colors: {
          '--primary-color-rgb': '244 63 94',
          '--background-primary': '#212121',
          '--background-secondary': '#333333',
          '--background-tertiary': '#4F4F4F',
          '--background-tertiary-hover': '#626262',
          '--background-input': '#212121',
          '--border-primary': '#4F4F4F',
          '--border-secondary': '#626262',
          '--text-primary': '#E0E0E0',
          '--text-secondary': '#BDBDBD',
          '--text-strong': '#FFFFFF',
          '--text-on-accent': '#FFFFFF',
      }
    },
];

const App: React.FC = () => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', appMockData.transactions);
    const [incomeCategories, setIncomeCategories] = useLocalStorage<Category[]>('incomeCategories', appMockData.incomeCategories);
    const [expenseCategories, setExpenseCategories] = useLocalStorage<Category[]>('expenseCategories', appMockData.expenseCategories);
    const [ownerCategories, setOwnerCategories] = useLocalStorage<Category[]>('ownerCategories', appMockData.ownerCategories);
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', appMockData.projects);
    const [staff, setStaff] = useLocalStorage<StaffMember[]>('staff', appMockData.staff);
    const [commissions, setCommissions] = useLocalStorage<Commission[]>('commissions', appMockData.commissions);
    const [laborers, setLaborers] = useLocalStorage<Laborer[]>('laborers', appMockData.laborers);
    const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', appMockData.contacts);
    const [users, setUsers] = useLocalStorage<User[]>('users', appMockData.users);
    const [adminProfile, setAdminProfile] = useLocalStorage<AdminProfile>('adminProfile', appMockData.adminProfile);
    const [materials, setMaterials] = useLocalStorage<Material[]>('materials', appMockData.materials);
    const [materialCategories, setMaterialCategories] = useLocalStorage<MaterialCategory[]>('materialCategories', appMockData.materialCategories);
    const [stockMovements, setStockMovements] = useLocalStorage<StockMovement[]>('stockMovements', appMockData.stockMovements);
    const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', appMockData.vendors);
    const [vendorCategories, setVendorCategories] = useLocalStorage<VendorCategory[]>('vendorCategories', appMockData.vendorCategories);
    
    const [activeThemeName, setActiveThemeName] = useLocalStorage<string>('activeThemeName', 'Midnight Blue');

    const adminUser = appMockData.users.find(u => u.username === 'admin') || null;
    const [loggedInUser, setLoggedInUser] = useLocalStorage<User | null>('loggedInUser', adminUser);
    const [currentView, setCurrentView] = useState<View>('addEntry');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [selectedLaborer, setSelectedLaborer] = useState<Laborer | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedClient, setSelectedClient] = useState<Contact | null>(null);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [editingClient, setEditingClient] = useState<Contact | undefined>(undefined);
    const [projectForReport, setProjectForReport] = useState<Project | null>(null);
    const [isCommissionModalOpen, setCommissionModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'staff' | 'laborer' | 'project' | 'contact' | 'category' | 'user'; data: any } | null>(null);
    const [toasts, setToasts] = useState<Omit<ToastProps, 'onDismiss'>[]>([]);

    useEffect(() => {
        const theme = themes.find(t => t.name === activeThemeName) || themes[0];
        Object.entries(theme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }, [activeThemeName]);


    const showToast = (message: string, type: ToastProps['type']) => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    };
    
    const dismissToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleLogin = (user: User) => {
        setLoggedInUser(user);
        if (user.role === 'Client') {
            setCurrentView('clientPortal');
        } else {
            setCurrentView('dashboard');
        }
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    // FIX: Changed parameter type to Omit<Transaction, 'id' | 'balance'> to match the data passed from handleAddTransaction.
    const calculateNewBalance = (newTransaction: Omit<Transaction, 'id' | 'balance'>): number => {
        const lastTransaction = transactions[transactions.length - 1];
        const lastBalance = lastTransaction ? lastTransaction.balance : 0;
        const amountChange = newTransaction.type === 'Income' ? newTransaction.amount : -newTransaction.amount;
        return lastBalance + amountChange;
    };
    
    const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id' | 'balance'>) => {
        const balance = calculateNewBalance(newTransactionData);
        const newTransaction: Transaction = {
            id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
            ...newTransactionData,
            balance,
        };
        setTransactions([...transactions, newTransaction].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    };
    
    const handleSaveTransaction = (updatedTransaction: Transaction) => {
        // Recalculating whole ledger on edit is complex. For now, just update the item.
        setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
        setEditingTransaction(null);
        showToast('Transaction updated!', 'info');
    };
    
    const handleAddCommission = (commissionData: Omit<Commission, 'id' | 'isPaid' | 'paidTransactionId'>) => {
        const newCommission: Commission = {
            id: commissions.length > 0 ? Math.max(...commissions.map(c => c.id)) + 1 : 1,
            ...commissionData,
            isPaid: false,
        };
        setCommissions([...commissions, newCommission]);
        showToast('Commission added as due.', 'success');
    };

    const handlePayCommission = (staffId: number, commissionIds: number[], paymentData: { date: string, remarks: string, totalAmount: number }) => {
        const newTransactionId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        const newExpenseTransaction: Omit<Transaction, 'id' | 'balance'> = {
            date: paymentData.date,
            details: paymentData.remarks,
            category: SystemCategoryNames.commission,
            type: TransactionType.EXPENSE,
            amount: paymentData.totalAmount,
            staffId: staffId,
        };
        handleAddTransaction(newExpenseTransaction);

        setCommissions(prevCommissions => 
            prevCommissions.map(c => 
                commissionIds.includes(c.id) 
                ? { ...c, isPaid: true, paidTransactionId: newTransactionId } 
                : c
            )
        );
        showToast('Commission paid and recorded as expense.', 'success');
    };


    const handleAddStock = (data: Omit<StockMovement, 'id' | 'type'>) => {
        const newStockMovement: StockMovement = {
            ...data,
            id: stockMovements.length > 0 ? Math.max(...stockMovements.map(sm => sm.id)) + 1 : 1,
            type: 'in'
        };
        setStockMovements(prev => [...prev, newStockMovement]);
    
        const totalCost = (data.unitPrice || 0) * data.quantity;
        if (data.vendorId && totalCost > 0) {
            const vendor = vendors.find(v => v.id === data.vendorId);
            const material = materials.find(m => m.id === data.materialId);
            const details = `Purchase: ${data.quantity} x ${material?.name || 'material'} from ${vendor?.name || 'vendor'}`;
    
            const newExpenseTransaction: Omit<Transaction, 'id' | 'balance'> = {
                date: data.date,
                details: details,
                category: SystemCategoryNames.vendorPayment,
                type: TransactionType.EXPENSE,
                amount: totalCost,
                vendorId: data.vendorId,
                projectId: data.projectId,
            };
            
            handleAddTransaction(newExpenseTransaction);
            showToast('Stock purchase added to inventory and ledger.', 'success');
        } else {
            showToast('Stock movement recorded (no cost transaction).', 'info');
        }
    };

    const handleIssueStock = (data: Omit<StockMovement, 'id' | 'type' | 'unitPrice' | 'vendorId'>) => {
        // 1. Add the stock movement record
        const newStockMovement: StockMovement = {
            ...data,
            id: stockMovements.length > 0 ? Math.max(...stockMovements.map(sm => sm.id)) + 1 : 1,
            type: 'out'
        };
        setStockMovements(prev => [...prev, newStockMovement]);

        // 2. Find the latest purchase price for this material to calculate its cost
        const latestPurchase = [...stockMovements]
            .filter(m => m.type === 'in' && m.materialId === data.materialId && m.unitPrice != null)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const unitPrice = latestPurchase?.unitPrice;

        // 3. If a price is found, create and add a corresponding expense transaction
        if (unitPrice != null && unitPrice > 0 && data.projectId) {
            const totalCost = data.quantity * unitPrice;
            const material = materials.find(m => m.id === data.materialId);
            const materialName = material ? material.name : 'Unknown Material';

            const newExpenseTransaction: Omit<Transaction, 'id' | 'balance'> = {
                date: data.date,
                details: `Stock Issued: ${data.quantity} x ${materialName}`,
                category: SystemCategoryNames.constructionMaterial, // Using the system-linked category
                type: TransactionType.EXPENSE,
                amount: totalCost,
                projectId: data.projectId,
            };
            
            handleAddTransaction(newExpenseTransaction);
            showToast(`Expense of ${adminProfile.currencySymbol} ${totalCost.toLocaleString()} added to project.`, 'success');
        } else if (!unitPrice || unitPrice <= 0) {
            showToast('Stock issued, but expense not recorded: Unit price for this material is unknown. Please add a purchase record for it first.', 'info');
        }
    };


    const handleSaveStaff = (staffMember: StaffMember) => {
        if (staffMember.id === 0) { // New staff
            const newStaff = { ...staffMember, id: staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1 };
            setStaff([...staff, newStaff]);
            showToast('Staff member added!', 'success');
        } else { // Existing staff
            setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
            showToast('Staff member updated!', 'info');
        }
    };
    
    const handleSaveLaborer = (laborer: Laborer) => {
        if (laborer.id === 0) {
            setLaborers([...laborers, { ...laborer, id: laborers.length > 0 ? Math.max(...laborers.map(l => l.id)) + 1 : 1 }]);
        } else {
            setLaborers(laborers.map(l => l.id === laborer.id ? laborer : l));
        }
    };

    const handleSaveProject = (project: Project) => {
        if (project.id === 0) {
            setProjects([...projects, { ...project, id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1 }]);
        } else {
            setProjects(projects.map(p => p.id === project.id ? project : p));
        }
        setEditingProject(undefined);
    };

    const handleSaveContact = (contact: Contact) => {
        if (contact.id === 0) {
            setContacts([...contacts, { ...contact, id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1 }]);
        } else {
            setContacts(contacts.map(c => c.id === contact.id ? contact : c));
        }
    };

    const handleSaveCategory = (category: Category) => {
        const listToUpdate = category.type === 'Income' ? incomeCategories : expenseCategories;
        const setList = category.type === 'Income' ? setIncomeCategories : setExpenseCategories;
        setList(listToUpdate.map(c => c.id === category.id ? category : c));
    };

    const handleAddCategory = (category: Omit<Category, 'id'>) => {
        const listToUpdate = category.type === 'Income' ? incomeCategories : expenseCategories;
        const setList = category.type === 'Income' ? setIncomeCategories : setExpenseCategories;
        const newId = Math.max(...[...incomeCategories, ...expenseCategories].map(c => c.id), 0) + 1;
        setList([...listToUpdate, { ...category, id: newId }]);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        const { type, data } = itemToDelete;
        // Basic check for dependencies. A real app would need more robust checks.
        switch(type) {
            case 'staff':
                if(transactions.some(t => t.staffId === data.id)) {
                    alert('Cannot delete staff member with existing transactions.');
                } else {
                    setStaff(staff.filter(s => s.id !== data.id));
                }
                break;
            case 'laborer':
                if(transactions.some(t => t.laborerId === data.id)) {
                    alert('Cannot delete laborer with existing transactions.');
                } else {
                    setLaborers(laborers.filter(l => l.id !== data.id));
                }
                break;
            case 'project':
                 if(transactions.some(t => t.projectId === data.id)) {
                    alert('Cannot delete project with existing transactions.');
                } else {
                    setProjects(projects.filter(p => p.id !== data.id));
                }
                break;
            case 'contact':
                // ... dependency check
                setContacts(contacts.filter(c => c.id !== data.id));
                break;
            case 'user':
                 if(data.role === 'Super Admin') {
                    alert('Cannot delete Super Admin.');
                } else {
                    setUsers(users.filter(u => u.id !== data.id));
                }
                break;
        }
        setItemToDelete(null);
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard transactions={transactions} themes={themes} activeThemeName={activeThemeName} onSetTheme={setActiveThemeName} />;
            case 'addEntry': return <AddEntry onAddTransaction={(t) => { handleAddTransaction(t); showToast('Transaction added successfully!', 'success'); }} onAddStock={handleAddStock} projects={projects} staff={staff} laborers={laborers} incomeCategories={incomeCategories} expenseCategories={expenseCategories} transactions={transactions} contacts={contacts} systemCategoryNames={SystemCategoryNames} materials={materials} vendors={vendors} />;
            case 'clientLedger': return <ClientLedger transactions={transactions} projects={projects} contacts={contacts} systemCategoryNames={SystemCategoryNames} adminProfile={adminProfile} />;
            case 'staff': return <StaffCashManagement staff={staff} transactions={transactions} commissions={commissions} onSaveStaff={handleSaveStaff} onPaySalary={(t) => { handleAddTransaction(t); showToast('Salary paid successfully!', 'success'); }} onPayCommission={handlePayCommission} onViewProfile={(s) => { setSelectedStaff(s); setCurrentView('staffProfile'); }} onDeleteStaff={(s) => setItemToDelete({type: 'staff', data: s})} adminProfile={adminProfile} systemCategoryNames={SystemCategoryNames} />;
            case 'staffProfile': return selectedStaff && <StaffProfile staffMember={selectedStaff} transactions={transactions} commissions={commissions} onBack={() => { setSelectedStaff(null); setCurrentView('staff'); }} onAddCommission={() => setCommissionModalOpen(true)} onPaySalary={(t) => { handleAddTransaction(t); showToast('Salary paid successfully!', 'success'); }} onPayCommission={handlePayCommission} systemCategoryNames={SystemCategoryNames} adminProfile={adminProfile} />;
            case 'labor': return <LaborManagement laborers={laborers} projects={projects} transactions={transactions} onSaveLaborer={handleSaveLaborer} onDeleteLaborer={(l) => setItemToDelete({type: 'laborer', data: l})} onAddTransaction={(t) => { handleAddTransaction(t); showToast('Transaction added successfully!', 'success'); }} onViewProfile={(l) => { setSelectedLaborer(l); setCurrentView('laborerProfile'); }} systemCategoryNames={SystemCategoryNames} />;
            case 'laborerProfile': return selectedLaborer && <LaborerProfile laborer={selectedLaborer} transactions={transactions} projects={projects} onBack={() => { setSelectedLaborer(null); setCurrentView('labor'); }} />;
            case 'projects': return <Projects projects={projects} transactions={transactions} onViewProject={(p) => { setSelectedProject(p); setCurrentView('projectDetail'); }} onEditProject={setEditingProject} onAddProject={() => setEditingProject({} as Project)} onDeleteProject={(p) => setItemToDelete({type: 'project', data: p})} onGenerateReport={setProjectForReport} />;
            case 'projectDetail': return selectedProject && <ProjectDetail project={selectedProject} transactions={transactions} contacts={contacts} adminProfile={adminProfile} onBack={() => { setSelectedProject(null); setCurrentView('projects'); }} onGenerateReport={setProjectForReport} systemCategoryNames={SystemCategoryNames} />;
            case 'houseExpense': return <HouseExpense transactions={transactions} adminProfile={adminProfile} systemCategoryNames={SystemCategoryNames} />;
            case 'ownerPayments': return <OwnerPayments transactions={transactions} categories={ownerCategories} onAddTransaction={(t) => { handleAddTransaction(t); showToast('Transaction added successfully!', 'success'); }} />;
            case 'construction': return <ConstructionHub materials={materials} materialCategories={materialCategories} stockMovements={stockMovements} vendors={vendors} vendorCategories={vendorCategories} projects={projects} onAddStock={handleAddStock} onIssueStock={handleIssueStock} onSaveMaterial={(m) => setMaterials(m.id === 0 ? [...materials, {...m, id: Date.now()}] : materials.map(i => i.id === m.id ? m : i))} onSaveMaterialCategory={(c) => setMaterialCategories(c.id === 0 ? [...materialCategories, {...c, id: Date.now()}] : materialCategories.map(i => i.id === c.id ? c : i))} onSaveVendor={(v) => setVendors(v.id === 0 ? [...vendors, {...v, id: Date.now()}] : vendors.map(i => i.id === v.id ? v : i))} onSaveVendorCategory={(c) => setVendorCategories(c.id === 0 ? [...vendorCategories, {...c, id: Date.now()}] : vendorCategories.map(i => i.id === c.id ? c : i))} onViewVendor={(v) => { setSelectedVendor(v); setCurrentView('vendorDetail'); }} />;
            case 'vendorDetail': return selectedVendor && <VendorDetail vendor={selectedVendor} materials={materials} stockMovements={stockMovements} adminProfile={adminProfile} onBack={() => { setSelectedVendor(null); setCurrentView('construction'); }} />;
            case 'reports': return <Reports projects={projects} transactions={transactions} staff={staff} incomeCategories={incomeCategories} expenseCategories={expenseCategories} systemCategoryNames={SystemCategoryNames} onEditTransaction={setEditingTransaction} adminProfile={adminProfile} />;
            case 'clientProfiles': return <ClientProfiles contacts={contacts} onViewClient={(c) => { setSelectedClient(c); setCurrentView('clientDetail'); }} onAddClient={() => setEditingClient({} as Contact)} onEditClient={setEditingClient} onDeleteClient={(c) => setItemToDelete({type: 'contact', data: c})} />;
            case 'clientDetail': return selectedClient && <ClientProfileDetail client={selectedClient} projects={projects} onBack={() => { setSelectedClient(null); setCurrentView('clientProfiles'); }} />;
            case 'accounts': return <AccountManagement incomeCategories={incomeCategories} expenseCategories={expenseCategories} onSaveCategory={handleSaveCategory} onAddCategory={handleAddCategory} onDeleteCategory={(c) => setItemToDelete({type: 'category', data: c})} />;
            case 'settings': return <Settings profile={adminProfile} users={users} contacts={contacts} onSaveProfile={setAdminProfile} onSaveUser={(u) => setUsers(u.id === 0 ? [...users, {...u, id: Date.now()}] : users.map(i => i.id === u.id ? u : i))} onDeleteUser={(u) => setItemToDelete({type: 'user', data: u})} showToast={showToast} />;
            case 'clientPortal': return loggedInUser?.contactId ? <ClientPortal transactions={transactions} projects={projects} clientContact={contacts.find(c => c.id === loggedInUser.contactId)!} adminProfile={adminProfile} systemCategoryNames={SystemCategoryNames} /> : <div>Error: No client contact linked.</div>;
            default: return <div>Not implemented</div>;
        }
    };
    
    const viewTitles: Record<View, string> = {
        dashboard: 'Dashboard', addEntry: 'Add Entry', clientLedger: 'Client Ledger', staff: 'Staff Management', staffProfile: selectedStaff?.name || 'Staff Profile', labor: 'Labor Management', laborerProfile: selectedLaborer?.name || 'Laborer Profile', projects: 'Projects', projectDetail: selectedProject?.name || 'Project Details', houseExpense: 'House Expenses', ownerPayments: 'Owner Payments', construction: 'Construction Hub', vendorDetail: selectedVendor?.name || 'Vendor Details', reports: 'Reports', clientProfiles: 'Client Profiles', clientDetail: selectedClient?.name || 'Client Profile', accounts: 'Account Management', settings: 'Settings', clientPortal: 'Client Portal'
    };

    if (!loggedInUser) {
        return <Login onLogin={handleLogin} users={users} />;
    }

    return (
        <div className="flex h-screen bg-background-primary text-text-primary">
            <Sidebar currentView={currentView} onSetView={(v) => { setSelectedStaff(null); setSelectedLaborer(null); setSelectedProject(null); setSelectedClient(null); setCurrentView(v); }} user={loggedInUser} companyName={adminProfile.companyName} logoUrl={adminProfile.logoUrl} isSidebarOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={viewTitles[currentView]} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} user={loggedInUser} onLogout={handleLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-primary p-8">
                    {renderView()}
                </main>
            </div>
            {editingProject && <ProjectFormModal project={editingProject.id ? editingProject : undefined} onSave={handleSaveProject} onClose={() => setEditingProject(undefined)} contacts={contacts} />}
            {editingClient && <ClientFormModal contact={editingClient.id ? editingClient : undefined} onSave={(c) => { handleSaveContact(c); setEditingClient(undefined); }} onClose={() => setEditingClient(undefined)} />}
            {projectForReport && <ProjectReport project={projectForReport} transactions={transactions.filter(t => t.projectId === projectForReport.id)} onClose={() => setProjectForReport(null)} systemCategoryNames={SystemCategoryNames} adminProfile={adminProfile} />}
            {isCommissionModalOpen && selectedStaff && <AddCommissionModal staffMember={selectedStaff} onClose={() => setCommissionModalOpen(false)} onAdd={(staff, amount, remarks) => { handleAddCommission({ staffId: staff.id, date: new Date().toISOString().split('T')[0], amount, remarks }); setCommissionModalOpen(false); }} />}
            {editingTransaction && <TransactionFormModal transaction={editingTransaction} onSave={handleSaveTransaction} onClose={() => setEditingTransaction(null)} projects={projects} staff={staff} laborers={laborers} categories={[...incomeCategories, ...expenseCategories]} systemCategoryNames={SystemCategoryNames} />}
            {itemToDelete && <ConfirmationModal title={`Delete ${itemToDelete.type}`} message={`Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`} onConfirm={handleDelete} onCancel={() => setItemToDelete(null)} />}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(toast => <Toast key={toast.id} {...toast} onDismiss={dismissToast} />)}
            </div>
        </div>
    );
};

export default App;
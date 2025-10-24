import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ImageEditor from './components/ImageEditor';
import Sidebar from './components/Sidebar';
import AddTransaction from './components/AddTransaction';
import Reports from './components/Reports';
import CategoryReports from './components/CategoryReports';
import StaffManagement from './components/StaffCashManagement';
import StaffProfile from './components/StaffProfile';
import Projects from './components/Projects';
import Invoice from './components/Invoice';
import PaySalaryModal from './components/PaySalaryModal';
import StaffFormModal from './components/StaffFormModal';
import StaffReport from './components/StaffReport';
import Settings from './components/Settings';

import { mockTransactions, previousMonthBalance, mockStaff, mockProjects } from './data/mockData';
import { Transaction, TransactionType, StaffMember, ExpenseCategory, Project } from './types';

function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions());
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // State for Staff Management workflow
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [staffToPay, setStaffToPay] = useState<StaffMember | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [staffForReport, setStaffForReport] = useState<StaffMember | null>(null);
  const [invoiceToPrint, setInvoiceToPrint] = useState<Transaction | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);


  const handleAddTransaction = (newTransaction: Omit<Transaction, 'balance' | 'id'>) => {
      const updatedTransactions = [...transactions, { ...newTransaction, id: Date.now(), balance: 0 }]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let runningBalance = previousMonthBalance;
      const finalTransactions = updatedTransactions.map(t => {
          if (t.type === TransactionType.INCOME) {
              runningBalance += t.amount;
          } else {
              runningBalance -= t.amount;
          }
          return { ...t, balance: runningBalance };
      });
      
      setTransactions(finalTransactions);
  };

  const handleSaveStaff = (staffMember: StaffMember) => {
    const exists = staff.some(s => s.id === staffMember.id);
    if (exists) {
      setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
    } else {
      setStaff([...staff, { ...staffMember, id: Date.now() }]);
    }
    setStaffToEdit(null); // Close modal
  };
  
  const handlePaySalary = (staffMember: StaffMember, amount: number, remarks: string) => {
    const salaryTransaction: Omit<Transaction, 'balance' | 'id'> = {
      date: new Date().toISOString().split('T')[0],
      details: `Salary: ${staffMember.name}` + (remarks ? ` (${remarks})` : ''),
      type: TransactionType.EXPENSE,
      amount: amount,
      category: ExpenseCategory.SALARY,
      staffId: staffMember.id,
    };
    handleAddTransaction(salaryTransaction);
    setStaffToPay(null); // Close modal
  };

  const handleSaveProject = (project: Project) => {
    const exists = projects.some(p => p.id === project.id);
    if (exists) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
    } else {
      setProjects([...projects, { ...project, id: Date.now() }]);
    }
  };


  const { savedExpenseDetails, cashInHand } = useMemo(() => {
    const expenseDetails = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .map(t => t.details);
    
    const balance = transactions.length > 0 ? transactions[transactions.length - 1].balance : previousMonthBalance;

    return {
        savedExpenseDetails: [...new Set(expenseDetails)],
        cashInHand: balance
    };
  }, [transactions]);

  const pageTitle = selectedStaff ? `${selectedStaff.name}'s Profile` : activePage;

  const renderPage = () => {
    if (selectedStaff) {
        return <StaffProfile 
            staffMember={selectedStaff} 
            transactions={transactions.filter(t => t.staffId === selectedStaff.id)}
            onBack={() => setSelectedStaff(null)}
            onPrintInvoice={setInvoiceToPrint}
            onEditProfile={() => setStaffToEdit(selectedStaff)}
            onGenerateReport={() => setStaffForReport(selectedStaff)}
        />
    }

    switch (activePage) {
      case 'Dashboard':
        return <Dashboard transactions={transactions} />;
      case 'Add Transaction':
        return <AddTransaction onAddTransaction={handleAddTransaction} savedExpenseDetails={savedExpenseDetails} projects={projects} />;
      case 'Reports':
        return <Reports transactions={transactions} />;
      case 'Category Reports':
        return <CategoryReports transactions={transactions} />;
      case 'Staff Management':
        return <StaffManagement 
                    staff={staff} 
                    cashInHand={cashInHand} 
                    onPaySalary={(staffMember) => setStaffToPay(staffMember)}
                    onAddStaff={() => setStaffToEdit({} as StaffMember)} // Open modal with empty object
                    onViewProfile={setSelectedStaff}
                />;
      case 'Projects':
        return <Projects 
                    projects={projects}
                    transactions={transactions}
                    onSaveProject={handleSaveProject}
                />;
      case 'AI Image Editor':
        return <ImageEditor />;
      case 'Settings':
        return <Settings 
                    theme={theme}
                    setTheme={setTheme}
                    onNavigate={setActivePage}
                />;
      default:
        return <Dashboard transactions={transactions} />;
    }
  };

  const lastPayment = staffToPay ? transactions
    .filter(t => t.staffId === staffToPay.id)
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Header pageTitle={pageTitle} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Modals and Printables */}
      {staffToPay && (
          <PaySalaryModal
            staffMember={staffToPay}
            lastPayment={lastPayment}
            onPay={handlePaySalary}
            onClose={() => setStaffToPay(null)}
          />
      )}
       {staffToEdit && (
          <StaffFormModal
            staffMember={staffToEdit.id ? staffToEdit : undefined} // Pass undefined for new staff
            onSave={handleSaveStaff}
            onClose={() => setStaffToEdit(null)}
          />
      )}
      {invoiceToPrint && selectedStaff && (
        <Invoice 
            transaction={invoiceToPrint} 
            staffMember={selectedStaff} 
            onClose={() => setInvoiceToPrint(null)} 
        />
      )}
      {staffForReport && (
        <StaffReport
          staffMember={staffForReport}
          transactions={transactions.filter(t => t.staffId === staffForReport.id)}
          onClose={() => setStaffForReport(null)}
        />
      )}
      
      <footer className="fixed bottom-0 right-0 p-2 text-gray-600 text-xs no-print">
        <p>&copy; {new Date().getFullYear()} White Villas Accounting Pro.</p>
      </footer>
    </div>
  );
}

export default App;
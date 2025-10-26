import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types.
import { Transaction, TransactionType } from '../types';
import StatCard from './StatCard';
import { BalanceIcon, IncomeIcon, ExpenseIcon, ProfitIcon, AdjustmentsHorizontalIcon, PaintBrushIcon } from './IconComponents';
import IncomeExpenseChart from './IncomeExpenseChart';
import DashboardHistoryCard from './DashboardHistoryCard';
import DashboardLineChart from './DashboardLineChart';
import DashboardLayoutModal from './DashboardLayoutModal';
import ThemeSwitcherModal, { Theme } from './ThemeSwitcherModal';
import useLocalStorage from '../hooks/useLocalStorage';


interface DashboardProps {
  transactions: Transaction[];
  themes: Theme[];
  activeThemeName: string;
  onSetTheme: (themeName: string) => void;
}

export interface DashboardWidget {
  id: 'incomeExpense' | 'incomeTrend' | 'expenseTrend' | 'ownerPayment' | 'recentIncome' | 'recentExpenses';
  name: string;
  isVisible: boolean;
  size: 1 | 2;
}

const defaultWidgets: DashboardWidget[] = [
    { id: 'incomeExpense', name: 'Income vs Expense Chart', isVisible: true, size: 2 },
    { id: 'incomeTrend', name: 'Income Trend Chart', isVisible: true, size: 1 },
    { id: 'expenseTrend', name: 'Expense Trend Chart', isVisible: true, size: 1 },
    { id: 'ownerPayment', name: 'Owner Payments Chart', isVisible: true, size: 1 },
    { id: 'recentIncome', name: 'Recent Income', isVisible: true, size: 1 },
    { id: 'recentExpenses', name: 'Recent Expenses', isVisible: true, size: 1 },
];


const Dashboard: React.FC<DashboardProps> = ({ transactions, themes, activeThemeName, onSetTheme }) => {
  const [isLayoutModalOpen, setLayoutModalOpen] = useState(true);
  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  
  const [widgets, setWidgets] = useLocalStorage<DashboardWidget[]>('dashboardWidgetsConfig', defaultWidgets);

  const handleSaveLayout = (newWidgets: DashboardWidget[]) => {
      setWidgets(newWidgets);
  };
  
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalAmountOut = transactions
    .filter(t => t.type === TransactionType.AMOUNT_OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = transactions.length > 0 ? transactions.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].balance : 0;
  const profit = totalIncome - totalExpense - totalAmountOut;

  const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const amountOutTransactions = transactions.filter(t => t.type === TransactionType.AMOUNT_OUT);
  
  const componentMap: Record<DashboardWidget['id'], React.ReactNode> = {
    incomeExpense: <IncomeExpenseChart data={transactions} />,
    incomeTrend: <DashboardLineChart transactions={incomeTransactions} title="Income" dataKey="income" color="#48BB78" />,
    expenseTrend: <DashboardLineChart transactions={expenseTransactions} title="Expense" dataKey="expense" color="#F56565" />,
    ownerPayment: <DashboardLineChart transactions={amountOutTransactions} title="Owner Payments" dataKey="expense" color="#FBBF24" />,
    recentIncome: <DashboardHistoryCard title="Recent Income" transactions={incomeTransactions} type={TransactionType.INCOME} />,
    recentExpenses: <DashboardHistoryCard title="Recent Expenses" transactions={expenseTransactions} type={TransactionType.EXPENSE} />,
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-accent">Dashboard</h1>
          <div className="flex items-center gap-2">
            <button
                onClick={() => setThemeModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-background-tertiary text-text-strong font-semibold text-sm rounded-lg hover:bg-background-tertiary-hover transition-colors"
            >
                <PaintBrushIcon className="w-5 h-5" />
                Switch Theme
            </button>
            <button
                onClick={() => setLayoutModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-background-tertiary text-text-strong font-semibold text-sm rounded-lg hover:bg-background-tertiary-hover transition-colors"
            >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                Customize Layout
            </button>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Balance" 
          value={`PKR ${balance.toLocaleString()}`}
          icon={<BalanceIcon className="h-8 w-8 text-blue-400" />}
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Total Income" 
          value={`PKR ${totalIncome.toLocaleString()}`}
          icon={<IncomeIcon className="h-8 w-8 text-green-400" />}
          colorClass="bg-green-500"
        />
        <StatCard 
          title="Total Expense" 
          value={`PKR ${totalExpense.toLocaleString()}`}
          icon={<ExpenseIcon className="h-8 w-8 text-red-400" />}
          colorClass="bg-red-500"
        />
        <StatCard 
          title="Net Profit" 
          value={`PKR ${profit.toLocaleString()}`}
          icon={<ProfitIcon className="h-8 w-8 text-purple-400" />}
          colorClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {widgets.filter(w => w.isVisible).map(widget => (
          <div key={widget.id} className={`lg:col-span-${widget.size}`}>
            {componentMap[widget.id]}
          </div>
        ))}
      </div>

      {isLayoutModalOpen && (
        <DashboardLayoutModal
          widgets={widgets}
          onSave={handleSaveLayout}
          onClose={() => setLayoutModalOpen(false)}
        />
      )}

      {isThemeModalOpen && (
        <ThemeSwitcherModal
            themes={themes}
            activeThemeName={activeThemeName}
            onSetTheme={onSetTheme}
            onClose={() => setThemeModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
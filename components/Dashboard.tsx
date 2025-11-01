import React, { useState, useMemo, useEffect } from 'react';
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
import ExpensePieChart from './ExpensePieChart';


interface DashboardProps {
  transactions: Transaction[];
  themes: Theme[];
  activeThemeName: string;
  onSetTheme: (themeName: string) => void;
}

export interface DashboardWidget {
  id: 'incomeExpense' | 'incomeTrend' | 'expenseTrend' | 'ownerPayment' | 'recentIncome' | 'recentExpenses' | 'expenseBreakdown';
  name: string;
  isVisible: boolean;
  size: 1 | 2;
}

const defaultWidgets: DashboardWidget[] = [
    { id: 'incomeExpense', name: 'Income vs Expense Chart', isVisible: true, size: 2 },
    { id: 'incomeTrend', name: 'Income Trend Chart', isVisible: true, size: 1 },
    { id: 'expenseTrend', name: 'Expense Trend Chart', isVisible: true, size: 1 },
    { id: 'expenseBreakdown', name: 'Expense Breakdown', isVisible: true, size: 1 },
    { id: 'ownerPayment', name: 'Owner Payments Chart', isVisible: true, size: 1 },
    { id: 'recentIncome', name: 'Recent Income', isVisible: true, size: 1 },
    { id: 'recentExpenses', name: 'Recent Expenses', isVisible: true, size: 1 },
];

type FilterType = 'today' | 'this_week' | 'this_month' | 'all_time';
type DashboardLayout = 'default' | 'financial' | 'income' | 'expense' | 'compact' | 'custom';

const layoutPresets: Record<Exclude<DashboardLayout, 'custom'>, DashboardWidget[]> = {
    default: defaultWidgets.map(w => ({ ...w, isVisible: true, size: w.id === 'incomeExpense' ? 2 : 1 })),
    financial: defaultWidgets.map(w => ({
        ...w,
        size: (w.id === 'incomeExpense') ? 2 : 1,
        isVisible: ['incomeExpense', 'incomeTrend', 'expenseTrend'].includes(w.id),
    })),
    income: defaultWidgets.map(w => ({
        ...w,
        size: (w.id === 'incomeTrend') ? 2 : 1,
        isVisible: ['incomeTrend', 'recentIncome', 'incomeExpense'].includes(w.id),
    })),
    expense: defaultWidgets.map(w => ({
        ...w,
        size: (w.id === 'expenseTrend') ? 2 : 1,
        isVisible: ['expenseTrend', 'expenseBreakdown', 'recentExpenses'].includes(w.id),
    })),
    compact: defaultWidgets.map(w => ({
        ...w,
        size: 1,
        isVisible: true
    })),
};


const Dashboard: React.FC<DashboardProps> = ({ transactions, themes, activeThemeName, onSetTheme }) => {
  const [isLayoutModalOpen, setLayoutModalOpen] = useState(false);
  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all_time');
  
  const [widgets, setWidgets] = useLocalStorage<DashboardWidget[]>('dashboardWidgetsConfig', defaultWidgets);
  const [layout, setLayout] = useLocalStorage<DashboardLayout>('dashboardLayout', 'default');

  useEffect(() => {
    if (layout !== 'custom') {
        setWidgets(layoutPresets[layout]);
    }
  }, [layout]);

  const handleSaveLayout = (newWidgets: DashboardWidget[]) => {
      setWidgets(newWidgets);
      setLayout('custom');
  };
  
  const filteredTransactions = useMemo(() => {
    if (filter === 'all_time') {
        return transactions;
    }
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate: Date;

    switch (filter) {
        case 'today':
            startDate = today;
            break;
        case 'this_week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay()); // Assuming Sunday is first day
            break;
        case 'this_month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        default:
            return transactions;
    }

    return transactions.filter(t => new Date(t.date) >= startDate);
  }, [transactions, filter]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalAmountOut = filteredTransactions
    .filter(t => t.type === TransactionType.AMOUNT_OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  // Balance should always reflect the current, total balance, regardless of filter.
  const balance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
  const profit = totalIncome - totalExpense - totalAmountOut;

  const incomeTransactions = filteredTransactions.filter(t => t.type === TransactionType.INCOME);
  const expenseTransactions = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE);
  const amountOutTransactions = filteredTransactions.filter(t => t.type === TransactionType.AMOUNT_OUT);
  
  const componentMap: Record<DashboardWidget['id'], React.ReactNode> = {
    incomeExpense: <IncomeExpenseChart data={filteredTransactions} />,
    incomeTrend: <DashboardLineChart transactions={incomeTransactions} title="Income" dataKey="income" color="#48BB78" />,
    expenseTrend: <DashboardLineChart transactions={expenseTransactions} title="Expense" dataKey="expense" color="#F56565" />,
    ownerPayment: <DashboardLineChart transactions={amountOutTransactions} title="Owner Payments" dataKey="expense" color="#FBBF24" />,
    recentIncome: <DashboardHistoryCard title="Recent Income" transactions={incomeTransactions} type={TransactionType.INCOME} />,
    recentExpenses: <DashboardHistoryCard title="Recent Expenses" transactions={expenseTransactions} type={TransactionType.EXPENSE} />,
    expenseBreakdown: <ExpensePieChart transactions={filteredTransactions} />,
  };
  
  const getFilterButtonClass = (filterName: FilterType) => {
    return `px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === filterName ? 'primary-bg text-on-accent' : 'text-text-primary bg-background-tertiary hover:bg-background-tertiary-hover'}`;
  };

  const getLayoutButtonClass = (layoutName: DashboardLayout) => {
    return `px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${layout === layoutName ? 'bg-accent text-on-accent' : 'text-text-primary bg-background-tertiary hover:bg-background-tertiary-hover'}`;
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-accent flex-shrink-0">Dashboard</h1>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 bg-background-secondary p-1 rounded-lg">
                    <button onClick={() => setFilter('today')} className={getFilterButtonClass('today')}>Today</button>
                    <button onClick={() => setFilter('this_week')} className={getFilterButtonClass('this_week')}>This Week</button>
                    <button onClick={() => setFilter('this_month')} className={getFilterButtonClass('this_month')}>This Month</button>
                    <button onClick={() => setFilter('all_time')} className={getFilterButtonClass('all_time')}>All Time</button>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => setThemeModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-background-tertiary text-text-strong font-semibold text-sm rounded-lg hover:bg-background-tertiary-hover transition-colors"
                    >
                        <PaintBrushIcon className="w-5 h-5" />
                        Theme
                    </button>
                    <button
                        onClick={() => setLayoutModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-background-tertiary text-text-strong font-semibold text-sm rounded-lg hover:bg-background-tertiary-hover transition-colors"
                    >
                        <AdjustmentsHorizontalIcon className="w-5 h-5" />
                        Customize
                    </button>
                </div>
            </div>
      </div>
      
        <div className="bg-background-secondary p-2 rounded-xl shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text-secondary px-2">Dashboard Views:</span>
                <button onClick={() => setLayout('default')} className={getLayoutButtonClass('default')}>Default</button>
                <button onClick={() => setLayout('financial')} className={getLayoutButtonClass('financial')}>Financial</button>
                <button onClick={() => setLayout('income')} className={getLayoutButtonClass('income')}>Income</button>
                <button onClick={() => setLayout('expense')} className={getLayoutButtonClass('expense')}>Expense</button>
                <button onClick={() => setLayout('compact')} className={getLayoutButtonClass('compact')}>Compact</button>
                {layout === 'custom' && <button onClick={() => {}} className={getLayoutButtonClass('custom')}>Custom</button>}
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
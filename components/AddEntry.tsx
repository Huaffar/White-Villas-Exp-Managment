import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types.
import { Transaction, TransactionType, Category, Project, StaffMember, Laborer, Contact, Material, Vendor, StockMovement } from '../types';
import { SystemCategoryNames } from '../App';

interface AddEntryProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id' | 'balance'>) => void;
    onAddStock: (stock: Omit<StockMovement, 'id' | 'type'>) => void;
    projects: Project[];
    staff: StaffMember[];
    laborers: Laborer[];
    incomeCategories: Category[];
    expenseCategories: Category[];
    transactions: Transaction[];
    contacts: Contact[];
    systemCategoryNames: typeof SystemCategoryNames;
    materials: Material[];
    vendors: Vendor[];
}

const AddEntry: React.FC<AddEntryProps> = ({ onAddTransaction, onAddStock, projects, staff, laborers, incomeCategories, expenseCategories, transactions, contacts, systemCategoryNames, materials, vendors }) => {
    const [type, setType] = useState<TransactionType | 'Stock'>(TransactionType.EXPENSE);
    
    // Transaction form states
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [details, setDetails] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [projectId, setProjectId] = useState<number | undefined>();
    const [staffId, setStaffId] = useState<number | undefined>();
    const [laborerId, setLaborerId] = useState<number | undefined>();
    const [contactId, setContactId] = useState<number | undefined>();

    // Stock form states
    const [materialId, setMaterialId] = useState<number | undefined>();
    const [vendorId, setVendorId] = useState<number | undefined>();
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');


    const categories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;
    const clients = contacts.filter(c => c.type === 'Client');
    const constructionProjects = projects.filter(p => p.projectType === 'Construction' && p.status === 'Ongoing');
    
    useEffect(() => {
        // Reset all form fields when the entry type changes
        setDetails('');
        setAmount('');
        setCategory('');
        setProjectId(undefined);
        setStaffId(undefined);
        setLaborerId(undefined);
        setContactId(undefined);
        setMaterialId(undefined);
        setVendorId(undefined);
        setQuantity('');
        setUnitPrice('');
    }, [type]);

    useEffect(() => {
        // Reset client if category is not Project Payment or Client Investment
        if (category !== systemCategoryNames.projectPayment && category !== systemCategoryNames.clientInvestment) {
            setContactId(undefined);
        }
    }, [category, systemCategoryNames]);

    const isConstructionCategory = category === systemCategoryNames.constructionMaterial || category === systemCategoryNames.constructionLabor;
    const isProjectPayment = type === TransactionType.INCOME && category === systemCategoryNames.projectPayment;
    const isClientInvestment = type === TransactionType.INCOME && category === systemCategoryNames.clientInvestment;
    const requiresClient = isProjectPayment || isClientInvestment;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (type === 'Stock') {
            if (!materialId || !vendorId || !quantity || !unitPrice) {
                alert('Please fill all required fields for stock purchase.');
                return;
            }
            onAddStock({
                date,
                materialId,
                vendorId,
                quantity: parseFloat(quantity),
                unitPrice: parseFloat(unitPrice),
                projectId,
            });
            // Reset stock form
            setMaterialId(undefined);
            setVendorId(undefined);
            setQuantity('');
            setUnitPrice('');
            setProjectId(undefined);
        } else { // Income or Expense
            if (!details || !amount || !category) {
                alert('Please fill all required fields.');
                return;
            }
            if (isConstructionCategory && !projectId) {
                alert('Please select a project for this construction expense.');
                return;
            }
            if (requiresClient && !contactId) {
                alert('Please select a client for this transaction.');
                return;
            }
            
            onAddTransaction({
                date,
                details,
                category,
                type,
                amount: parseFloat(amount),
                projectId,
                staffId,
                laborerId,
                contactId,
            });

            // Reset transaction form
            setDetails('');
            setAmount('');
            setCategory('');
            setProjectId(undefined);
            setStaffId(undefined);
            setLaborerId(undefined);
            setContactId(undefined);
        }
    };

    const recentTransactions = transactions.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    const renderTransactionForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (PKR)</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="e.g., 5000" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
            </div>
            <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-1">Details / Remarks</label>
                <input type="text" id="details" value={details} onChange={e => setDetails(e.target.value)} required placeholder="e.g., Office electricity bill" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="" disabled>Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="project" className={`block text-sm font-medium text-gray-300 mb-1 ${isConstructionCategory ? 'font-bold text-yellow-400' : ''}`}>
                        Project {isConstructionCategory ? '(Required)' : '(Optional)'}
                    </label>
                    <select id="project" value={projectId || ''} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="">None</option>
                        {(isConstructionCategory ? constructionProjects : projects).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
            {requiresClient && (
                 <div>
                    <label htmlFor="client" className="block text-sm font-medium text-gray-300 mb-1 font-bold text-yellow-400">Client (Required)</label>
                    <select id="client" value={contactId || ''} onChange={e => setContactId(e.target.value ? parseInt(e.target.value) : undefined)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="" disabled>Select a client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            )}
            {type === TransactionType.EXPENSE && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="staff" className="block text-sm font-medium text-gray-300 mb-1">Link to Staff (Optional)</label>
                        <select id="staff" value={staffId || ''} onChange={e => setStaffId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            <option value="">None</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="laborer" className="block text-sm font-medium text-gray-300 mb-1">Link to Laborer (Optional)</label>
                        <select id="laborer" value={laborerId || ''} onChange={e => setLaborerId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            <option value="">None</option>
                            {laborers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStockForm = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="stock-date" className="block text-sm font-medium text-gray-300 mb-1">Purchase Date</label>
                    <input type="date" id="stock-date" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-300 mb-1">Material</label>
                    <select id="material" value={materialId || ''} onChange={e => setMaterialId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="" disabled>Select material</option>
                        {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="vendor" className="block text-sm font-medium text-gray-300 mb-1">Vendor</label>
                     <select id="vendor" value={vendorId || ''} onChange={e => setVendorId(parseInt(e.target.value))} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="" disabled>Select vendor</option>
                        {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="stock-project" className="block text-sm font-medium text-gray-300 mb-1">Project (Optional)</label>
                    <select id="stock-project" value={projectId || ''} onChange={e => setProjectId(e.target.value ? parseInt(e.target.value) : undefined)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="">None</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="e.g., 100" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
                <div>
                    <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-300 mb-1">Unit Price (PKR)</label>
                    <input type="number" id="unitPrice" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} required placeholder="Price per unit" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
            </div>
        </div>
    );


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full border-2 border-blue-500">
                <h2 className="text-2xl font-bold primary-text mb-6">Add New Entry</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Entry Type</label>
                        <div className="flex gap-2 bg-gray-900 p-1 rounded-lg">
                            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-2 rounded-md font-semibold transition-colors text-sm ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Expense</button>
                            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-full py-2 rounded-md font-semibold transition-colors text-sm ${type === TransactionType.INCOME ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Income</button>
                            <button type="button" onClick={() => setType('Stock')} className={`w-full py-2 rounded-md font-semibold transition-colors text-sm ${type === 'Stock' ? 'primary-bg text-on-accent' : 'text-gray-300 hover:bg-gray-700'}`}>Stock Purchase</button>
                        </div>
                    </div>

                    {type === 'Stock' ? renderStockForm() : renderTransactionForm()}

                    <div className="flex justify-end pt-8">
                        <button type="submit" className="px-8 py-3 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90">
                            {type === 'Stock' ? 'Add Stock Purchase' : 'Add Entry'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full">
                <h2 className="text-xl font-bold text-white mb-4">Recent Entries Report</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((t) => (
                            <tr key={t.id} className="border-b border-gray-700">
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{t.details}</td>
                                <td className={`px-6 py-4 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-green-400' : 'text-red-400'}`}>
                                {t.amount.toLocaleString()}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddEntry;

import React, { useState, useRef } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { ToastProps } from './Toast';
import { DownloadIcon, ArrowUpTrayIcon } from './IconComponents';

interface BackupRestoreSettingsProps {
    showToast: (message: string, type: ToastProps['type']) => void;
}

const BackupRestoreSettings: React.FC<BackupRestoreSettingsProps> = ({ showToast }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const LOCAL_STORAGE_KEYS = [
        'transactions', 'incomeCategories', 'expenseCategories', 'ownerCategories', 
        'projects', 'staff', 'laborers', 'contacts', 'users', 'adminProfile',
        'materials', 'materialCategories', 'stockMovements', 'vendors', 'vendorCategories', 'leads',
        'dashboardLayoutConfig'
    ];

    const handleBackup = () => {
        try {
            const backupData: { [key: string]: any } = {};
            LOCAL_STORAGE_KEYS.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    backupData[key] = JSON.parse(item);
                }
            });

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toISOString().split('T')[0];
            link.download = `wva_pro_backup_${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast('Data backup successful!', 'success');
        } catch (err) {
            console.error('Backup failed:', err);
            showToast('Data backup failed. See console for details.', 'error');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/json') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Invalid file type. Please upload a JSON file.');
                setFile(null);
            }
        }
    };

    const handleRestoreClick = () => {
        if (!file) {
            setError('Please select a backup file first.');
            return;
        }
        setConfirmModalOpen(true);
    };

    const confirmRestore = () => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text);

                // Basic validation
                if (!data.transactions || !data.adminProfile) {
                    throw new Error('Invalid or corrupted backup file.');
                }

                // Clear existing keys before restoring
                LOCAL_STORAGE_KEYS.forEach(key => {
                    localStorage.removeItem(key);
                });

                // Set new data
                Object.keys(data).forEach(key => {
                    if (LOCAL_STORAGE_KEYS.includes(key)) {
                        localStorage.setItem(key, JSON.stringify(data[key]));
                    }
                });

                showToast('Data restored successfully! The app will now reload.', 'success');
                setConfirmModalOpen(false);

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (err) {
                if (err instanceof Error) {
                    setError(`Restore failed: ${err.message}`);
                } else {
                    setError('An unknown error occurred during restore.');
                }
                setConfirmModalOpen(false);
            }
        };
        reader.onerror = () => {
            setError('Failed to read the file.');
            setConfirmModalOpen(false);
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-10">
            {/* Backup Section */}
            <div>
                <h2 className="text-xl font-semibold text-white">Backup Data</h2>
                <p className="text-sm text-gray-400 mt-2">Download all your application data into a single JSON file. Keep this file in a safe place.</p>
                <div className="mt-6">
                    <button
                        onClick={handleBackup}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        Download Backup File
                    </button>
                </div>
            </div>

            {/* Restore Section */}
            <div className="border-t border-gray-700 pt-8">
                <h2 className="text-xl font-semibold text-white">Restore Data</h2>
                <p className="text-sm text-gray-400 mt-2">Upload a backup file to restore your application data. <strong className="text-red-400">Warning: This will overwrite all current data.</strong></p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                        <ArrowUpTrayIcon className="w-5 h-5" />
                        {file ? 'Change File' : 'Select Backup File'}
                    </button>

                    {file && <span className="text-gray-300 text-sm flex-grow">{file.name}</span>}

                    <button
                        onClick={handleRestoreClick}
                        disabled={!file}
                        className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Restore Data
                    </button>
                </div>
                {error && <p className="text-sm text-red-400 mt-4 text-center">{error}</p>}
            </div>

            {isConfirmModalOpen && (
                <ConfirmationModal
                    title="Confirm Data Restore"
                    message="Are you sure you want to restore data from the selected file? This will permanently overwrite all current application data. This action cannot be undone."
                    onConfirm={confirmRestore}
                    onCancel={() => setConfirmModalOpen(false)}
                    confirmButtonText="Yes, Overwrite and Restore"
                    confirmButtonClass="bg-red-600 hover:bg-red-500"
                />
            )}
        </div>
    );
};

export default BackupRestoreSettings;

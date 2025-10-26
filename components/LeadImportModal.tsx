import React, { useState, useRef } from 'react';
import { Lead } from '../types';

interface LeadImportModalProps {
    onImport: (leads: Omit<Lead, 'id' | 'createdAt' | 'followUps'>[]) => void;
    onClose: () => void;
}

const LeadImportModal: React.FC<LeadImportModalProps> = ({ onImport, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/csv') {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Invalid file type. Please upload a CSV file.');
            }
        }
    };

    const handleImport = () => {
        if (!file) {
            setError('Please select a file to import.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            // Simple CSV parsing (can be improved with a library like PapaParse for robustness)
            const rows = text.split('\n').map(row => row.trim()).filter(row => row);
            const headers = rows[0].split(',').map(h => h.trim());
            const leadsData = rows.slice(1).map(row => {
                const values = row.split(',');
                return headers.reduce((obj, header, index) => {
                    (obj as any)[header] = values[index]?.trim();
                    return obj;
                }, {} as any);
            });
            
            // TODO: Validate and map data to Lead objects before calling onImport
            console.log('Parsed CSV Data:', leadsData);
            // onImport(leadsData);
            onClose();
        };
        reader.onerror = () => {
             setError('Failed to read the file.');
        };
        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Import Leads from CSV</h2>
                <div className="text-sm text-gray-400 bg-gray-900/50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">CSV File Instructions:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>The first row must be a header row.</li>
                        <li>Required columns: `name`, `phone`, `statusId`, `source`.</li>
                        <li>Optional columns: `company`, `email`, `assignedToId`, `potentialValue`, `notes`.</li>
                    </ul>
                </div>

                <div className="mt-6">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full text-center p-6 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-700 hover:border-yellow-500 transition-colors"
                    >
                        {file ? (
                            <span className="text-green-400">{file.name}</span>
                        ) : (
                            <span className="text-gray-400">Click to select a .csv file</span>
                        )}
                    </button>
                </div>

                {error && <p className="text-sm text-red-400 mt-2 text-center">{error}</p>}

                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                    <button onClick={handleImport} disabled={!file} className="px-4 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Import Leads
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadImportModal;
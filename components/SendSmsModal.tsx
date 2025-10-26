import React, { useState, useMemo } from 'react';
import { SmsTemplate, AdminProfile } from '../types';
import { sendSingleMessage } from '../services/smsService';

interface SendSmsModalProps {
    onClose: () => void;
    adminProfile: AdminProfile;
    initialData?: {
        phone: string;
        placeholders?: Record<string, string>; // e.g., { "{{clientName}}": "John Doe" }
    };
}

const SendSmsModal: React.FC<SendSmsModalProps> = ({ onClose, adminProfile, initialData }) => {
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [message, setMessage] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [result, setResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

    const activeTemplates = useMemo(() => {
        return adminProfile.smsTemplates.filter(t => t.active);
    }, [adminProfile.smsTemplates]);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplateId(templateId);
        const template = activeTemplates.find(t => t.id === templateId);
        if (template) {
            let content = template.content;
            // Replace placeholders with initial data if available
            if (initialData?.placeholders) {
                for (const [key, value] of Object.entries(initialData.placeholders)) {
                    content = content.replace(new RegExp(key, 'g'), value);
                }
            }
            setMessage(content);
        } else {
            setMessage('');
        }
    };

    const handleSend = async () => {
        setIsSending(true);
        setResult(null);
        try {
            await sendSingleMessage(
                adminProfile.smsSettings.apiUrl,
                adminProfile.smsSettings.apiKey,
                phone,
                message,
                adminProfile.smsSettings.smsDemoMode
            );
            setResult({ status: 'success', message: 'SMS sent successfully!' });
            setTimeout(onClose, 1500); // Close modal on success
        } catch (error) {
            if (error instanceof Error) {
                setResult({ status: 'error', message: error.message });
            } else {
                setResult({ status: 'error', message: 'An unknown error occurred.' });
            }
        } finally {
            setIsSending(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">Send SMS</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Phone</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Load Template (Optional)</label>
                        <select value={selectedTemplateId} onChange={e => handleTemplateChange(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white">
                            <option value="">-- Manual Message --</option>
                            {activeTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                        <p className="text-xs text-gray-400 mt-1 text-right">{message.length} characters</p>
                    </div>

                    {result && (
                        <div className={`p-3 rounded-lg text-sm ${result.status === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {result.message}
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Cancel</button>
                    <button onClick={handleSend} disabled={!phone || !message || isSending} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-wait">
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendSmsModal;
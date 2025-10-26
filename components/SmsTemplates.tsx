import React, { useState } from 'react';
import { AdminProfile, SmsTemplate } from '../types';

interface SmsTemplatesProps {
    profile: AdminProfile;
    onSave: (profile: AdminProfile) => void;
}

const TemplateEditor: React.FC<{
    template: SmsTemplate;
    onTemplateChange: (updatedTemplate: SmsTemplate) => void;
}> = ({ template, onTemplateChange }) => {

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onTemplateChange({ ...template, content: e.target.value });
    };

    const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onTemplateChange({ ...template, active: e.target.checked });
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="bg-gray-700/50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                <label htmlFor={`template-active-${template.id}`} className="flex items-center cursor-pointer">
                    <span className="mr-3 text-sm font-medium text-gray-300">Enable Automated SMS</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            id={`template-active-${template.id}`}
                            className="sr-only"
                            checked={template.active}
                            onChange={handleActiveChange}
                        />
                        <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${template.active ? 'translate-x-6 bg-yellow-400' : ''}`}></div>
                    </div>
                </label>
            </div>
            <textarea
                value={template.content}
                onChange={handleContentChange}
                rows={4}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 primary-ring focus:outline-none"
            />
             <div className="mt-2">
                <p className="text-xs text-gray-400">Available placeholders:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                    {template.placeholders.map(p => (
                        <button
                            type="button"
                            key={p}
                            onClick={() => copyToClipboard(p)}
                            title="Click to copy"
                            className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs font-mono rounded hover:bg-gray-500"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SmsTemplates: React.FC<SmsTemplatesProps> = ({ profile, onSave }) => {
    const [templates, setTemplates] = useState<SmsTemplate[]>(profile.smsTemplates || []);

    const handleTemplateChange = (updatedTemplate: SmsTemplate) => {
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    };
    
    const handleSave = () => {
        onSave({ ...profile, smsTemplates: templates });
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-10">
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Automated SMS Templates</h2>
                    <button onClick={handleSave} className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity">
                        Save Templates
                    </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Edit the messages that are sent automatically for certain actions.</p>
            </div>

            <div className="space-y-6">
                {templates.map(template => (
                    <TemplateEditor
                        key={template.id}
                        template={template}
                        onTemplateChange={handleTemplateChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default SmsTemplates;
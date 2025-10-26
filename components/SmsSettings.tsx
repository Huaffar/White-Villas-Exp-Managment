import React, { useState } from 'react';
import { AdminProfile } from '../types';
import { sendSingleMessage } from '../services/smsService';

interface SmsSettingsProps {
    profile: AdminProfile;
    onSave: (profile: AdminProfile) => void;
}

const SmsSettings: React.FC<SmsSettingsProps> = ({ profile, onSave }) => {
    const [apiUrl, setApiUrl] = useState(profile.smsSettings.apiUrl);
    const [apiKey, setApiKey] = useState(profile.smsSettings.apiKey);
    const [smsDemoMode, setSmsDemoMode] = useState(profile.smsSettings.smsDemoMode);
    
    const [testNumber, setTestNumber] = useState('');
    const [testMessage, setTestMessage] = useState('This is a test message from WVA Pro.');
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

    const handleSave = () => {
        onSave({
            ...profile,
            smsSettings: {
                apiUrl,
                apiKey,
                smsDemoMode,
            },
        });
    };

    const handleSendTest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTesting(true);
        setTestResult(null);
        try {
            const result = await sendSingleMessage(apiUrl, apiKey, testNumber, testMessage, smsDemoMode);
            setTestResult({ status: 'success', message: `Message sent successfully! Status: ${result.status}` });
        } catch (error) {
            if (error instanceof Error) {
                let displayMessage = error.message;
                // Specifically check for the fetch error which indicates a CORS or mixed content problem
                if (error.message.includes('Failed to fetch')) {
                    displayMessage = "The request was blocked by the browser's security policy. This is often due to a CORS issue or a 'mixed content' block (requesting 'http' from an 'https' page). Ensure the API URL is correct, uses 'https', and the provider allows web-based requests. For production, a server-side proxy is the most reliable solution.";
                }
                setTestResult({ status: 'error', message: displayMessage });
            } else {
                setTestResult({ status: 'error', message: 'An unknown error occurred.' });
            }
        } finally {
            setIsTesting(false);
        }
    };

    const renderTestResult = () => {
        if (!testResult) return null;

        if (testResult.status === 'error' && testResult.message.includes("blocked by the browser's security policy")) {
            return (
                <div className="p-4 rounded-lg bg-red-900/50 border border-red-700 text-red-300 space-y-3">
                    <h3 className="font-bold text-lg">Browser Security Blocked API Request</h3>
                    <p className="text-sm">
                        The SMS could not be sent because your browser blocked the request for security reasons. This is expected behavior and not an error in the application code itself.
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li><strong>Reason:</strong> This usually happens due to a CORS (Cross-Origin Resource Sharing) policy on the SMS provider's server, or a "mixed content" block (requesting an `http` URL from a secure `https` page).</li>
                        <li><strong>Solution:</strong> The reliable, long-term solution is to use a backend server (a proxy) to make the API call for you. Direct browser-to-3rd-party-API calls are often restricted.</li>
                        <li><strong>Workaround:</strong> For now, you can enable "Demo Mode" above to simulate successful SMS sending and continue testing the application's features.</li>
                    </ul>
                </div>
            )
        }

        return (
            <div className={`p-3 rounded-lg text-sm ${testResult.status === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
               {testResult.message}
            </div>
        )
    }

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-10">
            <div className="p-4 rounded-lg bg-blue-900/50 border border-blue-700 text-blue-300 space-y-2 text-sm">
                <h3 className="font-bold text-base text-white">Important Note on SMS Sending</h3>
                <p>
                    Directly sending SMS from a web browser is often blocked by security policies (CORS, Mixed Content). This is a browser feature, not an application bug.
                </p>
                <p>
                    For this reason, <strong>Demo Mode is enabled by default</strong>. In this mode, the app simulates sending SMS successfully without making a real API call.
                </p>
                <p>
                    To send real SMS, you would typically need a backend server to act as a proxy. Only disable Demo Mode if you have such a setup and have configured the API URL to point to your proxy.
                </p>
            </div>

            {/* API Configuration Section */}
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">SMS API Configuration</h2>
                    <button onClick={handleSave} className="px-6 py-2 primary-bg text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity">
                        Save Settings
                    </button>
                </div>
                <p className="text-sm text-gray-400 mt-2">Enter the credentials provided by your SMS gateway provider.</p>
                <div className="mt-6 space-y-6">
                     <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                        <div>
                            <h3 className="font-semibold text-white">Enable Demo Mode</h3>
                            <p className="text-xs text-gray-400">Simulate successful SMS sending without making real API calls. Use this if you encounter "Failed to fetch" errors.</p>
                        </div>
                        <label htmlFor="demo-mode-toggle" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="demo-mode-toggle"
                                    className="sr-only"
                                    checked={smsDemoMode}
                                    onChange={(e) => setSmsDemoMode(e.target.checked)}
                                />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${smsDemoMode ? 'translate-x-6 bg-yellow-400' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-300 mb-1">API Endpoint URL</label>
                            <input
                                type="text"
                                id="apiUrl"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                placeholder="https://sms.provider.com/services/send.php"
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 primary-ring focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
                            <input
                                type="password"
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 primary-ring focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Test SMS Section */}
            <div className="border-t border-gray-700 pt-8">
                <h2 className="text-xl font-semibold text-white">Send a Test Message</h2>
                <p className="text-sm text-gray-400 mt-2">Verify your API credentials by sending a test SMS.</p>
                <form onSubmit={handleSendTest} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                             <label htmlFor="testNumber" className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                id="testNumber"
                                value={testNumber}
                                onChange={(e) => setTestNumber(e.target.value)}
                                required
                                placeholder="e.g., 923001234567"
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 primary-ring focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="testMessage" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                            <input
                                type="text"
                                id="testMessage"
                                value={testMessage}
                                onChange={(e) => setTestMessage(e.target.value)}
                                required
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 primary-ring focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    {renderTestResult()}
                    
                    <div className="flex justify-end">
                         <button type="submit" disabled={isTesting} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-wait">
                            {isTesting ? 'Sending...' : 'Send Test SMS'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SmsSettings;
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
    users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (user && user.password === password) {
            onLogin(user);
        } else {
            setError('Invalid username or password.');
        }
    };

    const handleDemoLogin = (user: string, pass: string) => {
        setUsername(user);
        setPassword(pass);
        setError('');
    };

    const demoUsers = [
        { user: 'admin', pass: 'password', role: 'Admin' },
        { user: 'fatima', pass: 'password', role: 'Accountant' },
        { user: 'ali', pass: 'password', role: 'Manager' },
        { user: 'asif', pass: 'password', role: 'Client' },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-primary text-text-primary">
            <div className="w-full max-w-md p-8 space-y-8 bg-background-secondary rounded-2xl shadow-2xl border border-primary">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-text-strong">WVA Pro</h1>
                    <p className="mt-2 text-text-secondary">White Villas Accounting Pro</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-secondary bg-input placeholder-text-secondary text-text-strong rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-input" className="sr-only">Password</label>
                            <input
                                id="password-input"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-secondary bg-input placeholder-text-secondary text-text-strong rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-on-accent bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-secondary ring-accent"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                 <div className="text-xs text-text-secondary text-center pt-4 border-t border-primary">
                    <p className="font-bold text-sm text-accent">Super Admin Access</p>
                    <button 
                        onClick={() => handleDemoLogin('superadmin', 'password')}
                        className="w-full text-center mt-1 p-2 bg-background-tertiary rounded-md hover:bg-background-tertiary-hover text-text-primary"
                    >
                        <span className="font-semibold">User:</span> superadmin / <span className="font-semibold">Pass:</span> password
                    </button>

                    <p className="font-semibold mt-4">Other Demo Accounts (Click to fill)</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {demoUsers.map(({user, pass, role}) => (
                            <button
                                key={user}
                                onClick={() => handleDemoLogin(user, pass)}
                                className="p-2 bg-background-tertiary rounded-md hover:bg-background-tertiary-hover text-text-primary"
                            >
                                {user} <span className="text-text-secondary">({role})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
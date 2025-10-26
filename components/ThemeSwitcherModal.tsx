import React from 'react';

export interface Theme {
    name: string;
    colors: {
        '--primary-color-rgb': string;
        '--background-primary': string;
        '--background-secondary': string;
        '--background-tertiary': string;
        '--background-tertiary-hover': string;
        '--background-input': string;
        '--border-primary': string;
        '--border-secondary': string;
        '--text-primary': string;
        '--text-secondary': string;
        '--text-strong': string;
        '--text-on-accent': string;
    };
}

interface ThemeSwitcherModalProps {
    themes: Theme[];
    activeThemeName: string;
    onSetTheme: (themeName: string) => void;
    onClose: () => void;
}

const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({ themes, activeThemeName, onSetTheme, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-background-secondary p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-primary">
                <h2 className="text-2xl font-bold text-accent mb-6">Select a Theme</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {themes.map(theme => (
                        <button
                            key={theme.name}
                            onClick={() => onSetTheme(theme.name)}
                            className={`block p-2 rounded-lg border-2 transition-colors ${activeThemeName === theme.name ? 'border-accent' : 'border-transparent hover:border-secondary'}`}
                        >
                            <div className="rounded-md overflow-hidden">
                                <div className="grid grid-cols-2 h-20">
                                    <div style={{ backgroundColor: theme.colors['--background-secondary'] }}></div>
                                    <div style={{ backgroundColor: theme.colors['--background-primary'] }} className="flex items-start justify-start p-1">
                                         <div className="w-1/2 h-1/2 rounded" style={{ backgroundColor: `rgb(${theme.colors['--primary-color-rgb']})` }}></div>
                                    </div>
                                </div>
                                <div className="p-2 text-center" style={{ backgroundColor: theme.colors['--background-tertiary'] }}>
                                    <p className="text-sm font-semibold" style={{ color: theme.colors['--text-strong'] }}>{theme.name}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-8">
                    <button onClick={onClose} className="px-6 py-2 bg-background-tertiary-hover text-text-strong font-semibold rounded-lg hover:opacity-80">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ThemeSwitcherModal;

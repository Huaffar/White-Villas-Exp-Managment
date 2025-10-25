import React from 'react';

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const BalanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a2 2 0 002 2h14a2 2 0 002-2l-3-9m0 0l-3-1m-3 1l3-1m0 0l3 1m-6 0l3 9" />
    </svg>
);

export const IncomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const ExpenseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-6-6m5.5 5.5a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" />
    </svg>
);

export const ProfitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

export const PrinterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-9a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.75,13.96C17,14.26 17.11,14.72 16.96,15.11C16.8,15.5 16.5,15.84 16.1,16.08C15.71,16.31 15.26,16.36 14.88,16.24C14.49,16.12 14.15,15.87 13.96,15.5C13.53,16.05 13.06,16.53 12.55,16.94C11.9,17.43 11.23,17.78 10.54,18C10.05,18.12 9.56,18.06 9.16,17.82C8.76,17.58 8.47,17.23 8.35,16.8C8.24,16.38 8.32,15.93 8.58,15.55C8.85,15.17 9.25,14.91 9.7,14.83C10.16,14.76 10.61,14.86 11,15.14C11.33,15.34 11.6,15.61 11.79,15.93C11.96,15.79 12.1,15.65 12.23,15.53C12.87,14.91 13.33,14.11 13.54,13.16C12.63,13.06 11.8,12.72 11.13,12.17C10.45,11.62 10,10.9 9.75,10.05C9.5,9.2 9.5,8.33 9.75,7.5C10,6.67 10.5,6 11.13,5.5C11.75,5 12.5,4.67 13.38,4.5C14.25,4.33 15.13,4.5 16,5C16.88,5.5 17.55,6.17 18,7.05C18.45,7.92 18.5,8.8 18.15,9.65C17.8,10.5 17.2,11.22 16.35,11.8C15.9,11.56 15.44,11.41 14.97,11.35C14.5,11.29 14,11.36 13.55,11.56C13.1,11.76 12.7,12.06 12.4,12.47C12.1,12.88 12,13.33 12.03,13.8C12.06,14.27 12.22,14.71 12.52,15.07C12.82,15.44 13.23,15.65 13.75,15.71C14.29,15.77 14.83,15.61 15.29,15.23C15.47,15.06 15.63,14.88 15.75,14.69C16.03,14.48 16.31,14.26 16.63,14.03C16.71,13.98 16.75,13.96 16.75,13.96M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22C16.97,22 21.05,18.15 21.95,13.45C22.05,12.83 22,12.21 21.85,11.63C21.7,11.05 21.45,10.5 21.1,10C20.5,9.05 19.75,8.2 18.85,7.5C17.95,6.8 16.95,6.3 15.85,6.05C14.75,5.8 13.6,5.8 12.5,6.05C11.4,6.3 10.4,6.8 9.5,7.5C8.6,8.2 7.85,9.05 7.3,10C6.7,11 6.35,12.05 6.25,13.2C6.15,14.35 6.3,15.55 6.7,16.65C7.1,17.75 7.75,18.75 8.6,19.6C9.45,20.45 10.45,21.1 11.55,21.5C12.65,21.9 13.8,22.05 14.95,21.95C16.1,21.85 17.15,21.5 18.1,20.95C19.05,20.4 19.8,19.65 20.35,18.75L20.55,18.45C20.5,18.25 20.4,18.05 20.25,17.85C19.85,17.4 19.5,16.95 19.25,16.5C19,16.05 18.85,15.55 18.85,15.05C18.85,14.5 19,14 19.3,13.55C19.6,13.1 20.05,12.75 20.55,12.55C21.05,12.35 21.55,12.3 22,12.45C22.2,12.5 22.35,12.6 22.45,12.75C22.55,12.9 22.6,13.05 22.6,13.25C22.6,13.45 22.55,13.65 22.45,13.8C21.7,18.8 17.35,23 12,23A11,11 0 0,1 1,12A11,11 0 0,1 12,1C17.5,1 22.2,5.15 22.95,10.55C23.05,11.17 23.1,11.8 22.95,12.38C22.8,12.96 22.55,13.5 22.2,14C21.6,14.95 20.85,15.8 19.95,16.5C19.05,17.2 18.05,17.7 16.95,17.95C15.85,18.2 14.7,18.2 13.6,17.95C12.5,17.7 11.5,17.2 10.6,16.5C9.7,15.8 8.95,14.95 8.4,14C7.8,13 7.45,11.95 7.35,10.8C7.25,9.65 7.4,8.45 7.8,7.35C8.2,6.25 8.85,5.25 9.7,4.4C10.55,3.55 11.55,2.9 12.65,2.5C13.75,2.1 14.9,1.95 16.05,2.05C17.2,2.15 18.25,2.5 19.2,3.05C20.15,3.6 20.9,4.35 21.45,5.25L21.25,5.55C20.55,4.7 19.7,3.95 18.75,3.4C17.8,2.85 16.75,2.45 15.65,2.25C14.55,2.05 13.4,2.05 12.25,2.25C11.1,2.45 10.05,2.85 9.1,3.4C8.15,3.95 7.3,4.7 6.6,5.55C5.9,6.4 5.35,7.35 5,8.4C4.65,9.45 4.5,10.55 4.55,11.65C4.6,12.75 4.85,13.85 5.3,14.85C5.75,15.85 6.4,16.75 7.2,17.55C8,18.35 8.9,18.95 9.9,19.35C10.9,19.75 11.95,19.95 13,19.9C14.05,19.85 15.1,19.6 16.05,19.1C17,18.6 17.85,17.9 18.5,17.05L18.3,16.75C17.8,17.55 17.1,18.25 16.25,18.7C15.4,19.15 14.45,19.4 13.5,19.4C12.55,19.4 11.6,19.2 10.75,18.8C9.9,18.4 9.15,17.8 8.55,17.05C7.95,16.3 7.55,15.45 7.4,14.5C7.25,13.55 7.3,12.55 7.6,11.65C7.9,10.75 8.4,9.9 9.05,9.2C9.7,8.5 10.5,7.95 11.4,7.6C12.3,7.25 13.25,7.1 14.25,7.15C15.25,7.2 16.2,7.45 17.05,7.9C17.9,8.35 18.6,9 19.1,9.8C19.4,10.33 19.5,10.9 19.44,11.46C19.38,12.03 19.13,12.55 18.73,12.96C18.33,13.38 17.81,13.65 17.25,13.73C16.68,13.81 16.11,13.7 15.61,13.42C15.06,13.88 14.41,14.21 13.73,14.36C13.04,14.51 12.33,14.48 11.68,14.26C11.03,14.05 10.46,13.65 10.03,13.13C9.6,12.61 9.34,11.97 9.28,11.3C9.23,10.63 9.38,9.96 9.71,9.36C10.04,8.76 10.55,8.26 11.18,7.91C11.81,7.56 12.53,7.4 13.25,7.43C14.03,7.46 14.78,7.7 15.44,8.13C16.1,8.56 16.65,9.18 17,9.95C17.35,10.72 17.4,11.55 17.15,12.35C16.9,13.15 16.4,13.85 15.7,14.4C15.45,14.24 15.2,14.1 14.95,14C14.7,13.9 14.4,13.85 14.15,13.85C13.9,13.85 13.6,13.9 13.35,14C13.1,14.1 12.85,14.25 12.65,14.45C12.45,14.65 12.3,14.9 12.2,15.15C12.1,15.4 12.05,15.7 12.05,15.95C12.05,16.2 12.1,16.5 12.2,16.75C12.3,17 12.45,17.25 12.65,17.45C12.85,17.65 13.1,17.8 13.35,17.9C13.6,18 13.9,18.05 14.15,18.05C14.4,18.05 14.7,18 14.95,17.9C15.2,17.8 15.45,17.65 15.65,17.45L16.05,17.05Z" /></svg>
);

// New icon for Labor Management
export const UserGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 012.288-2.522M11.644 16.288A3 3 0 1014 13.288m-2.356 3a3 3 0 112.356-3M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

export const ConstructionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" transform="scale(0.8) translate(2, 2)" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" transform="scale(0.5) translate(-12, -12)" />
     <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export const ArrowUpTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" />
    </svg>
);

export const AdjustmentsHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);
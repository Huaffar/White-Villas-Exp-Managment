import React from 'react';

interface HeaderProps {
    pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
    return (
        <header className="bg-gray-800/80 backdrop-blur-sm p-4 sticky top-0 z-10 border-b border-gray-700">
            <div className="container mx-auto flex items-center">
                <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
            </div>
        </header>
    );
};

export default Header;
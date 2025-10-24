
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">White Villas Accounting Pro</h1>
      <div>
        {/* Placeholder for user profile/actions */}
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;

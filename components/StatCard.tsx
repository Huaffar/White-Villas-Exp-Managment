
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string; // This will be a background color class like 'bg-blue-500'
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg flex overflow-hidden">
            <div className={`w-1.5 ${colorClass}`}></div>
            <div className="p-5 flex-grow flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400 font-medium">{title}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
                </div>
                <div className="text-gray-500">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
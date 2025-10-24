
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => {
    return (
        <div className={`bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${colorClass} flex items-center justify-between`}>
            <div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            {icon}
        </div>
    );
};

export default StatCard;

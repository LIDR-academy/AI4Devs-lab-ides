import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

export const StatCard = ({ title, value, color }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <div className={`${color} p-2 rounded-lg bg-opacity-10`}>
            <div className={`w-3 h-3 rounded-full ${color}`} />
          </div>
        </div>
        <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`h-1 ${color}`} />
    </div>
  );
};

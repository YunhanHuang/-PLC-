import React from 'react';

interface InfoCardProps {
  title: string;
  value: string | number;
  unit: string;
  color: string;
  icon?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, unit, color, icon }) => {
  return (
    <div className={`bg-slate-800/80 border-l-4 ${color} p-3 rounded shadow-lg backdrop-blur-sm`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-semibold text-white">{value}</span>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
    </div>
  );
};
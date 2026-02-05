'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  className?: string;
  trend?: string; // Optional trend indicator
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, className, trend }) => {
  return (
    <div className={clsx("neu-flat p-5 flex flex-col items-center justify-center min-w-[120px]", className)}>
      <div className="p-3 rounded-full neu-pressed mb-3 text-purple-400">
        <Icon size={24} />
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-100">{value}</div>
      {trend && <span className="text-xs text-green-400 mt-1">{trend}</span>}
    </div>
  );
};

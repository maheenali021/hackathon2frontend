'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
    icon: LucideIcon;
    title: string;
    onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="neu-btn aspect-square rounded-2xl flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform"
        >
            <Icon size={32} className="mb-2 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">{title}</span>
        </button>
    );
};

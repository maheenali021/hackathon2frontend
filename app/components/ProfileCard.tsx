'use client';

import React from 'react';
import Image from 'next/image';

interface ProfileCardProps {
    name: string;
    email: string;
    avatarUrl?: string; // User avatar if any
    mascotPath: string; // Formatting
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, mascotPath }) => {
    return (
        <div className="neu-flat p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
            <div className="z-10 max-w-md">
                <h2 className="text-3xl font-bold text-white mb-2">Hello, {name}!</h2>
                <p className="text-gray-400 mb-6">Ready to conquer your tasks today?</p>
                <div className="flex space-x-4">
                    <div className="px-4 py-2 neu-pressed rounded-full text-sm text-purple-300">
                        🚀 Productivity: High
                    </div>
                    <div className="px-4 py-2 neu-pressed rounded-full text-sm text-blue-300">
                        🔥 Streak: 5 Days
                    </div>
                </div>
            </div>

            {/* Mascot Container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mt-6 md:mt-0 flex-shrink-0">
                <Image
                    src={mascotPath}
                    alt="Mascot"
                    fill
                    className="object-contain drop-shadow-2xl"
                />
            </div>
        </div>
    );
};

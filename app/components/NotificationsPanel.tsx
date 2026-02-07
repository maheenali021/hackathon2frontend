'use client';

import React from 'react';
import { Bell, Clock, AlertCircle } from 'lucide-react';

export const NotificationsPanel: React.FC = () => {
    return (
        <div className="neu-flat p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-200">Notifications</h3>
                <div className="p-2 neu-pressed rounded-full text-purple-400">
                    <Bell size={20} />
                </div>
            </div>

            <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="mt-1 text-yellow-400">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 font-medium">Task "Design Mockup" is overdue.</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="mt-1 text-blue-400">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 font-medium">Meeting in 30 minutes.</p>
                        <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                    </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/5 transition">
                    <div className="mt-1 text-green-400">
                        <Bell size={18} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 font-medium">System Update: New features added!</p>
                        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

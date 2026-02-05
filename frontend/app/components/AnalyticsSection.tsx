'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Task } from '../../types/task';

interface AnalyticsSectionProps {
    tasks: Task[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ tasks }) => {
    // Calculate weekly data (last 7 days)
    const weeklyData = React.useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return last7Days.map((date, index) => {
            const dayTasks = tasks.filter(task => {
                const taskDate = new Date(task.created_at);
                return taskDate.toDateString() === date.toDateString();
            });

            return {
                name: days[date.getDay()],
                tasks: dayTasks.length,
                completed: dayTasks.filter(t => t.completed).length
            };
        });
    }, [tasks]);

    // Calculate monthly trend (last 4 weeks)
    const trendData = React.useMemo(() => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const today = new Date();

        return weeks.map((week, index) => {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - ((4 - index) * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);

            const weekTasks = tasks.filter(task => {
                const taskDate = new Date(task.created_at);
                return taskDate >= weekStart && taskDate < weekEnd;
            });

            return {
                name: week,
                completed: weekTasks.filter(t => t.completed).length,
                total: weekTasks.length
            };
        });
    }, [tasks]);

    // Calculate pie chart data
    const pieData = React.useMemo(() => {
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.filter(t => !t.completed).length;

        return [
            { name: 'Completed', value: completed },
            { name: 'Pending', value: pending },
        ].filter(item => item.value > 0); // Only show non-zero values
    }, [tasks]);

    const COLORS = ['#7C4DFF', '#B39DDB'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Weekly Activity */}
            <div className="neu-flat p-6 min-h-[300px]">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Weekly Activity</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#292430', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="tasks" fill="#7C4DFF" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Progress */}
            <div className="neu-flat p-6 min-h-[300px]">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Monthly Trends</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#292430', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="completed" stroke="#00E676" strokeWidth={3} dot={{ r: 4 }} name="Completed" />
                            <Line type="monotone" dataKey="total" stroke="#7C4DFF" strokeWidth={2} dot={{ r: 3 }} name="Total" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Task Distribution */}
            <div className="neu-flat p-6 min-h-[300px]">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Task Status</h3>
                <div className="h-64">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#292430', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No tasks yet
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

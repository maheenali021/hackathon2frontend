'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for the charts
const COLORS = ['#6366f1', '#10b981'];

const mockPieData = [
  { name: 'Completed', value: 12 },
  { name: 'Pending', value: 8 },
];

const mockBarData = [
  { day: 'Mon', tasks: 4 },
  { day: 'Tue', tasks: 3 },
  { day: 'Wed', tasks: 6 },
  { day: 'Thu', tasks: 2 },
  { day: 'Fri', tasks: 7 },
  { day: 'Sat', tasks: 1 },
  { day: 'Sun', tasks: 5 },
];

const mockLineData = [
  { week: 'Week 1', tasks: 15 },
  { week: 'Week 2', tasks: 22 },
  { week: 'Week 3', tasks: 18 },
  { week: 'Week 4', tasks: 25 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalTasks: 20,
    completedTasks: 12,
    pendingTasks: 8,
    completionRate: 60,
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your productivity and task completion</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-600">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-600">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-gray-600">Completion Rate</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart - Completed vs Pending */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Completed vs Pending</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Weekly Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Task Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockBarData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Monthly Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Task Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockLineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Tasks Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
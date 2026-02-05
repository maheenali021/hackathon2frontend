'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tasksAPI } from '../../lib/api';
import { Task } from '../../types/task';
import {
  Plus, List, Edit3, CheckSquare,
  LayoutDashboard, Settings, LogOut,
  BarChart2, Calendar, Target, Zap, CheckCircle
} from 'lucide-react';
import { ProfileCard } from '../components/ProfileCard';
import { ActionCard } from '../components/ActionCard';
import { StatCard } from '../components/StatCard';
import { AnalyticsSection } from '../components/AnalyticsSection';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { Chatbot } from '../components/Chatbot';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    // Check for auth token and decode it
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Decode JWT to get user info
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      if (payload.user_id) {
        setUserId(payload.user_id);
        localStorage.setItem('user_id', payload.user_id);
      }

      if (payload.email) {
        setUserEmail(payload.email);
        // Extract name from email (before @)
        const nameFromEmail = payload.email.split('@')[0];
        setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      // Fallback
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const data = await tasksAPI.getAll(userId);
      setTasks(data);
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (title: string, description: string) => {
    if (!userId) return;
    try {
      if (editingTask) {
        // Update existing task
        const updated = await tasksAPI.update(userId, editingTask.id, { title, description } as any);
        setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
      } else {
        // Create new task
        const newTask = await tasksAPI.create(userId, { title, description } as any);
        setTasks([...tasks, newTask]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save task");
    }
  };

  const handleToggle = async (id: string) => {
    if (!userId) return;
    try {
      const updated = await tasksAPI.toggleComplete(userId, id);
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: updated.completed } : t));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    try {
      await tasksAPI.delete(userId, id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (e) { console.error(e); }
  };

  // Calculate real statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    today: tasks.filter(t => {
      const today = new Date();
      const taskDate = new Date(t.created_at);
      return taskDate.toDateString() === today.toDateString();
    }).length,
    streak: calculateStreak(tasks)
  };

  // Calculate productivity streak (consecutive days with completed tasks)
  function calculateStreak(tasks: Task[]): number {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return 0;

    const dates = completedTasks.map(t => new Date(t.updated_at).toDateString());
    const uniqueDates = [...new Set(dates)].sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      if (uniqueDates[i] === checkDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  if (loading) return <div className="min-h-screen bg-[#1F1B24] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#1F1B24] text-white font-sans selection:bg-purple-500/30">

      {/* Sidebar - Desktop */}
      <aside className="w-64 hidden md:flex flex-col p-6 border-r border-white/5 bg-[#1F1B24]">
        <div className="flex items-center space-x-3 text-purple-400 mb-10 pl-2">
          <CheckSquare size={32} />
          <span className="text-xl font-bold tracking-wide text-white">TaskEvo</span>
        </div>

        <nav className="space-y-4 flex-1">
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/10">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 transition" onClick={() => document.getElementById('task-list')?.scrollIntoView({ behavior: 'smooth' })}>
            <List size={20} />
            <span>My Tasks</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 transition">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 transition">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            router.push('/auth/login');
          }}
          className="flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl mt-auto transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-[#1F1B24]">

        {/* Profile Section */}
        <div className="mb-8">
          <ProfileCard
            name={userName}
            email={userEmail || 'user@taskevo.com'}
            mascotPath="/mascot.png"
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ActionCard icon={Plus} title="Add Task" onClick={openCreateModal} />
          <ActionCard icon={List} title="View All" onClick={() => document.getElementById('task-list')?.scrollIntoView({ behavior: 'smooth' })} />
          <ActionCard icon={Edit3} title="Edit Tasks" onClick={() => document.getElementById('task-list')?.scrollIntoView({ behavior: 'smooth' })} />
          <ActionCard icon={CheckCircle} title="Mark Done" onClick={() => document.getElementById('task-list')?.scrollIntoView({ behavior: 'smooth' })} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard icon={List} title="Total Tasks" value={stats.total} />
          <StatCard icon={CheckCircle} title="Completed" value={stats.completed} />
          <StatCard icon={Target} title="Pending" value={stats.pending} />
          <StatCard icon={Calendar} title="Today" value={stats.today} />
          <StatCard icon={Zap} title="Streak" value={stats.streak} trend={stats.streak > 0 ? `${stats.streak} days` : undefined} />
        </div>

        {/* Analytics & Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <AnalyticsSection tasks={tasks} />
          </div>
          <div className="lg:col-span-1">
            <NotificationsPanel />
          </div>
        </div>

        {/* Task List */}
        <div className="mb-8" id="task-list">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Your Tasks</h2>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="neu-concave p-10 text-center text-gray-500 rounded-xl">
                No tasks yet. Click 'Add Task' to get started!
              </div>
            ) : tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleAction={handleToggle}
                onDeleteAction={handleDelete}
                onEditAction={openEditModal}
              />
            ))}
          </div>
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      {/* AI Chatbot */}
      {userId && (
        <Chatbot
          userId={userId}
          onTaskChangeAction={fetchTasks}
        />
      )}
    </div>
  );
}
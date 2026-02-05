'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Task } from '../../types/task';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, description: string) => Promise<void>;
    task?: Task; // If provided, we are editing
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
        } else {
            setTitle('');
            setDescription('');
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await onSave(title, description);
            onClose();
        } catch (error) {
            console.error(error);
            // Could show error state here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="neu-flat p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                    {task ? 'Edit Task' : 'New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="neu-input"
                            placeholder="What needs to be done?"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="neu-input min-h-[100px] resize-none"
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="neu-btn-primary px-6 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving...' : 'Save Task'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

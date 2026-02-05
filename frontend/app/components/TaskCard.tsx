'use client';

import React from 'react';
import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Task } from '../../types/task';
import clsx from 'clsx';

interface TaskCardProps {
    task: Task;
    onToggleAction: (id: string) => void;
    onDeleteAction: (id: string) => void;
    onEditAction: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleAction, onDeleteAction, onEditAction }) => {
    return (
        <div className={clsx(
            "p-5 rounded-2xl mb-4 transition-all duration-300",
            task.completed ? "neu-pressed opacity-70" : "neu-flat"
        )}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <button
                        onClick={() => onToggleAction(task.id)}
                        className="mt-1 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                    </button>
                    <div>
                        <h4 className={clsx(
                            "text-lg font-medium mb-1",
                            task.completed ? "line-through text-gray-500" : "text-gray-200"
                        )}>
                            {task.title}
                        </h4>
                        {task.description && (
                            <p className="text-gray-400 text-sm">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-3">
                            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
                                {new Date(task.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => onEditAction(task)}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-blue-400 transition"
                        disabled={task.completed}
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDeleteAction(task.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

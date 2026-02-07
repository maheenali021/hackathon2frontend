'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatbotProps {
    userId: string;
    onTaskChangeAction?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ userId, onTaskChangeAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        };
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    // Load conversation history when component mounts or user opens chat
    useEffect(() => {
        if (userId && isInitializing) {
            fetchHistory();
        }
    }, [userId]);

    const fetchHistory = async () => {
        try {
            // First, get conversations
            const convRes = await fetch(`${API_BASE_URL}/chat/conversations/${userId}`, {
                headers: getAuthHeaders()
            });

            if (!convRes.ok) throw new Error('Failed to fetch conversations');
            const conversations = await convRes.json();

            if (conversations && conversations.length > 0) {
                // Get messages for the most recent conversation
                const msgRes = await fetch(`${API_BASE_URL}/chat/conversations/${conversations[0].id}/messages`, {
                    headers: getAuthHeaders()
                });

                if (!msgRes.ok) throw new Error('Failed to fetch messages');
                const history = await msgRes.json();
                setMessages(history);
            } else {
                // Initial greeting if no history
                setMessages([
                    {
                        role: 'assistant',
                        content: 'Hi! I\'m your AI task assistant. I can help you add, list, complete, or delete tasks using natural language. Just ask me something like "Add buy milk" or "What are my pending tasks?"',
                        timestamp: new Date().toISOString()
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        } finally {
            setIsInitializing(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessageContent = input;
        const userMessage: Message = {
            role: 'user',
            content: userMessageContent,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Find current conversation ID if any
            const convRes = await fetch(`${API_BASE_URL}/chat/conversations/${userId}`, {
                headers: getAuthHeaders()
            });
            const conversations = await convRes.json();
            const currentConvId = (conversations && conversations.length > 0) ? conversations[0].id : undefined;

            // Call the real agent API
            const response = await fetch(`${API_BASE_URL}/chat/${userId}?message=${encodeURIComponent(userMessageContent)}${currentConvId ? `&conversation_id=${currentConvId}` : ''}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Notify parent to refresh tasks
            if (onTaskChangeAction) {
                onTaskChangeAction();
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I\'m sorry, I encountered an error connecting to the agent. Please make sure the backend is running.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!userId) return null;

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 rounded-full neu-btn-primary shadow-2xl hover:scale-110 transition-transform z-50 group"
                    aria-label="Open chat"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
                    </span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed bottom-6 right-6 neu-flat rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden transition-all duration-300",
                        isMaximized ? "w-[calc(100vw-48px)] h-[calc(100vh-48px)]" : "w-96 h-[600px]"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-purple-600/20">
                                <MessageCircle size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-tight">AI Task Assistant</h3>
                                <div className="flex items-center space-x-1.5">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Online</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => setIsMaximized(!isMaximized)}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400"
                            >
                                {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex animate-in fade-in slide-in-from-bottom-2",
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                <div
                                    className={cn(
                                        "max-w-[85%] p-4 rounded-2xl shadow-lg relative",
                                        message.role === 'user'
                                            ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-br-none'
                                            : 'neu-pressed text-gray-200 rounded-bl-none border border-white/5'
                                    )}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    <p className={cn(
                                        "text-[10px] mt-2 font-medium opacity-50",
                                        message.role === 'user' ? 'text-right' : 'text-left'
                                    )}>
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in">
                                <div className="neu-pressed p-4 rounded-2xl rounded-bl-none">
                                    <div className="flex space-x-1.5">
                                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <div className="flex items-end space-x-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me to 'Add buy milk'..."
                                    rows={1}
                                    className="w-full bg-[#1A1621] border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none transition-all duration-200 min-h-[46px] max-h-32"
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="p-3 neu-btn-primary rounded-xl disabled:opacity-50 disabled:grayscale transition-all duration-200"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-500 mt-3 font-medium tracking-tight">
                            Powered by OpenRouter Trinity Large & MCP
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

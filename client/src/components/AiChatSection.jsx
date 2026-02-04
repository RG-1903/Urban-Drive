import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Icon from './AppIcon';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const API_URL = 'http://localhost:8080/api/v1';

const AiChatSection = ({ className }) => {
    const { user, isAuthenticated } = useAuth();

    // --- Robust loader for initial messages ---
    const getInitialMessages = () => {
        const userName = user?.firstName || '';
        const greeting = userName
            ? `Hi ${userName}! How can I assist you with your luxury car rental needs today?`
            : "Hello! I'm UrbanDrive's AI Assistant. How can I help you today?";

        const defaultMessages = [
            {
                from: 'ai',
                text: greeting,
            },
        ];

        try {
            if (typeof window === 'undefined' || !window.sessionStorage) {
                return defaultMessages;
            }

            const saved = sessionStorage.getItem('aiChatHistory');
            if (!saved) return defaultMessages;

            const parsed = JSON.parse(saved);

            // Validate basic shape of the stored messages
            if (
                Array.isArray(parsed) &&
                parsed.length > 0 &&
                parsed[0] &&
                typeof parsed[0].from === 'string' &&
                typeof parsed[0].text === 'string'
            ) {
                return parsed;
            }

            console.warn('Invalid chat history found in sessionStorage. Resetting.');
            try {
                sessionStorage.removeItem('aiChatHistory');
            } catch (removeErr) {
                console.error('Failed to clear invalid chat history:', removeErr);
            }
            return defaultMessages;
        } catch (e) {
            // If JSON.parse fails, or sessionStorage is blocked, reset to defaults
            console.error('Error loading chat history:', e);
            try {
                sessionStorage.removeItem('aiChatHistory');
            } catch (removeErr) {
                console.error('Failed to clear chat history after error:', removeErr);
            }
            return defaultMessages;
        }
    };

    const [messages, setMessages] = useState(getInitialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef(null);

    // Persist chat history safely
    useEffect(() => {
        try {
            if (typeof window === 'undefined' || !window.sessionStorage) return;
            const validMessages = messages.filter(
                (msg) => msg && typeof msg.from === 'string' && typeof msg.text === 'string'
            );
            sessionStorage.setItem('aiChatHistory', JSON.stringify(validMessages));
        } catch (error) {
            console.error('Failed to persist chat history:', error);
        }
    }, [messages]);

    // Auto scroll to bottom on new message
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // Clear chat history
    const clearChat = () => {
        const userName = user?.firstName || '';
        const greeting = userName
            ? `Hi ${userName}! How can I assist you with your luxury car rental needs today?`
            : "Hello! I'm UrbanDrive's AI Assistant. How can I help you today?";

        setMessages([
            {
                from: 'ai',
                text: greeting,
            },
        ]);
        try {
            if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.removeItem('aiChatHistory');
            }
        } catch (error) {
            console.error('Failed to clear chat history:', error);
        }
    };

    // Send message to AI
    const handleSend = async () => {
        if (input.trim() === '' || !isAuthenticated || isLoading) return;

        const currentInput = input.trim();
        const userMessage = { from: 'user', text: currentInput };

        const currentChatHistory = [...messages];
        setMessages((prev) => [...prev, userMessage]);

        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/ai/chat`, {
                prompt: currentInput,
                chatHistory: currentChatHistory,
                userName: user?.firstName || ''
            });

            const aiResponse = response?.data?.data?.reply ??
                "Sorry, I couldn't generate a response just now.";

            // Ensure the AI reply includes the user's name when authenticated
            let finalResponse = aiResponse;
            if (isAuthenticated && user?.firstName) {
                const nameLower = user.firstName.toLowerCase();
                if (!aiResponse.toLowerCase().includes(nameLower)) {
                    finalResponse = `Hi ${user.firstName}! ${aiResponse}`;
                }
            }

            setMessages((prev) => [...prev, { from: 'ai', text: finalResponse }]);
        } catch (err) {
            console.error('AI API Error:', err);
            let errorMessage = "Sorry, I'm having trouble connecting right now.";

            if (err.response?.status === 401) {
                errorMessage = 'Please sign in to use the AI Assistant.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setMessages((prev) => [...prev, { from: 'ai', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <motion.div
            key="ai-chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={cn("bg-white rounded-2xl border border-border shadow-premium flex flex-col max-h-[500px] overflow-hidden", className)}
        >
            {/* Header */}
            <div
                className={cn(
                    "p-6 border-b border-border flex justify-between items-center flex-shrink-0"
                )}
            >
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <Icon name="Sparkles" size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-primary">AI Assistant</h3>
                        <p className="text-sm text-text-secondary">Powered by Urban AI</p>
                    </div>
                </div>
                <motion.button
                    onClick={clearChat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex flex-row items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary bg-transparent border-2 border-border hover:border-black hover:bg-black hover:text-red-500 rounded-2xl transition-all duration-300 overflow-hidden"
                >
                    <span className="whitespace-nowrap">Clear Chat</span>
                    <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{
                            rotate: [0, -12, 12, -12, 0],
                            scale: [1, 1.2, 1.2, 1.2, 1]
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="flex-shrink-0"
                    >
                        <Icon name="Trash2" size={16} className="group-hover:text-red-500 transition-colors" />
                    </motion.div>
                </motion.button>
            </div>

            {/* Chat Window */}
            <div
                ref={chatRef}
                className="p-6 flex-1 overflow-y-auto space-y-4 bg-secondary/50"
            >
                {Array.isArray(messages) &&
                    messages
                        .filter(
                            (msg) => msg && typeof msg.from === 'string' && typeof msg.text === 'string'
                        )
                        .map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    'flex items-start gap-3',
                                    msg.from === 'user' ? 'justify-end' : ''
                                )}
                            >
                                {msg.from === 'ai' && (
                                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon name="Sparkles" size={16} className="text-accent" />
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        'p-3 rounded-xl max-w-sm',
                                        msg.from === 'ai'
                                            ? 'bg-white border border-border'
                                            : 'bg-primary text-primary-foreground'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'text-sm leading-relaxed prose prose-sm',
                                            msg.from === 'user' && 'prose-invert'
                                        )}
                                    >
                                        <ReactMarkdown>
                                            {String(msg.text || '')}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {msg.from === 'user' && (
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon name="User" size={16} className="text-primary" />
                                    </div>
                                )}
                            </motion.div>
                        ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-3"
                    >
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                            <Icon name="Sparkles" size={16} className="text-accent" />
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-border flex items-center gap-2">
                            <Icon
                                name="Loader2"
                                size={16}
                                className="animate-spin text-text-secondary"
                            />
                            <span className="text-sm text-text-secondary">Thinking...</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t border-border flex-shrink-0">
                <div className="relative flex items-center bg-gray-100 rounded-full px-2 py-1 border border-gray-200 focus-within:border-black/10 focus-within:bg-white focus-within:shadow-md transition-all duration-300 group">
                    <input
                        type="text"
                        placeholder={
                            !isAuthenticated
                                ? 'Please sign in to use the AI Assistant'
                                : 'Type your message...'
                        }
                        className="flex-1 bg-transparent border-none outline-none shadow-none ring-0 focus:ring-0 px-4 h-10 text-base text-primary placeholder:text-muted-foreground/60"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        disabled={!isAuthenticated || isLoading}
                    />
                    <Button
                        size="icon"
                        className={cn(
                            "h-10 w-10 rounded-full shrink-0 transition-all duration-300 flex items-center justify-center",
                            input.trim()
                                ? "bg-black text-white shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95"
                                : "bg-gray-800 text-gray-400"
                        )}
                        onClick={handleSend}
                        disabled={!input.trim() || !isAuthenticated || isLoading}
                    >
                        <AnimatePresence mode='wait'>
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                >
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="send"
                                    initial={{ x: 0, y: 0, scale: 1 }}
                                    whileHover={{ rotate: -10 }}
                                    whileTap={{ x: 2, y: -2 }}
                                >
                                    <Icon name="Send" size={18} className={input.trim() ? "ml-0.5" : ""} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
                <p className="text-xs text-text-secondary mt-3 text-center">
                    The AI assistant can help with booking questions, policies, and general support.
                </p>
            </div>
        </motion.div>
    );
};

export default AiChatSection;

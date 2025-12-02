"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/app/page";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DynamicForm from "./DynamicForm";


interface ChatPanelProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    onSave: () => void;
    onRevealSolution: () => void;
    isTyping: boolean;
    mode: "interview" | "solution" | "review";
    onModeChange: (mode: "interview" | "solution" | "review") => void;
}

export default function ChatPanel({ messages, onSendMessage, onSave, onRevealSolution, isTyping, mode, onModeChange }: ChatPanelProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [submittedForms, setSubmittedForms] = useState<Set<number>>(new Set());


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFormSubmit = (messageIndex: number, values: Record<string, string>) => {
        // Format the form values into a readable message
        const formattedMessage = Object.entries(values)
            .map(([key, value]) => {
                // Convert field ID to readable label (e.g., "num_users" -> "Number of users")
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return `**${label}**: ${value}`;
            })
            .join('\n');

        // Mark this form as submitted
        setSubmittedForms(prev => new Set(prev).add(messageIndex));

        // Send the formatted message
        onSendMessage(formattedMessage);
    };


    return (
        <div className="flex flex-col h-full bg-neutral-900">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-white">SysMind</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <button
                            onClick={() => onModeChange("solution")}
                            className={cn(
                                "text-xs px-2 py-1 rounded transition-colors",
                                mode === "solution" ? "bg-purple-600 text-white" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            Solution
                        </button>
                        <button
                            disabled
                            className="text-xs px-2 py-1 rounded transition-colors text-neutral-600 cursor-not-allowed border border-transparent"
                            title="Coming Soon"
                        >
                            Interview (Coming Soon)
                        </button>
                        <button
                            disabled
                            className="text-xs px-2 py-1 rounded transition-colors text-neutral-600 cursor-not-allowed border border-transparent"
                            title="Coming Soon"
                        >
                            Review (Coming Soon)
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    {mode === "interview" && (
                        <button
                            onClick={onRevealSolution}
                            className="text-xs px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-colors border border-green-600/30"
                        >
                            Reveal Solution
                        </button>
                    )}
                    <button
                        onClick={onSave}
                        className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors border border-neutral-700"
                    >
                        Save Session
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex gap-3 max-w-[90%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === "user" ? "bg-blue-600" : "bg-purple-600"
                            )}
                        >
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div
                            className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed overflow-hidden",
                                msg.role === "user"
                                    ? "bg-blue-600/20 text-blue-100 rounded-tr-sm"
                                    : "bg-neutral-800 text-neutral-200 rounded-tl-sm"
                            )}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0" {...props} />,
                                    code: ({ node, ...props }) => <code className="bg-neutral-900 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                                    pre: ({ node, ...props }) => <pre className="bg-neutral-900 p-2 rounded mb-2 overflow-x-auto text-xs" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>

                            {/* Render dynamic form if present and not yet submitted */}
                            {msg.role === "ai" && msg.form && !submittedForms.has(idx) && (
                                <div className="mt-3">
                                    <DynamicForm
                                        formData={msg.form}
                                        onSubmit={(values) => handleFormSubmit(idx, values)}
                                    />
                                </div>
                            )}

                            {/* Show submitted indicator if form was submitted */}
                            {msg.role === "ai" && msg.form && submittedForms.has(idx) && (
                                <div className="mt-2 text-xs text-neutral-500 italic">
                                    Form submitted ✓
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your answer..."
                        className="w-full bg-neutral-800 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-[60px] text-sm scrollbar-hide"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-3 top-3 p-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

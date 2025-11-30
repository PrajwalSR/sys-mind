"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/app/page";

interface ChatPanelProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    onSave: () => void;
    isTyping: boolean;
}

export default function ChatPanel({ messages, onSendMessage, onSave, isTyping }: ChatPanelProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    return (
        <div className="flex flex-col h-full bg-neutral-900">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-white">SysMind Interviewer</h2>
                    <p className="text-sm text-neutral-400">System Design Challenge</p>
                </div>
                <button
                    onClick={onSave}
                    className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md transition-colors border border-neutral-700"
                >
                    Save Session
                </button>
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
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-blue-600/20 text-blue-100 rounded-tr-sm"
                                    : "bg-neutral-800 text-neutral-200 rounded-tl-sm"
                            )}
                        >
                            {msg.content}
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

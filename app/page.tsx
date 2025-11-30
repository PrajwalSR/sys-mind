"use client";

import { useState, useRef, useEffect } from "react";
import ChatPanel from "@/components/ChatPanel";
import DiagramPanel from "@/components/DiagramPanel";
import { saveSession } from "@/lib/db";

export type Message = {
  role: "user" | "ai";
  content: string;
};

const INITIAL_DIAGRAM = `
graph TD
    Start[Start Interview] --> Topic{Select Topic}
`;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm SysMind. I'm here to conduct a System Design mock interview with you. To get started, please tell me what topic you'd like to design (e.g., 'Design Instagram', 'Design a URL Shortener')." }
  ]);
  const [diagramCode, setDiagramCode] = useState(INITIAL_DIAGRAM);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      const aiMsg: Message = {
        role: "ai",
        content: data.message
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.diagram) {
        setDiagramCode(data.diagram);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Fallback error message
      setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveSession = async () => {
    try {
      await saveSession({
        topic: "System Design Interview", // Ideally extract from chat
        messages,
        diagram_code: diagramCode,
      });
      alert("Session saved! (Check console if no Supabase keys)");
    } catch (error) {
      alert("Failed to save session.");
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-black">
      {/* Left Panel: Chat (40% width) */}
      <div className="w-[40%] h-full min-w-[350px] border-r border-neutral-800">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onSave={handleSaveSession}
          isTyping={isTyping}
        />
      </div>

      {/* Right Panel: Diagram (60% width) */}
      <div className="flex-1 h-full">
        <DiagramPanel code={diagramCode} />
      </div>
    </main>
  );
}

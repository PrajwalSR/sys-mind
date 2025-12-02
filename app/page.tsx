"use client";

import { useState, useRef, useEffect } from "react";
import ChatPanel from "@/components/ChatPanel";
import DiagramPanel from "@/components/DiagramPanel";
import { saveSession } from "@/lib/db";
import { FormData } from "@/components/DynamicForm";

export type Message = {
  role: "user" | "ai";
  content: string;
  form?: FormData;
};

const INITIAL_DIAGRAM = `
graph LR
    Start["Welcome to SysMind"] --> Input{"Describe System"}
    Input -->|Chat with AI| Design["Architecture Created"]
    Design -->|Click Visualize| Diagram["Live Diagram Generated"]
    style Start fill:#1e1e1e,stroke:#333,color:#fff
    style Input fill:#1e1e1e,stroke:#333,color:#fff
    style Design fill:#1e1e1e,stroke:#333,color:#fff
    style Diagram fill:#2563eb,stroke:#1d4ed8,color:#fff
`;

export default function Home() {
  const [mode, setMode] = useState<"interview" | "solution" | "review">("solution");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm SysMind, your Senior Principal Architect. I'm here to help you design a scalable, reliable system. Tell me what you want to build (e.g., 'Design Instagram', 'Design a URL Shortener'), and I'll lead the architecture." }
  ]);
  const [diagramCode, setDiagramCode] = useState(INITIAL_DIAGRAM);
  const [isTyping, setIsTyping] = useState(false);

  const handleModeChange = (newMode: "interview" | "solution" | "review") => {
    setMode(newMode);

    let greeting = "";
    if (newMode === "interview") {
      greeting = "Switched to Interview Mode. I'm here to test your skills. What topic shall we cover?";
    } else if (newMode === "solution") {
      greeting = "Switched to Solution Mode. I'm here to help you design a system. Tell me what you want to build, and I'll lead the architecture.";
    } else {
      greeting = "Switched to Review Mode. Describe your existing system or architecture, and I'll visualize it and point out any potential flaws.";
    }

    setMessages([{ role: "ai", content: greeting }]);
    setDiagramCode(INITIAL_DIAGRAM);
  };

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
        body: JSON.stringify({ messages: newMessages, mode }), // Pass mode here
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      const aiMsg: Message = {
        role: "ai",
        content: data.message,
        form: data.form // Include form data if present
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

  const handleRevealSolution = async () => {
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, action: "solution", mode }), // Pass mode here
      });

      if (!response.ok) throw new Error("Failed to get solution");

      const data = await response.json();
      const aiMsg: Message = { role: "ai", content: data.message };
      setMessages((prev) => [...prev, aiMsg]);
      if (data.diagram) setDiagramCode(data.diagram);
    } catch (error) {
      console.error("Error getting solution:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateDiagram = async () => {
    // Don't trigger if already typing
    if (isTyping) return;

    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, action: "generate_diagram", mode }),
      });

      if (!response.ok) throw new Error("Failed to generate diagram");

      const data = await response.json();
      // We don't add a message for diagram generation, just update the diagram
      if (data.diagram) setDiagramCode(data.diagram);
    } catch (error) {
      console.error("Error generating diagram:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExplainComponent = async (componentName: string) => {
    // Don't trigger if already typing
    if (isTyping) return;

    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, action: "explain", component: componentName, mode }), // Pass mode here
      });

      if (!response.ok) throw new Error("Failed to explain component");

      const data = await response.json();
      const aiMsg: Message = { role: "ai", content: data.message };
      setMessages((prev) => [...prev, aiMsg]);
      // We don't necessarily need to update the diagram for an explanation, but if the AI returns one, we can.
      if (data.diagram) setDiagramCode(data.diagram);
    } catch (error) {
      console.error("Error explaining component:", error);
    } finally {
      setIsTyping(false);
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
          onRevealSolution={handleRevealSolution}
          isTyping={isTyping}
          mode={mode}
          onModeChange={handleModeChange}
        />
      </div>

      {/* Right Panel: Diagram (60% width) */}
      <div className="w-[60%] h-full min-w-[500px]">
        <DiagramPanel
          code={diagramCode}
          onNodeClick={handleExplainComponent}
          onGenerateDiagram={handleGenerateDiagram}
          isTyping={isTyping}
        />
      </div>
    </main>
  );
}

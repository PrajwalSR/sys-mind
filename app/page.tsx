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

const INITIAL_DIAGRAM = "";

export default function Home() {
  const [mode, setMode] = useState<"interview" | "solution" | "review">("solution");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm SysMind, your Senior Principal Architect. I'm here to help you design a scalable, reliable system. Tell me what you want to build (e.g., 'Design Instagram', 'Design a URL Shortener'), and I'll lead the architecture." }
  ]);
  const [diagramCode, setDiagramCode] = useState(INITIAL_DIAGRAM);
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cloudProvider, setCloudProvider] = useState<'aws' | 'gcp' | 'azure' | undefined>(undefined);

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

  const handleSendMessage = async (content: string, cloudProvider?: string) => {
    // Update cloud provider from form submission if provided
    // This ensures diagrams use the correct cloud-specific icons
    if (cloudProvider) {
      const normalized = cloudProvider.toLowerCase().includes('gcp') ? 'gcp'
        : cloudProvider.toLowerCase().includes('azure') ? 'azure'
        : 'aws';
      setCloudProvider(normalized as 'aws' | 'gcp' | 'azure');
    }

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

      // Update diagram if draw.io XML is returned
      if (data.diagram && typeof data.diagram === 'string' && data.diagram.trim()) {
        setDiagramCode(data.diagram);
      }

      // Update cloud provider if detected
      if (data.cloudProvider) {
        setCloudProvider(data.cloudProvider);
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

      if (data.diagram && typeof data.diagram === 'string' && data.diagram.trim()) {
        setDiagramCode(data.diagram);
      }

      if (data.cloudProvider) {
        setCloudProvider(data.cloudProvider);
      }
    } catch (error) {
      console.error("Error getting solution:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateDiagram = async () => {
    // Don't trigger if already generating
    if (isGenerating) return;

    setIsGenerating(true);
    setRetryCount(0); // Reset retry count for new generation
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, action: "generate_diagram", mode }),
      });

      if (!response.ok) throw new Error("Failed to generate diagram");

      const data = await response.json();
      // We don't add a message for diagram generation, just update the diagram
      if (data.diagram && typeof data.diagram === 'string' && data.diagram.trim()) {
        setDiagramCode(data.diagram);
      }

      if (data.cloudProvider) {
        setCloudProvider(data.cloudProvider);
      }
    } catch (error) {
      console.error("Error generating diagram:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Self-healing diagram repair with intelligent retry logic
   * - Attempts up to 3 retries with validation
   * - Offers progressive fallback to text-based architecture
   * - Validates fixes to ensure they actually resolve issues
   */
  const handleFixDiagram = async (brokenXml: string, error: string) => {
    // Allow up to 3 retry attempts before offering fallback
    if (retryCount >= 3) {
      const offerTextFallback = confirm(
        "Diagram generation failed after 3 attempts. Would you like a text-based architecture description instead?"
      );

      if (offerTextFallback) {
        handleRequestTextArchitecture();
      }
      return;
    }

    setIsRegenerating(true);
    setRetryCount(prev => prev + 1);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          action: "fix_diagram",
          brokenXml,
          errorMessage: error,
          mode
        }),
      });

      if (!response.ok) throw new Error("Failed to fix diagram");

      const data = await response.json();
      if (data.diagram && typeof data.diagram === 'string' && data.diagram.trim()) {
        // Validate fix: must be different from broken XML and contain required structure
        const isValidFix = data.diagram !== brokenXml &&
                          data.diagram.includes('<mxGraphModel>');

        if (isValidFix) {
          setDiagramCode(data.diagram);
          setRetryCount(0); // Reset on success
        } else {
          // Fix didn't actually work, retry again if attempts remain
          if (retryCount < 2) {
            console.warn(`Retry ${retryCount + 1} failed validation, retrying...`);
            setIsRegenerating(false);
            setTimeout(() => handleFixDiagram(brokenXml, error), 100);
          } else {
            alert("Diagram repair failed after multiple attempts. Please try refreshing the page.");
          }
        }
      } else {
        // If AI couldn't fix it and we have retries left, try again
        if (retryCount < 2) {
          console.warn(`Retry ${retryCount + 1} returned empty diagram, retrying...`);
          setIsRegenerating(false);
          setTimeout(() => handleFixDiagram(brokenXml, error), 100);
        } else {
          alert("Diagram repair failed. Please try refreshing the page.");
        }
      }
    } catch (error) {
      console.error("Error fixing diagram:", error);
      alert("Diagram repair failed. Please try refreshing the page.");
    } finally {
      setIsRegenerating(false);
    }
  };

  /**
   * Progressive fallback: Request text-based architecture description
   * Called when diagram generation fails after all retry attempts
   */
  const handleRequestTextArchitecture = async () => {
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, {
            role: "user",
            content: "The diagram is having issues. Please provide a detailed text-based architecture description instead."
          }],
          mode
        }),
      });

      if (!response.ok) throw new Error("Failed to get text architecture");

      const data = await response.json();
      const aiMsg: Message = { role: "ai", content: data.message };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error getting text architecture:", error);
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
      if (data.diagram && typeof data.diagram === 'string' && data.diagram.trim()) {
        setDiagramCode(data.diagram);
      }
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
          onCodeChange={setDiagramCode}
          onGenerateDiagram={handleGenerateDiagram}
          onFixDiagram={handleFixDiagram}
          isTyping={isTyping}
          isGenerating={isGenerating}
          isRegenerating={isRegenerating}
          cloudProvider={cloudProvider}
          retryCount={retryCount}
        />
      </div>
    </main>
  );
}

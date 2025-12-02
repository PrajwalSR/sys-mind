"use client";

import MermaidDiagram from "./MermaidDiagram";
import { cn } from "@/lib/utils";

interface DiagramPanelProps {
    code: string;
    onNodeClick?: (nodeId: string) => void;
    onGenerateDiagram?: () => void;
    isTyping?: boolean;
}

export default function DiagramPanel({ code, onNodeClick, onGenerateDiagram, isTyping }: DiagramPanelProps) {
    return (
        <div className="flex flex-col h-full bg-neutral-950">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                <h2 className="text-lg font-semibold text-white">Live Whiteboard</h2>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={onGenerateDiagram}
                        disabled={isTyping}
                        className={cn(
                            "text-xs px-3 py-1.5 rounded-md transition-colors border flex items-center gap-2",
                            isTyping
                                ? "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
                                : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
                        )}
                    >
                        {isTyping ? "Generating..." : "Visualize"}
                    </button>
                </div>
            </div>

            {/* Diagram Canvas */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 p-4">
                    <MermaidDiagram code={code} onNodeClick={onNodeClick} />
                </div>
            </div>

            {/* Footer / Attribution */}
            <div className="p-2 border-t border-neutral-800 bg-neutral-900/50 text-center">
                <p className="text-[10px] text-neutral-500">
                    Built with <span className="text-neutral-400 font-medium">Google Antigravity</span> and <span className="text-neutral-400 font-medium">Vertex AI</span>
                </p>
            </div>
        </div>
    );
}

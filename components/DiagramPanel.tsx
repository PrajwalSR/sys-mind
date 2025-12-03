"use client";

import MermaidDiagram from "./MermaidDiagram";
import { cn } from "@/lib/utils";

interface DiagramPanelProps {
    code: string;
    onNodeClick?: (nodeId: string) => void;
    onGenerateDiagram?: () => void;
    isTyping?: boolean;
    isGenerating?: boolean;
}

export default function DiagramPanel({ code, onNodeClick, onGenerateDiagram, isTyping, isGenerating }: DiagramPanelProps) {
    return (
        <div className="flex flex-col h-full bg-neutral-950">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                <h2 className="text-lg font-semibold text-white">Live Whiteboard</h2>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={onGenerateDiagram}
                        disabled={isGenerating || isTyping}
                        className={cn(
                            "text-xs px-3 py-1.5 rounded-md transition-colors border flex items-center gap-2",
                            (isGenerating || isTyping)
                                ? "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
                                : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
                        )}
                    >
                        {isGenerating ? "Generating..." : "Visualize"}
                    </button>
                </div>
            </div>

            {/* Diagram Canvas */}
            <div className="flex-1 overflow-hidden relative bg-neutral-950">
                <div className="absolute inset-0 p-4">
                    {code ? (
                        <MermaidDiagram code={code} onNodeClick={onNodeClick} />
                    ) : (
                        !isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                                <p className="text-sm">Click 'Visualize' to generate the architecture diagram</p>
                            </div>
                        )
                    )}
                </div>

                {/* Loading Overlay */}
                {isGenerating && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-blue-400 font-medium animate-pulse">Building Architecture...</p>
                    </div>
                )}
            </div>

            {/* Footer / Attribution */}
            <div className="p-2 border-t border-neutral-800 bg-neutral-900/50 text-center relative">
                <p className="text-[10px] text-neutral-500">
                    Built with <span className="text-neutral-400 font-medium">Google Antigravity</span> and <span className="text-neutral-400 font-medium">Vertex AI</span>
                </p>
            </div>
        </div>
    );
}

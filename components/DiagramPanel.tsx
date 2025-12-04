"use client";

import { useState } from "react";
import DrawioDiagram from "./DrawioDiagram";
import { cn } from "@/lib/utils";
import { Eye, Pencil } from "lucide-react";

interface DiagramPanelProps {
    code: string;
    onCodeChange?: (newCode: string) => void;
    onGenerateDiagram?: () => void;
    onFixDiagram?: (brokenXml: string, error: string) => void;
    isTyping?: boolean;
    isGenerating?: boolean;
    isRegenerating?: boolean;
    cloudProvider?: 'aws' | 'gcp' | 'azure';
    retryCount?: number;
}

export default function DiagramPanel({
    code,
    onCodeChange,
    onGenerateDiagram,
    onFixDiagram,
    isTyping,
    isGenerating,
    isRegenerating,
    cloudProvider,
    retryCount = 0
}: DiagramPanelProps) {
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');

    const handleDiagramError = (error: string, brokenXml: string) => {
        console.error('Diagram error:', error);
        if (onFixDiagram) {
            onFixDiagram(brokenXml, error);
        }
    };

    const handleXmlChange = (newXml: string) => {
        if (onCodeChange) {
            onCodeChange(newXml);
        }
    };

    return (
        <div className="flex flex-col h-full bg-neutral-950">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                <h2 className="text-lg font-semibold text-white">Live Whiteboard</h2>
                <div className="flex gap-2 items-center">
                    {/* View/Edit Toggle */}
                    {code && !isGenerating && !isRegenerating && (
                        <div className="flex gap-1 bg-neutral-800 rounded-md  p-1">
                            <button
                                onClick={() => setViewMode('view')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded transition-colors flex items-center gap-1",
                                    viewMode === 'view'
                                        ? "bg-blue-600 text-white"
                                        : "text-neutral-400 hover:text-white"
                                )}
                            >
                                <Eye size={14} />
                                View
                            </button>
                            <button
                                onClick={() => setViewMode('edit')}
                                className={cn(
                                    "text-xs px-2 py-1 rounded transition-colors flex items-center gap-1",
                                    viewMode === 'edit'
                                        ? "bg-blue-600 text-white"
                                        : "text-neutral-400 hover:text-white"
                                )}
                            >
                                <Pencil size={14} />
                                Edit
                            </button>
                        </div>
                    )}

                    {/* Visualize Button */}
                    <button
                        onClick={onGenerateDiagram}
                        disabled={isGenerating || isTyping || isRegenerating}
                        className={cn(
                            "text-xs px-3 py-1.5 rounded-md transition-colors border flex items-center gap-2",
                            (isGenerating || isTyping || isRegenerating)
                                ? "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
                                : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
                        )}
                    >
                        {isGenerating ? "Generating..." : isRegenerating ? "Fixing..." : "Visualize"}
                    </button>
                </div>
            </div>

            {/* Diagram Canvas */}
            <div className="flex-1 overflow-hidden relative bg-neutral-950">
                <div className="absolute inset-0">
                    {code ? (
                        <DrawioDiagram
                            xmlCode={code}
                            mode={viewMode}
                            cloudProvider={cloudProvider}
                            onXmlChange={handleXmlChange}
                            onError={handleDiagramError}
                        />
                    ) : (
                        !isGenerating && !isRegenerating && (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                                <p className="text-sm">Click 'Visualize' to generate the architecture diagram</p>
                            </div>
                        )
                    )}
                </div>

                {/* Generating Overlay */}
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

                {/* Regenerating (Self-Healing) Overlay */}
                {isRegenerating && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-orange-400 font-medium animate-pulse">Regenerating diagram...</p>
                        <p className="mt-1 text-xs text-neutral-400">Auto-fixing errors (Attempt {retryCount + 1}/3)</p>
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

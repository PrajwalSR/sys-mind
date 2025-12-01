"use client";

import MermaidDiagram from "./MermaidDiagram";

interface DiagramPanelProps {
    code: string;
    onNodeClick?: (nodeId: string) => void;
}

export default function DiagramPanel({ code, onNodeClick }: DiagramPanelProps) {
    return (
        <div className="flex flex-col h-full bg-neutral-950">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                <h2 className="text-lg font-semibold text-white">Live Whiteboard</h2>
                <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-800 rounded">
                        Mermaid.js
                    </span>
                </div>
            </div>

            {/* Diagram Canvas */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 p-4">
                    <MermaidDiagram code={code} onNodeClick={onNodeClick} />
                </div>
            </div>
        </div>
    );
}

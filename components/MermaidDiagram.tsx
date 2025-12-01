"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "Inter, sans-serif",
});

interface MermaidDiagramProps {
    code: string;
    onNodeClick?: (nodeId: string) => void;
}

// Extend window interface to include our callback
declare global {
    interface Window {
        onMermaidClick: (id: string) => void;
    }
}

export default function MermaidDiagram({ code, onNodeClick }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // Register global callback
    useEffect(() => {
        window.onMermaidClick = (id: string) => {
            console.log("Clicked node:", id);
            if (onNodeClick) {
                onNodeClick(id);
            }
        };

        return () => {
            // Cleanup
            // @ts-ignore
            window.onMermaidClick = undefined;
        };
    }, [onNodeClick]);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code || !containerRef.current) return;

            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, code);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error("Mermaid rendering error:", err);
                setError("Failed to render diagram. Syntax error?");
            }
        };

        renderDiagram();
    }, [code]);

    if (error) {
        return (
            <div className="text-red-500 p-4 border border-red-800 rounded bg-red-950/50">
                <p className="font-semibold">Error rendering diagram:</p>
                <pre className="text-xs mt-2 overflow-auto">{error}</pre>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

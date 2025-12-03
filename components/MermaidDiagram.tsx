"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
    fontFamily: "Inter, sans-serif",
    suppressErrorRendering: true,
});

// Prevent Mermaid from showing its default error overlay
mermaid.parseError = (err) => {
    console.error("Mermaid parse error:", err);
    // We handle errors in the render catch block, so we suppress the default behavior here
};

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

            // Strip markdown code block wrappers if present
            const cleanCode = code.replace(/```mermaid/g, "").replace(/```/g, "").trim();

            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, cleanCode);
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
            <div className="text-red-500 p-4 border border-red-800 rounded bg-red-950/50 overflow-auto h-full">
                <p className="font-semibold mb-2">Error rendering diagram:</p>
                <p className="text-xs mb-2">{error}</p>
                <div className="mt-4">
                    <p className="text-xs text-neutral-400 mb-1">Code:</p>
                    <pre className="text-[10px] font-mono bg-black/50 p-2 rounded text-neutral-300 whitespace-pre-wrap break-all">
                        {code}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-auto p-4"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { buildDrawioUrl, DrawioMessage, DrawioMessageType } from "@/lib/drawioConfig";

interface DrawioDiagramProps {
    xmlCode: string;
    mode?: 'view' | 'edit';
    cloudProvider?: 'aws' | 'gcp' | 'azure';
    onXmlChange?: (xml: string) => void;
    onError?: (error: string, brokenXml: string) => void;
}

export default function DrawioDiagram({
    xmlCode,
    mode = 'view',
    cloudProvider,
    onXmlChange,
    onError
}: DrawioDiagramProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle postMessage communication with diagrams.net
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Only accept messages from diagrams.net
            if (!event.origin.includes('diagrams.net')) {
                return;
            }

            try {
                const message: DrawioMessage = typeof event.data === 'string'
                    ? JSON.parse(event.data)
                    : event.data;

                console.log('draw.io message:', message);

                switch (message.event) {
                    case DrawioMessageType.INIT:
                        // Editor is ready, send the XML to load
                        setIsReady(true);
                        if (xmlCode && iframeRef.current?.contentWindow) {
                            iframeRef.current.contentWindow.postMessage(
                                JSON.stringify({
                                    action: 'load',
                                    xml: xmlCode,
                                    autosave: mode === 'edit' ? 1 : 0,
                                }),
                                '*'
                            );
                        }
                        break;

                    case DrawioMessageType.SAVE:
                        // User saved the diagram (edit mode)
                        if (message.xml && onXmlChange) {
                            onXmlChange(message.xml);
                        }
                        break;

                    case DrawioMessageType.EXPORT:
                        // Diagram exported
                        if (message.data && onXmlChange) {
                            onXmlChange(message.data);
                        }
                        break;

                    case 'autosave':
                        // Auto-save in edit mode
                        if (message.xml && onXmlChange) {
                            onXmlChange(message.xml);
                        }
                        break;

                    case DrawioMessageType.ERROR:
                        // Error occurred
                        const errorMsg = message.error || message.message || 'Unknown error';
                        console.error('draw.io error:', errorMsg);
                        setError(errorMsg);
                        if (onError) {
                            onError(errorMsg, xmlCode);
                        }
                        break;

                    default:
                        console.log('Unhandled draw.io event:', message.event);
                }
            } catch (err) {
                console.error('Error processing draw.io message:', err);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [xmlCode, mode, onXmlChange, onError]);

    // Reload diagram when XML changes
    useEffect(() => {
        if (isReady && xmlCode && iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({
                    action: 'load',
                    xml: xmlCode,
                    autosave: mode === 'edit' ? 1 : 0,
                }),
                '*'
            );
        }
    }, [xmlCode, isReady, mode]);

    if (error) {
        return (
            <div className="text-red-500 p-4 border border-red-800 rounded bg-red-950/50 overflow-auto h-full">
                <p className="font-semibold mb-2">Error rendering diagram:</p>
                <p className="text-xs mb-2">{error}</p>
                <div className="mt-4">
                    <p className="text-xs text-neutral-400 mb-1">XML Code:</p>
                    <pre className="text-[10px] font-mono bg-black/50 p-2 rounded text-neutral-300 whitespace-pre-wrap break-all">
                        {xmlCode}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-sm text-neutral-400">Loading diagram editor...</p>
                    </div>
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={buildDrawioUrl(mode, cloudProvider)}
                className="w-full h-full border-0"
                style={{ display: isReady ? 'block' : 'none' }}
            />
        </div>
    );
}

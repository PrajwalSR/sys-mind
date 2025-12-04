/**
 * Configuration for diagrams.net (draw.io) embedded editor
 */

export const DRAWIO_CONFIG = {
    embedUrl: 'https://embed.diagrams.net/',

    // Base parameters for all embed instances
    baseParams: {
        embed: '1',        // Enable embed mode
        spin: '1',         // Show loading spinner
        proto: 'json',     // Use JSON protocol for postMessage
        ui: 'dark',        // Dark theme to match app
        libraries: '1',    // Enable shape libraries
        noSaveBtn: '1',    // Hide save button (we handle saving)
        noExitBtn: '1',    // Hide exit button
    },

    // Cloud provider shape libraries
    libraries: {
        aws: 'aws4',
        gcp: 'gcp2',
        azure: 'azure',
    },
} as const;

/**
 * Build diagrams.net embed URL with parameters
 */
export function buildDrawioUrl(mode: 'view' | 'edit', cloudProvider?: 'aws' | 'gcp' | 'azure'): string {
    const params = {
        ...DRAWIO_CONFIG.baseParams,
        // Hide UI chrome in view mode for cleaner presentation
        ...(mode === 'view' ? { chrome: '0' } : {}),
        // Pre-load cloud provider library if specified
        ...(cloudProvider ? { libs: DRAWIO_CONFIG.libraries[cloudProvider] } : {}),
    };

    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return `${DRAWIO_CONFIG.embedUrl}?${queryString}`;
}

/**
 * PostMessage event types from diagrams.net
 */
export enum DrawioMessageType {
    INIT = 'init',
    LOAD = 'load',
    SAVE = 'save',
    AUTOSAVE = 'autosave',
    EXPORT = 'export',
    ERROR = 'error',
    CONFIGURE = 'configure',
}

/**
 * PostMessage payload structure
 */
export interface DrawioMessage {
    event: DrawioMessageType;
    xml?: string;
    data?: string;
    message?: string;
    error?: string;
}

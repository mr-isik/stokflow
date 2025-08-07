// Export validation utilities
export * from './validation';

// Export logger
export * from './logger';

// Export common types
export interface AppConfig {
    api: {
        baseUrl: string;
        timeout: number;
        enableLogging: boolean;
        enableValidation: boolean;
    };
    logging: {
        level: string;
        enableRemote: boolean;
        remoteEndpoint?: string;
    };
}

// Export utility functions
export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const generateId = () => Math.random().toString(36).substring(2, 15);

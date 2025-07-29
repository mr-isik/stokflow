// Export validation utilities
export * from "./validation";

// Export logger
export * from "./logger";

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
  new Promise((resolve) => setTimeout(resolve, ms));

export const formatCurrency = (amount: number, currency = "TRY") => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
  }).format(amount);
};

export const generateId = () => Math.random().toString(36).substring(2, 15);

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

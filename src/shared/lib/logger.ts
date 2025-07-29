export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  bufferSize: number;
  flushInterval: number;
}

class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(config: LoggerConfig) {
    this.config = config;
    this.startFlushTimer();
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      stack: error?.stack,
    };
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, data, error);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Buffer for remote logging
    if (this.config.enableRemote) {
      this.buffer.push(entry);
      if (this.buffer.length >= this.config.bufferSize) {
        this.flush();
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    const { level, message, data, timestamp } = entry;
    const timeStr = timestamp.toISOString();

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timeStr}] DEBUG: ${message}`, data);
        break;
      case LogLevel.INFO:
        console.info(`[${timeStr}] INFO: ${message}`, data);
        break;
      case LogLevel.WARN:
        console.warn(`[${timeStr}] WARN: ${message}`, data);
        break;
      case LogLevel.ERROR:
        console.error(`[${timeStr}] ERROR: ${message}`, data);
        break;
    }
  }

  private async flush() {
    if (this.buffer.length === 0) return;

    const logs = [...this.buffer];
    this.buffer = [];

    try {
      if (this.config.remoteEndpoint) {
        await fetch(this.config.remoteEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ logs }),
        });
      }
    } catch (error) {
      console.error("Failed to send logs to remote endpoint:", error);
      // Re-add logs to buffer if failed
      this.buffer.unshift(...logs);
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private getCurrentUserId(): string | undefined {
    // Get from your auth store
    try {
      if (typeof window === "undefined") return undefined;
      const userStore = localStorage.getItem("user-store");
      if (userStore) {
        const parsed = JSON.parse(userStore);
        return parsed?.state?.currentUser?.id;
      }
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    if (typeof window === "undefined") return "server";

    let sessionId = sessionStorage.getItem("session-id");
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("session-id", sessionId);
    }
    return sessionId;
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | any) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, message, error, errorObj);
  }

  // Performance logging
  time(label: string) {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-start`);
    }
  }

  timeEnd(label: string) {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measures = performance.getEntriesByName(label);
      const duration = measures[measures.length - 1]?.duration;

      this.debug(`Performance: ${label}`, {
        duration: `${duration?.toFixed(2)}ms`,
      });

      // Cleanup
      performance.clearMarks(`${label}-start`);
      performance.clearMarks(`${label}-end`);
      performance.clearMeasures(label);
    }
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Create logger instance
const loggerConfig: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === "production",
  remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
  bufferSize: 10,
  flushInterval: 30000, // 30 seconds
};

export const logger = new Logger(loggerConfig);

// Export logger for cleanup on app unmount
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    logger.destroy();
  });
}

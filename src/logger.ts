/**
 * Logger utility class for controlling console output in different environments
 */
export class Logger {
  private static isProduction = process.env.NODE_ENV === 'production';

  static log(...args: unknown[]): void {
    if (!Logger.isProduction) {
      console.log(...args);
    }
  }

  static warn(...args: unknown[]): void {
    if (!Logger.isProduction) {
      console.warn(...args);
    }
  }

  static error(...args: unknown[]): void {
    // Errors should always be logged
    console.error(...args);
  }
}
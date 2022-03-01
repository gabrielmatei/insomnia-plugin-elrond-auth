import { Logger } from "@nestjs/common";
import { PerformanceProfiler } from "./performance.profiler";

export class Locker {
  private static lockArray: string[] = [];

  static async lock(key: string, func: () => Promise<void>, log: boolean = false): Promise<LockResult> {
    const logger = new Logger('Lock');

    if (Locker.lockArray.includes(key) && log) {
      logger.log(`${key} is already running`);
      return LockResult.alreadyRunning;
    }

    Locker.lockArray.push(key);

    const profiler = new PerformanceProfiler();

    try {
      await func();
      return LockResult.success;
    } catch (error) {
      logger.error(`Error running ${key}`);
      logger.error(error);
      return LockResult.error;
    } finally {
      profiler.stop(`Running ${key}`, log);
      const index = Locker.lockArray.indexOf(key);
      if (index >= 0) {
        Locker.lockArray.splice(index, 1);
      }
    }
  }
}

export enum LockResult {
  success = 'success',
  alreadyRunning = 'alreadyRunning',
  error = 'error'
}

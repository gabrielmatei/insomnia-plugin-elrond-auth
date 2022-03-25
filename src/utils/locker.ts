import { Logger } from "@nestjs/common";
import { MetricsService } from "src/common/metrics/metrics.service";
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
      logger.log(`Start running ${key}`);

      await func();

      profiler.stop(`End running ${key}`, log);
      MetricsService.setJobResult(key, 'success', profiler.duration);

      return LockResult.success;
    } catch (error) {
      logger.error(`Error running ${key}`);
      logger.error(error);


      profiler.stop(`End running ${key}`, log);
      MetricsService.setJobResult(key, 'error', profiler.duration);

      return LockResult.error;
    } finally {
      Locker.lockArray.remove(key);
    }
  }
}

export enum LockResult {
  success = 'success',
  alreadyRunning = 'alreadyRunning',
  error = 'error'
}

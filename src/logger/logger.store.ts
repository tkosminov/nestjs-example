import { v4 } from 'uuid';

import { ELogLevel, ILog, ILogBase, LoggerService } from './logger.service';

export class LoggerStore {
  public request_id: string = v4();
  private log_index = 0;
  private readonly starts_at: Date = new Date();
  private prev_log_time: number = Date.now();

  constructor(
    private readonly logger: LoggerService,
    private readonly base_context: Record<string, unknown> = {}
  ) {}

  public log(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.debug, { message, context });
  }

  public info(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.info, { message, context });
  }

  public warn(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.warn, { message, context });
  }

  public error(err: Error, context?: Record<string, unknown>): void;
  public error(message: unknown, context?: Record<string, unknown>, trace?: string): void;
  public error(message_or_error: unknown | Error, context: Record<string, unknown> = {}, trace?: string) {
    if (message_or_error instanceof Error) {
      this.addLog(ELogLevel.error, { message: message_or_error.message, context, trace: message_or_error.stack });
    } else {
      this.addLog(ELogLevel.error, { message: message_or_error, context, trace });
    }
  }

  private addLog(level: ELogLevel, log_data: ILogBase) {
    if (this.logger.isValidLevel(level)) {
      const current_log_time = Date.now();

      const log: ILog = {
        level,
        message: log_data.message,
        trace: log_data.trace,
        context: {
          request_id: this.request_id,
          log_index: this.log_index,
          starts_at: this.starts_at,
          handle_time: `${current_log_time - this.prev_log_time} ms`,
          ...this.base_context,
          ...log_data.context,
        },
      };

      this.prev_log_time = current_log_time;

      this.log_index++;

      this.logger.addLog(log);
    }
  }
}

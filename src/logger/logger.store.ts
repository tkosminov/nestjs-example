import { v4 } from 'uuid';

import { LoggerService, ELogLevel } from './logger.service';

interface ILog {
  level?: ELogLevel;
  message: unknown;
  context?: Record<string, unknown>;
  trace?: string;
}

export class LoggerStore {
  private readonly request_id: string = v4();
  private readonly starts_at: Date = new Date();
  private log_index = 0;
  private prev_log_time: number = Date.now();

  constructor(private readonly logger: LoggerService, private readonly base_ctx: Record<string, unknown> = {}) {}

  public log(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.debug, { message, context });
  }

  public info(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.info, { message, context });
  }

  public warn(message: unknown, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.warn, { message, context });
  }

  public error(message: unknown, trace?: string, context: Record<string, unknown> = {}) {
    this.addLog(ELogLevel.error, { message, context, trace });
  }

  private addLog(level: ELogLevel, log_data: ILog) {
    if (this.logger.isValidLevel(level)) {
      const current_log_time = Date.now();

      const log: ILog = {
        message: log_data.message,
        context: {
          request_id: this.request_id,
          log_index: this.log_index,
          starts_at: this.starts_at,
          handle_time: `${current_log_time - this.prev_log_time} ms`,
          ...this.base_ctx,
          ...log_data.context,
        },
        trace: log_data.trace,
        level,
      };

      this.prev_log_time = current_log_time;

      this.log_index++;

      this.dropLog(log);
    }
  }

  private dropLog(log: ILog) {
    switch (log.level) {
      case ELogLevel.debug:
        this.logger.log(log.message, log.context);
        break;
      case ELogLevel.info:
        this.logger.info(log.message, log.context);
        break;
      case ELogLevel.warn:
        this.logger.warn(log.message, log.context);
        break;
      case ELogLevel.error:
        this.logger.error(log.message, log.trace, log.context);
        break;
    }
  }
}

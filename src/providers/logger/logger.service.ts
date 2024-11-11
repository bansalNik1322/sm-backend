import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as moment from 'moment';
import { IRequest } from 'src/common/interfaces/global.interface';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: () => new Date().toISOString() }), // UTC timestamp
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const localTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

          return `
Timestamp (UTC): ${timestamp}
Timestamp (Local): ${localTimestamp}

Level: ${level.toUpperCase()}
Message: ${message}

Request Details:
  - Method: ${meta.method || ''}
  - URL: ${meta.url || ''}
  - IP Address: ${meta.ip || ''}

Headers:
${
  meta.headers
    ? Object.entries(meta.headers)
        .map(([key, value]) => `  - ${key}: ${value}`)
        .join('\n')
    : ''
}

Payload: ${JSON.stringify(meta.payload, null, 2)}
Params: ${JSON.stringify(meta.params, null, 2)}
Query: ${JSON.stringify(meta.query, null, 2)}

Trace:
${meta.trace || 'No trace available'}
          `;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/warn.log',
          level: 'warn',
        }),
        new winston.transports.File({
          filename: 'logs/info.log',
          level: 'info',
        }),
      ],
    });
  }

  log(message: string, request?: IRequest) {
    this.logger.info(message, this.buildMetaData(request));
  }

  error(message: string, trace: string, request?: IRequest) {
    this.logger.error(message, this.buildMetaData(request, trace));
  }

  warn(message: string, request?: IRequest) {
    this.logger.warn(message, this.buildMetaData(request));
  }

  debug(message: string, request?: IRequest) {
    this.logger.debug(message, this.buildMetaData(request));
  }

  verbose(message: string, request?: IRequest) {
    this.logger.verbose(message, this.buildMetaData(request));
  }

  private buildMetaData(request?: IRequest, trace?: string) {
    const localTimestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    return {
      ...(request && {
        payload: request.body,
        params: request.params,
        query: request.query,
        ip: request.ip,
        headers: request.headers,
        method: request.method,
        url: request.originalUrl,
      }),
      utcTimestamp: new Date().toISOString(),
      localTimestamp,
      trace,
    };
  }
}

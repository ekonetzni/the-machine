import winston, { Logger as WinstonLogger } from 'winston';

export class Logger {
  private logger!: WinstonLogger;

  private loggerFactory = (): WinstonLogger => {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
    return this.logger;
  };

  public getLogger = (): WinstonLogger => {
    return this.logger ? this.logger : this.loggerFactory();
  };
}

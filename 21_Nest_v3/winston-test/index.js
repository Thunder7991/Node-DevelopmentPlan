import winston from 'winston';
import 'winston-daily-rotate-file';
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    defaultMeta: { service: 'thunderchen' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
            dirname: 'log2',
            filename: 'test-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH-mm',
            maxSize: '1k'
        }),
    ]

})

logger.info('thunder');
logger.error('chen');
logger.debug(77);
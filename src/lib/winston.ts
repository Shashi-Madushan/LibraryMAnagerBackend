/**
 *  Node modules
 */

import winston from 'winston';

/**
 *  Custome modules
 */
import config from '../config';
import { time } from 'console';


const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

// the transport array holding different logging transports
const transports: winston.transport[] = [];

if (config.NODE_ENV !== 'production') {

    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                align(),
                printf(({ timestamp, level, message, ...metta }) => {
                    const metaString = Object.keys(metta).length ? JSON.stringify(metta) : '';
                    return `${timestamp} ${level}: ${message} ${metaString}`;

                })
            )
        })
    )
}

const logger = winston.createLogger({
    level :config.LOG_LEVEL,
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
    silent: config.NODE_ENV === 'test', // Disable logging in test environment
});


export default logger;
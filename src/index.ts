/**
 * node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custome modules
 */
import config from '@/config/index';  
import limiter from '@/lib/expressRateLimit';
import { connectToDatabase, disconnectFromDatabase } from '@/db/mongoose';
import  logger from '@/lib/winston';


/** 
 *  Router 
 */
import rootRoutes from '@/routes/index';

/**
 *  Types
 */
import type { CorsOptions } from 'cors';



/**
 * Express app initial
 */
const app = express();

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITE_LIST_ORIGINS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS Error : ${origin} is not allowd by CORS`), false)
            logger.warn(`CORS Error : ${origin} is not allowd by CORS`)

        }
    },
}



// Apply cors middleware
app.use(cors(corsOptions));

// Enables json request body parsing 
app.use(express.json());

//Enable url-encoded request body parsing with extended node 
// extended :true allows ritch objects and arrays via quarystring 
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

// Enable response compression
app.use(compression({
    threshold: 1024, // Compress responses larger than 1KB
}),);

// Use helmet for security headers
app.use(helmet());

// Apply rate limiting middleware
app.use(limiter);





(async () => {
    try {
        await connectToDatabase();
        app.use('/api/v1', rootRoutes);

        app.listen(config.PORT, () => {
            logger.info(`Server is running on http://localhost:${config.PORT}`)
        })
    } catch (error) {
        logger.error('Error starting the server:', error);
        if (config.NODE_ENV === 'production') {
            process.exit(1); // Exit the process with a failure code
        }
    }

})();


const handelServerShutdown = async () => {
    try {
        await disconnectFromDatabase();
        logger.warn('Server is shutting down gracefully...');
        process.exit(0); // Exit the process with a success code
    } catch (error) {
        logger.error('Error during server shutdown:', error);
    }
}

process.on('SIGINT', handelServerShutdown); 
process.on('SIGTERM', handelServerShutdown);
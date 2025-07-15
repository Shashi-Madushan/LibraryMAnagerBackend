/**
 *  Node modules 
 */

import { rateLimit } from 'express-rate-limit';


const limiter = rateLimit({
    windowMs:  60 * 1000, // 1 minutes
    limit:60, // Limit each IP to 60 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders:false,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    },
});

export default limiter
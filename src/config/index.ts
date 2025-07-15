/**
 * Node modules
 */

import dotenv from 'dotenv'

import ms from 'ms';

dotenv.config();

const config ={
    PORT : process.env.PORT || 3000,
    NODE_ENV :process.env.NODE_ENV,
    WHITE_LIST_ORIGINS : ['http://localhost:3000', 'http://localhost:5173'],
    DB_URL : process.env.DB_URL ,
    LOG_LEVEL : process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_TOKEN_SECRET : process.env.JWT_ACCESS_TOKEN_SECRET  ,
    JWT_ACCESS_TOKEN_EXPIRATION : process.env.JWT_ACCESS_TOKEN_EXPIRATION as ms.StringValue,
    JWT_REFRESH_TOKEN_SECRET : process.env.JWT_REFRESH_TOKEN_SECRET  ,
    JWT_REFRESH_TOKEN_EXPIRATION : process.env.JWT_REFRESH_TOKEN_EXPIRATION as ms.StringValue,
    WHITELIST_ADMIN_MAILS:[
        'shashisulakshan8088@gmail.com',
        'testadmin@gmail.com'
    ]
}

export default config;
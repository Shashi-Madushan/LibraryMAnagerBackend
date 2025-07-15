/**
 * Node MongoDB connection using Mongoose
 */

/**
 * Node modules
 */
import mongoose from "mongoose"

/**
 *  Custome modules 
 */

import config from "../config";
import logger from "../lib/winston";

/**
 *  Types
 */

import type { ConnectOptions } from "mongoose";

const options: ConnectOptions = {
  dbName:'library_manager',
  appName: 'LibraryManager',
  serverApi:{
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

export const connectToDatabase = async () : Promise<void>=> {

  if(!config.DB_URL) {
    throw new Error("Database URL is not defined in the environment variables.");
  }
  try {
    await mongoose.connect(config.DB_URL, options);
    logger.info('MongoDB connected successfully');
  } catch (error) {

    if (error instanceof Error) {
      throw Error(`MongoDB connection error: ${error.message}`);
    } else {
      logger.error('MongoDB connection error:', error);
    }
   
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    if (error instanceof Error) {
      throw Error(`MongoDB disconnection error: ${error.message}`);
    } else {
      logger.error('MongoDB disconnection error:', error);
    }
  }
}

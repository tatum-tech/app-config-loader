'use strict';

const secretsService = require('./secretsService');

const DEFAULT_MONGO_URL = 'mongodb://localhost:27017/config_db';
const DEFAULT_PROJECT_NAME = 'Sample App';
const DEFAULT_ENVIRONMENT = 'production';
const DEFAULT_MONGO_SERVER_KEEP_ALIVE = 1;
const DEFAULT_MONGO_TIMEOUT_MS = 30000;

class AppConfigLoader {
  constructor() {
    try {
      this.getSecret = secretsService.init();
    } catch(e) {
      console.log(e);

      throw new Error('Cannot initialize secrets service');
    }
  }

  /**
   * 
   * Takes Azure Key Vault (\ AWS Secrets Manager)* secrets and creates a standardized application configuration object.
   * Falls back to using .env file if available or the default configuration settings.
   * @returns {Promise} resolves to application configuration
   */
  async appConfig() {
    try {
      const settings = await this.getSettings();
      const configuration = await this.getMongoConfiguration();
  
      return {
        settings,
        configuration,
      }; 
    } catch(e) {
      console.log(e);
      return Promise.reject(e);
    }
  }
  
  async getSettings() {
    const name = await this.getSecret('ProjectName') || DEFAULT_PROJECT_NAME;
    const environment = await this.getSecret('Environment') || DEFAULT_ENVIRONMENT;
  
    return {
      name,
      application: {
        environment,
      }
    };
  }
  
  async getMongoConfiguration() {
    const url = await this.getSecret('MongoUrl') || DEFAULT_MONGO_URL;
    const rs_name = await this.getSecret('MongoReplicasetName');
    const keepAlive = await this.getSecret('MongoServerKeepAlive') || DEFAULT_MONGO_SERVER_KEEP_ALIVE;
    const connectTimeoutMS = await this.getSecret('MongoConnectTimeout') || DEFAULT_MONGO_TIMEOUT_MS;
    const socketTimeoutMS = await this.getSecret('MongoSocketTimeout') || DEFAULT_MONGO_TIMEOUT_MS;
  
    return {
      type: 'db',
      db: 'mongoose',
      options: {
        url,
        mongoose_options: {
          replset: {
            rs_name,
          },
          server: {
            keepAlive,
            connectTimeoutMS,
            socketTimeoutMS,
          }
        }
      }
    };
  }
}

module.exports = new AppConfigLoader();

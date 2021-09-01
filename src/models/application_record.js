const DB_CONFIG = require('config').get('app.db');

/**
 * Base for ALL application record models, 
 * inspired by Rails' 
 * ActiveRecord::Base::ApplicationRecord (https://www.bigbinary.com/blog/application-record-in-rails-5)
 */
class ApplicationRecord {
    /**
     * Gives base configuration for the SQL connections
     */
    static get BaseConfig() {
        return {
            ...DB_CONFIG,
            trustServerCertificate: true
        }
    }
}

module.exports = ApplicationRecord;
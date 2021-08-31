const DB_CONFIG = require('config').get('app.db');

class ApplicationRecord {
    static get BaseConfig() {
        return {
            ...DB_CONFIG,
            trustServerCertificate: true
        }
    }
}

module.exports = ApplicationRecord;
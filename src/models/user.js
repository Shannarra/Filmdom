const ApplicationRecord = require('./application_record');
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class User extends ApplicationRecord {
    constructor() {
        super();

    }

    static get All() {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllUsers    
        );  
    }
}

module.exports = User;
import ApplicationRecord from './application_record';
import QueryStorage from './query_storage';

export default class User extends ApplicationRecord {
    constructor() {
        super();

    }

    static get All() {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllUsers()    
        );  
    }
}

module.exports = User;
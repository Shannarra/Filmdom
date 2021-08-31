const ApplicationRecord = require('./application_record');
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class User extends ApplicationRecord {
    constructor() {
        super();

    }

    static get All() {
        return new Promise((resolve, reject) =>{
            mssql.connect(ApplicationRecord.BaseConfig, e => {
                if (e){
                    reject(e);
                }

                new mssql
                    .Request()
                    .query(QueryStorage.AllUsers, (e, resp) => {
                        if (e) {
                            reject(e);
                        }

                        resolve(resp.recordset);
                    });
            })
        })        
    }
}

module.exports = User;
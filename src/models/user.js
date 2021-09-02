const ApplicationRecord = require('./application_record');
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class User extends ApplicationRecord {
    constructor() {
        super();

    }

    static get All() {
        return new Promise(
            (resolve, reject) =>{
                mssql.connect(ApplicationRecord.BaseConfig, e => {
                    if (e){
                        reject(e);
                    }

                    new mssql
                        .Request()
                        .query(QueryStorage.GetQueries.AllUsers(), (e, resp) => {
                            if (e) {
                                reject(e);
                            }

                            if (resp.recordset !== undefined && resp.recordset.length != 0)
                                resolve(resp.recordset);
                            else
                                reject("404");
                        });
                })
            }
        )        
    }
}

module.exports = User;
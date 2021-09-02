const DB_CONFIG = require('config').get('app.db');
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

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

    /**
     * Makes and returns a promise for the given `transaction`, 
     * result could be altered by the given `successfulTransactionDelegate` param.
     * @param {QueryStorage} transaction -  a query that needs to be passed. REQUIRED!
     * @param {Function<mssql.IResult<any>>} successfulTransactionDelegate - a middleware delegate (handler) before resolving the query.
     * @returns 
     */
    PromiseHandledSQLTransaction(transaction, successfulTransactionDelegate) {
        return new Promise(
            async(resolve, reject) => {
                mssql.connect(ApplicationRecord.BaseConfig, e => {
                    if (e) 
                        reject(e);
                    
                    new mssql
                        .Request()
                        .query(transaction, (e, resp) => {
                            if (e)
                                reject(e);

                            if (resp.recordset !== undefined && resp.recordset.length !== 0) {
                                if (successfulTransactionDelegate) 
                                    resolve(successfulTransactionDelegate(resp.recordset));
                                else
                                    resolve(resp.recordset);
                            } 
                            else
                                reject("404");
                        })
                })
            }
        );
    }
}

module.exports = ApplicationRecord;
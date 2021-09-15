const DB_CONFIG = require('config').get('app.db');
import mssql, {IResult, IRecordSet, Request} from 'mssql';
import Joi from 'joi';

/**
 * Base for ALL application record models, 
 * inspired by Rails' 
 * ActiveRecord::Base::ApplicationRecord (https://www.bigbinary.com/blog/application-record-in-rails-5)
 */
export default class ApplicationRecord {

    constructor() {}

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
     * @param {Function<IRecordSet<any>>} successfulTransactionDelegate - a middleware delegate (handler) before resolving the query.
     * @returns 
     */
    static PromiseHandledSQLTransaction(transaction: string,
            successfulTransactionDelegate?: ((items: IRecordSet<any>) => any[])
            ) {
        return new Promise(
            async(resolve, reject) => {
                mssql.connect(ApplicationRecord.BaseConfig, (e: Error) => {
                    if (e) 
                        reject(e);
                    
                    new Request()
                        .query(transaction, (e: Error, resp: IResult<any>) => {
                            if (e)
                                reject(e);

                            if (!resp)
                                reject(new Error("Database connection could not be established."));

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

    static ValidateUser(wannabe: any) {
        const matcher = Joi.object({
            Id: Joi.number(),
            Name: Joi
                    .string()
                    .min(2)
                    .max(50)
                    .required(),
            Email: Joi
                    .string()
                    .email()
                    .not("")
                    .required(),
            Password: Joi
                    .string()
                    .required(),
            IsAdmin: Joi
                    .bool()
        });
        
        return matcher.validate(wannabe);
    }
}

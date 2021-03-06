// tslint:disable no-var-requires
const DB_CONFIG = require('config').get('app.db');
import mssql, {IResult, IRecordSet, Request} from 'mssql';
import Joi from 'joi';
import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

/**
 * Base for ALL application record models,
 * inspired by Rails'
 * ActiveRecord::Base::ApplicationRecord (https://www.bigbinary.com/blog/application-record-in-rails-5)
 */
export default class ApplicationRecord {
    /**
     * Gives base configuration for the SQL connections
     */
    static get BaseConfig() {
        
        return {
            user: process.env.user,
            server: process.env.server,
            password: process.env.password,
            database: process.env.database,
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
                mssql.connect(ApplicationRecord.BaseConfig, (er: Error) => {
                    if (er)
                        reject(er);

                    new Request()
                        .query(transaction, (e: Error, resp: IResult<any>) => {
                            if (e)
                                reject(e);

                            if (!resp)
                                reject(new Error("Database connection could not be established."));

                            if (resp && resp.recordset !== undefined && resp.recordset.length !== 0) {
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

    static ValidateUser(wannabe: any): Joi.ValidationResult {
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

    static ValidateMovie(movieSent: any): Joi.ValidationResult {
        const matcher = Joi.object({
            Title: Joi
                    .string()
                    .min(2)
                    .max(100)
                    .required(),
            Director: Joi
                    .string()
                    .min(2)
                    .max(250)
                    .required(),
            Description: Joi
                    .string()
                    .min(2)
                    .max(200)
                    .required(),
            ImageLink: Joi
                    .string()
                    .min(2)
                    .max(300)
                    .required(),
            Year: Joi
                    .number()
                    .min(1850)
                    .required(),
            Duration: Joi
                    .number()
                    .min(1)
                    .required(),
            Genre: Joi
                    .string()
                    .min(2)
                    .max(150)
                    .required()
        });

        return matcher.validate(movieSent);
    }
}

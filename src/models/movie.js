const ApplicationRecord = require('./application_record');
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class Movie extends ApplicationRecord {
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
                        .query(QueryStorage.GetQueries.AllMovies(), (e, resp) => {
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
        );       
    }

    static Find(id) {

        //SanitizeId(id);

        return new Promise(
            (resolve, reject) =>{
                mssql.connect(ApplicationRecord.BaseConfig, e => {
                    if (e){
                        reject(e);
                    }

                    new mssql
                        .Request()
                        .query(QueryStorage.GetQueries.FindMovie(id), (e, resp) => {
                            if (e) {
                                reject(e);
                            }

                            if (resp.recordset !== undefined && resp.recordset.length != 0)
                                resolve(resp.recordset[0]);
                            else 
                                reject("404");
                        });
                })
            }
        ); 
    }

    static Update(id, {Title, Director, Description, ImageLink}) { // this would've been easier with TS interfaces
        return new Promise(
            (resolve, reject) => {
                mssql.connect(ApplicationRecord.BaseConfig, async(e) => {
                    if (e)
                        reject(e);

                    new mssql.Request()
                            .query(QueryStorage.UpdateQueries.UpdateMovie(
                                {
                                    Title,
                                    Director,
                                    Description,
                                    ImageLink
                                },
                                id
                            ), (e, resp) => {
                                if (e) 
                                    reject(e);
                                
                                if (resp.recordset !== undefined && resp.recordset.length != 0)
                                    resolve(resp.recordset);
                                else 
                                    reject("404");
                            })
                })
            }
        );
    }
}

module.exports = Movie;
const ApplicationRecord = require("./application_record");
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class Favourites extends ApplicationRecord {
    constructor() {
        super();
    }

    static UserFavouriteIds(userid) {
        return new Promise(
            (resolve, reject) => {
                if (!parseInt(userid)) {
                    reject("Invalid user id");
                } 
                mssql.connect(ApplicationRecord.BaseConfig, e => {
                    if (e){
                        reject(e);
                    }
    
                    new mssql
                        .Request()
                        .query(QueryStorage.UserFavouriteIds(parseInt(userid)), (e, resp) => {
                            if (e) {
                                reject(e);
                            }

                            let ar = [];
                            resp.recordset.forEach(x => ar.push(x.MovieId))
    
                            resolve(ar);
                        });
                })
            }
        );
    }

    // static UserFavourites(userid) {
    //     return new Promise(
    //         async (resolve, reject) => {
    //             mssql.connect(ApplicationRecord.BaseConfig, e => {
    //                 if (e){
    //                     reject(e);
    //                 }
    
    //                 new mssql
    //                     .Request()
    //                     .query(QueryStorage.MoviesFrom.UserFavouriteIds(userid)), (e, resp) => {
    //                         if (e) {
    //                             reject(e);
    //                         }
    
    //                         resolve(resp);
    //                     });
    //             })
    //         }
    //     );
    // }
}

module.exports = Favourites
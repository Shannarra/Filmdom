const ApplicationRecord = require("./application_record");
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class Favourites extends ApplicationRecord {
    constructor() {
        super();
    }

    /**
     * Returns the IDs of the favourite user's movies.
     * @param {Number} userid - the userId 
     * @returns [int]
     */
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

    /**
     * Gets the movies for the specific userId.
     * @param {Number} userid - the ID
     * @returns SQL query result
     */
    static UserFavouriteMovies(userid) {
        return new Promise(
            (resolve, reject) => {
                mssql.connect(ApplicationRecord.BaseConfig, async(e) => {
                    if (e){
                        reject(e);
                        return;
                    }
                    try {
                        const ids = await this.UserFavouriteIds(userid);

                        new mssql.Request()
                            .query(QueryStorage.MoviesFrom(ids), (e, resp) => {
                                if (e) 
                                    reject(e);
                                console.log(QueryStorage.MoviesFrom(ids));

                                resolve(resp.recordset);
                            })
                    }
                    catch (e) {
                        reject(e);
                    }
                })
            }
        );
    }
}

module.exports = Favourites
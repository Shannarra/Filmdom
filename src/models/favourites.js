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
        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.UserFavouriteIds,
            (items) => {
                let arr = [];
                items.forEach(x => arr.push(x.MovieId));
                return arr;
            }
        )  
    }

    /**
     * Gets the movies for the specific userId.
     * @param {Number} userid - the ID
     * @returns SQL query result
     */
    static async UserFavouriteMovies(userid) {
        const ids = await this.UserFavouriteIds(userid);

        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.MoviesFrom(ids)    
        );
    }
}

module.exports = Favourites
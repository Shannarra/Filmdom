const ApplicationRecord = require('./application_record');
const QueryStorage = require('./query_storage');
const mssql = require('mssql');

class Movie extends ApplicationRecord {
    constructor() {
        super();

    }

    static get All() {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllMovies()    
        );  
    }

    static Find(id) {

        //this.SanitizeId(id);

        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindMovie(id),
            (items) => {
                return items[0];
            }
        );  
    }

    static Update(id, {Title, Director, Description, ImageLink, Year, Duration, Genre}) { // this would've been easier with TS interfaces
        return this.PromiseHandledSQLTransaction(
            QueryStorage.UpdateQueries.UpdateMovie(
                {
                    Title,
                    Director,
                    Description,
                    ImageLink,
                    Year,
                    Duration, 
                    Genre
                },
                id
            )    
        );
    }
}

module.exports = Movie;
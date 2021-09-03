import ApplicationRecord from './application_record';
import QueryStorage from './query_storage';

export default interface IMovie {
    Title: string,
    Director: string,
    Description: string,
    ImageLink: string,
    Year: Number,
    Duration: Number, 
    Genre: string
}

export default class Movie extends ApplicationRecord {
    constructor() {
        super();
    }

    static get All() {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllMovies()    
        );  
    }

    static Find(id: number) {

        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindMovie(id),
            (items) => {
                return items[0];
            }
        );  
    }

    static Update(id: number, movie: IMovie) { // this would've been easier with TS interfaces
        return this.PromiseHandledSQLTransaction(
            QueryStorage.UpdateQueries.UpdateMovie(
                movie,
                id
            )    
        );
    }
}
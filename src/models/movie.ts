import ApplicationRecord from './application_record';
import QueryStorage from './query_storage';

export default interface IMovie {
    Id?: number,
    Title: string,
    Director: string,
    Description: string,
    ImageLink: string,
    Year: number,
    Duration: number,
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

    static Create(movieSent: IMovie) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.PostQueries.MakeMovie(movieSent)
        )
    }

    static Find(id: number) {

        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindMovie(id),
            (items) => {
                return items[0];
            }
        );
    }

    static FindByProps(props: IMovie) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindMovieByPpops(props),
            (items) => {
                return items[0];
            }
        )
    }

    static Update(id: number, movie: IMovie) { // this would've been easier with TS interfaces
        return this.PromiseHandledSQLTransaction(
            QueryStorage.UpdateQueries.UpdateMovie(
                movie,
                id
            )
        );
    }
    static Delete(id: number) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.DeleteQueries.DeleteMovie(id)
        )
    }
}
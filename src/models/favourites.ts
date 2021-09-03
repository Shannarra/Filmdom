import ApplicationRecord from "./application_record";
import QueryStorage from './query_storage';

export default class Favourites extends ApplicationRecord {

    /**
     * Returns the IDs of the favourite user's movies.
     * @param {Number} userid - the userId 
     * @returns [int]
     */
    static UserFavouriteIds(userid: number) {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.UserFavouriteIds(userid),
            (items) => {
                let arr = [];
                items.forEach((x: { MovieId: number; }) => arr.push(x.MovieId));
                return arr;
            }
        )  
    }
    /**
     * Gets the movies for the specific userId.
     * @param {Number} userid - the ID
     * @returns SQL query result
     */
    static async UserFavouriteMovies(userid: number) {
        const ids = await this.UserFavouriteIds(userid);

        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.MoviesFrom(ids)
        );
    }
}
import ApplicationRecord from "./application_record";
import QueryStorage from './query_storage';

export default class Favourites extends ApplicationRecord {

    static async UserFavourites(userId: number) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.Favourites(userId)
        )
    }

    static async AddFavourite(userId: number, movieId: number) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.PostQueries.MakeFavourite(userId, movieId)
        )
    }
}
import ApplicationRecord from "./application_record";
import QueryStorage from './query_storage';

export default class Favourites extends ApplicationRecord {

    static async UserFavourites(userId: number) {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.Favourites(userId)
        )
    }
}
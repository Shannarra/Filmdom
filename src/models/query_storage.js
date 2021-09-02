/**
 * Stores queries for each SQL command.
 */
class QueryStorage {
    static get GetQueries() {
        return {
            AllMovies: () => "select * from Movie",
            AllUsers: () =>  "select * from MovieUser",
            MoviesFrom: (ids) => { if(ids) `select * from Movie where Id in (${ids})`},
            UserFavouriteIds: (userid) => `select MovieId from 
                                            MovieUser join Favourites
                                            on MovieUser.Id = Favourites.UserId
                                            where UserId = ${userid}`,
            FindMovie: (id) => `select * from Movie where Id=${id}`
        }
    }

    static get UpdateQueries() {
        return {
            UpdateMovie: ({Title, Director, Description, ImageLink}, id) => `update Movie 
                                    set 
                                    Title = '${Title}', 
                                    Director = '${Director}', 
                                    Description = '${Description}',
                                    ImageLink = '${ImageLink}'
                                    where Id=${id}`
        }
    }
}

module.exports = QueryStorage;
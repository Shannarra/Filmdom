import IMovie from "./movie";

/**
 * Stores queries for each SQL command.
 */
export default class QueryStorage {
    static get GetQueries() {
        return {
            AllMovies: () => "select * from Movie",
            AllUsers: () =>  "select * from MovieUser",
            // intentionally allowing `any` for ids[]
            MoviesFrom: (ids: any) => `select * from Movie where Id in (${ids})`,
            UserFavouriteIds: (userid: number) => `select MovieId from 
                                            MovieUser join Favourites
                                            on MovieUser.Id = Favourites.UserId
                                            where UserId = ${userid}`,
            FindMovie: (id: number) => `select * from Movie where Id=${id}`
        }
    }

    static get UpdateQueries() {
        return {
            UpdateMovie: (movie: IMovie, id: number) => `update Movie 
                                    set 
                                    Title = '${movie.Title}', 
                                    Director = '${movie.Director}', 
                                    Description = '${movie.Description}',
                                    ImageLink = '${movie.ImageLink}',
                                    Year = '${movie.Year}',
                                    Duration = '${movie.Duration}',
                                    Genre = '${movie.Genre}',
                                    where Id=${id}`
        }
    }
}

module.exports = QueryStorage;
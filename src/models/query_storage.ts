import IMovie from "./movie";
import User, { IUserProps } from "./user";

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
            FindMovie: (id: number) => `select * from Movie where Id=${id}`,
            FindMovieByPpops: (props: IMovie) => `select * from Movie where Title='${props.Title}' and ImageLink='${props.ImageLink}'`, // maybe we'll add director matching as well later on? :thinking:
            FindUser: (name: string, email: string) => `select * from MovieUser where Name='${name}' and Email='${email}'`, // the name IS unique
            Favourites: (id: number) => `select
                                        Movie.Id, Title, Director Description,
                                        Imagelink, Year, Duration, Genre,
                                        UserId=u.Id, UserName=u.Name from Movie
                                        join Favourites f
                                        on Id=MovieId
                                        join MovieUser u
                                        on UserId=u.Id
                                        where u.Id=${id};
                                        `
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
                                    Genre = '${movie.Genre}'
                                    where Id=${id}`,
            UpdateUser: (user: User, values: IUserProps) => `update MovieUser
                                    set
                                    Name='${values.Name}',
                                    Email='${values.Email}'
                                    where Id=${user.Id}`,
        }
    }

    /**
     * # DON'T PASS APOSTROPHES AS ARGUMENTS HERE!
     */
    static get PostQueries() {
        return {
            MakeUser: (user: User) => `insert into MovieUser
                                        values ('${user.Name}','${user.Email}','${user.Password}', '${user.IsAdmin}');`,
            MakeFavourite: (userId: number, movieId: number) =>
                                        `insert into Favourites
                                        values ('${userId}','${movieId}');`,
            MakeMovie: (movie: IMovie) => `insert into Movie
                                            values (
                                                '${movie.Title}',
                                                '${movie.Director}',
                                                '${movie.Description}',
                                                '${movie.ImageLink}',
                                                ${movie.Year},
                                                ${movie.Duration},
                                                '${movie.Genre}');`
        }
    }

    static get DeleteQueries() {
        return {
            DeleteFromFavourites: (userId: number, movieId: number) => `delete from
                                                                        Favourites
                                                                        where UserId=${userId}
                                                                        and MovieId=${movieId};`,
            DeleteAllFavourites: (userId: number) => `delete from Favourites where UserId=${userId};`,
            DeleteMovie: (movieId: number) => `delete from Movie where Id=${movieId}`
        }
    }
}
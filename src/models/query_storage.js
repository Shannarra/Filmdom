class QueryStorage {
    static get AllMovies() {
        return "select * from Movie";
    }
    
    static get AllUsers() {
        return "select * from MovieUser";
    }

    static MoviesFrom(ids) {
        return `select * from Movie where Id in ${ids}`;
    }

    static UserFavouriteIds(userid) {
        return `select MovieId from 
            MovieUser join Favourites
            on MovieUser.Id = Favourites.UserId
            where UserId = ${userid}`;
    }
}

module.exports = QueryStorage;
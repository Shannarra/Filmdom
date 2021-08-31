class QueryStorage {
    static get AllMovies() {
        return "select * from Movie";
    }
    
    static get AllUsers() {
        return "select * from MovieUser";
    }
}

module.exports = QueryStorage;
const router = require('express').Router();
const Favourites = require('./models/favourites');
const Movie = require('./models/movie');
const User = require('./models/user');

//http://127.0.0.1:6188/api/movies
router.get('/movies',  async(req, res) => {
    try {
        res.send(await Movie.All);   
    } catch (e) {
        res.status(500).send(JSON.stringify({message: e}))
    }
});

http://127.0.0.1:6188/api/users
router.get('/users',  async(req, res) => {
    try {
        res.send(await User.All);   
    } catch (e) {
        res.status(500).send(JSON.stringify({message: e}))
    }
});

// http://127.0.0.1:6188/api/user/2/favourites
router.get('/user/:id/favourites', async(req,res)=> { 
    try {
        res.send(await Favourites.UserFavouriteMovies(req.params.id));
    } catch (e) {
        res.status(500).send(JSON.stringify({message: e}))
    }
})

module.exports = router;
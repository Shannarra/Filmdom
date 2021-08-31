const router = require('express').Router();
const Favourites = require('./models/favourites');
const Movie = require('./models/movie');
const User = require('./models/user');

router.get('/movies',  async(req, res) => {
    try {
        res.send(await Movie.All);   
    } catch (e) {
        res.status(500).send(JSON.stringify({message: e}))
    }
});

router.get('/users',  async(req, res) => {
    try {
        res.send(await User.All);   
    } catch (e) {
        res.status(500).send(JSON.stringify({message: e}))
    }
});

router.get('/user/:id/favourites', async(req,res)=> { 
    try {
        res.send(await Favourites.UserFavouriteIds(req.params.id));
    } catch (e) {
        res.status(500).send(JSON.stringify({message: e}))
    }
})

module.exports = router;
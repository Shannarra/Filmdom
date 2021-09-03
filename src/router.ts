const router = require('express').Router();
import {Response, Request} from 'express';
import Favourites from './models/favourites';
import Movie from './models/movie';
import User from './models/user';

const HANDLE_ERR = (res: Response, e: Error) => {
    if (e.message !== "404")
        res.status(500).send(JSON.stringify({ message: e }));
    else 
        res.status(404).send(JSON.stringify({ message: "Items not found"}));
}

//#region gets

//http://127.0.0.1:6188/api/movies
router.get('/movies', async (req: Request, res: Response) => {
    try {
        res.send(await Movie.All);
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

router.get('/movie/:id', async (req: Request, res: Response) => {
    try {
        res.send(await Movie.Find(Number(req.params.id)));
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

//http://127.0.0.1:6188/api/users
router.get('/users', async (req: Request, res: Response) => {
    try {
        res.send(await User.All);
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

// http://127.0.0.1:6188/api/user/2/favourites
router.get('/user/:id/favourites', async (req: Request, res: Response) => {
    try {
        res.send(await Favourites.UserFavouriteMovies(Number(req.params.id)));
    } catch (e) {
        HANDLE_ERR(res, e);
    }
})

//#endregion


//#region updates
router.put('/movie/:id', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        res.send(req.body);
        //res.send(await Movie.Update(req.params.id, req.body))
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

//#endregion


//#region posts

//#endregion

export default router;
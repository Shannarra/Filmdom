const router = require('express').Router();
import {Response, Request} from 'express';
import JWTVerifiedRequest, {tokenVerifier} from './middleware/jwt';
import assure_logged_in from './middleware/logged';

import { GetAllMovies, GetAllUsers, GetMovieById, GetMyFavourites, GetMyInfo } from './actions/get_actions';
import { LogIn, LogOut, SignUp } from './actions/logging_actions';
import { AddFavourite, CreateMovie } from './actions/post_actions';
import { UpdateAccount, UpdateMovie } from './actions/put_actions';
import { DeleteAFavourite, DeleteAllFavourites, DeleteMovie } from './actions/delete_actions';

router.get('/*', (_, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
}).post('/*', (_, res, next) =>{ 
    res.setHeader('Content-Type', 'application/json')
    next()
}).put('/*', (_, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
}).delete('/*', (_, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
});

//#region gets

//http://127.0.0.1:6188/api/movies
router.get('/movies', async(req: JWTVerifiedRequest, res: Response) => {
    await GetAllMovies(req, res);
});

router.get('/movie/:id', async (req: Request, res: Response) => {
    await GetMovieById(req, res);
});

//http://127.0.0.1:6188/api/users
router.get('/users', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    await GetAllUsers(req, res);
});

// http://127.0.0.1:6188/api/my/favourites
router.get('/my/favourites', tokenVerifier, assure_logged_in, async (req: Request, res: Response) => {
    await GetMyFavourites(req, res);
})

router.get('/my/info', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    await GetMyInfo(req, res);
})
//#endregion


//#region updates
router.put('/movie/update/:id', tokenVerifier, assure_logged_in, async (req: Request, res: Response) => {
    await UpdateMovie(req, res);
});

/**
 * Updating the user does NOT allow change of password and admin
 * state!
 */
router.put('/my/update', tokenVerifier, assure_logged_in, async (req: Request, res: Response) => {
    await UpdateAccount(req, res);
});

//#endregion

//#region posts
router.post('/login', async(req: any, res: Response) => {
    await LogIn(req, res);
})
    
router.post('/signup', async (req: Request, res: Response) => {
    await SignUp(req, res);
})

router.post('/logout', (req: Request, res: Response) => {
    LogOut(req, res);    
})

router.post('/my/favourites/add/:id', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    await AddFavourite(req, res);
});

router.post('/movie/create', tokenVerifier, async(req: Request, res: Response) => {
    await CreateMovie(req, res);
});

//#endregion


//#region deletes
router.delete('/my/favourites/delete/:id', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    await DeleteAFavourite(req, res);
})

router.delete('/my/favourites/', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    await DeleteAllFavourites(req, res);
})

router.delete('/movie/:id', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    await DeleteMovie(req, res);
});

//#endregion
export default router;
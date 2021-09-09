const router = require('express').Router();
import {Response, Request} from 'express';
import JWTVerifiedRequest, {matchToken, signToken, tokenVerifier} from './middleware/jwt';
import ApplicationRecord from './models/application_record';
import Favourites from './models/favourites';
import Movie from './models/movie';
import User from './models/user';

const HANDLE_ERR = (res: Response, e: Error) => {
    if (e.toString() !== "404")
        res.status(500).send(JSON.stringify({ message: e.message }));
    else 
        res.status(404).send(JSON.stringify({ message: "Items not found"}));
}

//#region gets

//http://127.0.0.1:6188/api/movies
router.get('/movies', async(req: JWTVerifiedRequest, res: Response) => {
    try {
        res.send(
            JSON.stringify({
                movies: await Movie.All,
                //data: data
            })
        );
    } catch (e) { 
        console.log('here ' + req.token);
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
router.get('/users', tokenVerifier, async(req: Request, res: Response) => {
    try {
        res.send(await User.All);
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

// http://127.0.0.1:6188/api/user/2/favourites
router.get('/user/:id/favourites', tokenVerifier, async (req: Request, res: Response) => {
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
router.post('/login', async(req: any, res: Response) => {
    if (!req.body) 
        res.send(JSON.stringify({message: "Empty request body"})).status(400);
        
    const usr = req.body;
    const {error} = ApplicationRecord.validateUser(usr);
    if (!error) {
        const dbUser = new User(await User.authenticate(usr));
        
        if (dbUser.matchesPropertiesCorrectly(usr))
            signToken(req, res, usr);
        else 
            HANDLE_ERR(res, new Error("Invalid user object"));
    }
    else
        HANDLE_ERR(res, error);
    
    
})
    
router.post('/signup', async (req: Request, res: Response) => {
    if (!req.body) 
        res.send(JSON.stringify({message: "Empty request body"})).status(400);

    const givenUser = req.body;
    const {error} = ApplicationRecord.validateUser(givenUser);
    if (!error) {
        const prep = await User.prepare(givenUser); 
       
        let exists;
        
        try {
            exists = await User.exists(prep);
        }
        catch (e) { /**user with that name doesn't exist */ }
        
        if (exists)
            HANDLE_ERR(res, new Error(`User with "${prep.Name}" or with that email already exists!`))
        else {
            //user doesn't exist
            try {
                await User.create(prep);
            } catch(e) {
                if (e !== "404")
                    HANDLE_ERR(res, e);
                else
                    res.send(JSON.stringify({
                        message: "User \"" + prep.Name+ "\" created successfuly!"
                    }));
            }
        }        
    }
    else 
        HANDLE_ERR(res, error);
})

//#endregion

export default router;
const router = require('express').Router();
import {Response, Request} from 'express';
import JWTVerifiedRequest, {matchToken, signToken, tokenVerifier} from './middleware/jwt';
import assure_logged_in from './middleware/logged';
import ApplicationRecord from './models/application_record';
import Favourites from './models/favourites';
import Movie from './models/movie';
import User, { IUserProps } from './models/user';
import fs, {writeFileSync, readFileSync, existsSync, open, readFile} from 'fs';
import QueryStorage from './models/query_storage';
import IMovie from './models/movie';

const USER_STORAGE_PATH = './__user_storage.json';

const GetCurrentUserInfo = () => JSON.parse(readFileSync(USER_STORAGE_PATH).toString());

const HANDLE_ERR = (res: Response, e: Error) => {
    res.setHeader('Content-Type', 'application/json');
    if (e.toString() !== "404")
        res.status(500).send(JSON.stringify({ message: e.message }));
    else 
        res.status(404).send(JSON.stringify({ message: "Items not found"}));
}

router.get('/*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
}).post('/*', (req, res, next) =>{ 
    res.setHeader('Content-Type', 'application/json')
    next()
}).put('/*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
});

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
router.get('/users', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    try {
        if (GetCurrentUserInfo().IsAdmin)
            res.send(await User.All);
        else
            HANDLE_ERR(res, new Error("You don't have the privileges to acces this info!"))
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

// http://127.0.0.1:6188/api/my/favourites
router.get('/my/favourites', tokenVerifier, assure_logged_in, async (req: Request, res: Response) => {
    try {
        let id = JSON.parse(readFileSync(USER_STORAGE_PATH).toString()).Id;
        res.send(await Favourites.UserFavourites(id));
    } catch (e) {
        HANDLE_ERR(res, e);
        
    }
})

router.get('/my/info', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    try {
        res.send(readFileSync(USER_STORAGE_PATH))
    } 
    catch (e) {
        HANDLE_ERR(res, e);
    }
})

//#endregion


//#region updates
router.put('/movie/update/:id', tokenVerifier, assure_logged_in, async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        await Movie.Find(req.params.id);

        try {
            const {error} = ApplicationRecord.ValidateMovie(req.body);
            
            if (!error)
                //@ts-ignore
                await Movie.Update(Number(req.params.id), req.body);
            else
                HANDLE_ERR(res, error)
        } catch (er) {
            if (er !== "404")
                HANDLE_ERR(res, er);
            else 
                res.send(JSON.stringify({
                    message: "Movie updated!"
                }));
        }
    } catch (_error) {
        if (_error === "404") 
            HANDLE_ERR(res, new Error("Movie with this id doensn't exist"))
        else
            HANDLE_ERR(res, _error);
    }
});

/**
 * Updating the user does NOT allow change of password and admin
 * state!
 */
router.put('/my/update', tokenVerifier, assure_logged_in, async (req: Request, res: Response) => {
    try {
        const curr = new User(GetCurrentUserInfo())
        
    //@ts-ignore
        if (await User.ComparePasswords(req.body.Password, curr.Password)) { //the body is the same as the current user
            try {
                await User.Update(curr, req.body);
            }
            catch (_er) { 
                if(_er !== "404")
                    HANDLE_ERR(res, _er);
                else 
                    res.send(JSON.stringify(
                        {message: "User updated successfully!"}
                        ));
            }
        } else { // tryna update someone else's profile, eh? Fuck off
            HANDLE_ERR(res, new Error("Cannot access another person's profile"));
            return;
        }
    } catch (e) {
        HANDLE_ERR(res, e);
    }
});

//#endregion

//#region posts
router.post('/login', async(req: any, res: Response) => {
    

    if (!req.body) 
        res.send(JSON.stringify({message: "Empty request body"})).status(400);

    if (!existsSync(USER_STORAGE_PATH)){
        writeFileSync(USER_STORAGE_PATH, ''); //WARN!: Nodemon will restart the server upon file creation
    }
        
    const usr = req.body;
    const {error} = ApplicationRecord.ValidateUser(usr);
    if (!error) {
        const dbUser = new User(await User.Authenticate(usr));

        let data = readFileSync(USER_STORAGE_PATH);
        
        if (data.length > 0) {
            HANDLE_ERR(res, new Error("There is a user logged in already"));
            return;
        }
        
        if (await dbUser.MatchesPropertiesCorrectly(usr))
        { 
            writeFileSync(USER_STORAGE_PATH, JSON.stringify(dbUser));

            signToken(req, res, usr); 
        }
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
    const {error} = ApplicationRecord.ValidateUser(givenUser);
    if (!error) {
        const prep = await User.Prepare(givenUser); 
       
        let exists;
        
        try {
            exists = await User.Exists(prep);
        }
        catch (e) { /**user with that name doesn't exist */ }
        
        if (exists)
            HANDLE_ERR(res, new Error(`User with "${prep.Name}" or with that email already exists!`))
        else {
            //user doesn't exist
            try {
                await User.Create(prep);
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

router.post('/logout', (req: Request, res: Response) => {
    if (existsSync(USER_STORAGE_PATH) && readFileSync(USER_STORAGE_PATH)?.length > 0) {
        writeFileSync(USER_STORAGE_PATH, '');
        res.send(JSON.stringify({message: "Logged out"}));
    } else {
        HANDLE_ERR(res, new Error("Attempted logout with no user logged in."));
    }
    
})

router.post('/my/favourites/add/:id', tokenVerifier, assure_logged_in, async(req: Request, res: Response) => {
    try {
        let movie = {};
        try {
            movie = await Movie.Find(Number(req.params.id));
        } catch (error) {
            HANDLE_ERR(res, new Error(`No movie with id "${req.params.id}" exists`))
            return;
        }
        const usr = GetCurrentUserInfo();
        let favourites = [];
        try {
            favourites = await Favourites.UserFavourites(usr.Id) as any[];
        } catch (_er) {
            // no favourites found
            console.log("no favs");
        }
        
        if (favourites.length > 0 && (favourites as any[]).find(x => x.Id == req.params.id)) {
            HANDLE_ERR(res, new Error(`Movie with id "${req.params.id}" is already in user "${usr.Name}"s favourites`));
        }
        else {
            try {
                //@ts-ignore
                await Favourites.AddFavourite(usr.Id, movie.Id)
            } catch (_e) {
                //items not found error, we good!
                res.send(JSON.stringify({
                    //@ts-ignore
                    message: `Movie "${movie.Title}" added to favourites!`
                }));
            }

        }
    } catch (error) {
        HANDLE_ERR(res, error);
    }
});

router.post('/movie/create', tokenVerifier, async(req: Request, res: Response) => {
    if (!req.body) 
        res.send(JSON.stringify({message: "Empty request body"})).status(400);

    const movieSent = req.body;
    const {error} = ApplicationRecord.ValidateMovie(movieSent);

    if (!error) {
        let exists;
        try {
            exists = await Movie.FindByProps(movieSent);
        } catch (_e) {
            if (_e !== "404")
                HANDLE_ERR(res, _e);
        }

        if (exists) {
            HANDLE_ERR(res, new Error(`Movie with title "${movieSent.Title}" and picture already exists!`))
        } else {
            try {
                await Movie.Create(movieSent);       
            } catch (__e) {
                if (__e !== "404") 
                    HANDLE_ERR(res, __e);
                else 
                    res.send(JSON.stringify({
                        message: "Movie \"" + movieSent.Title + "\" created successfuly!"
                    }));
            }
        }
    }
    else
        HANDLE_ERR(res, error);
});

//#endregion

export default router;
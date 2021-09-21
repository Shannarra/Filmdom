import {Response, Request} from 'express';
import ApplicationRecord from '../models/application_record';
import Favourites from '../models/favourites';
import Movie from '../models/movie';
import HANDLE_ERR from './helpers/error';
import GetCurrentUserInfo from './helpers/util';

export async function AddFavourite(req: Request, res: Response){
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
        }
        // tslint:disable no-empty
        catch (_er) {
        }

        // tslint:disable triple-equals
        if (favourites.length > 0 && (favourites as any[]).find(x => x.Id == req.params.id)) {
            HANDLE_ERR(res, new Error(`Movie with id "${req.params.id}" is already in user "${usr.Name}"s favourites`));
        }
        else {
            try {
                // @ts-ignore
                await Favourites.AddFavourite(usr.Id, movie.Id)
            } catch (_e) {
                // items not found error, we good!
                res.send(JSON.stringify({
                    // @ts-ignore
                    message: `Movie "${movie.Title}" added to favourites!`
                }));
            }

        }
    } catch (error) {
        HANDLE_ERR(res, error);
    }
}

export async function CreateMovie(req: Request, res: Response){
    if (!req.body)
        res.send(JSON.stringify({message: "Empty request body"})).status(400);

    const movieSent = JSON.parse(req.body);
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
            }
            // tslint:disable variable-name
            catch (__e) {
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
}
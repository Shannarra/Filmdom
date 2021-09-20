import {Response, Request} from 'express';
import User from '../models/user';
import Movie from '../models/movie';
import HANDLE_ERR from './helpers/error';
import GetCurrentUserInfo, { USER_STORAGE_PATH } from './helpers/util';

export async function DeleteAFavourite(req: Request, res: Response){
    try {
        const usr: User = GetCurrentUserInfo();
        try {
            //@ts-ignore
            await Movie.Find(req.params.id)
        } catch (_er) {
           return HANDLE_ERR(res, _er);            
        }
        await User.RemoveFromFavourites(usr.Id, Number(req.params.id));
    } catch (error) {
        if (error !== "404")
            HANDLE_ERR(res, error);
        else 
            res.send(JSON.stringify({
                message: `Movie with id "${req.params.id}" removed from favourites`
            }));
    }
}

export async function DeleteAllFavourites(req: Request, res: Response){
    try {
        const usr: User = GetCurrentUserInfo();
        await User.RemoveAllFavourites(usr.Id);
    } catch (error) {
        if (error !== "404")
            HANDLE_ERR(res, error);
        else 
            res.send(JSON.stringify({
                message: `All your favourites were removed!`
            }));
    }
}

export async function DeleteMovie(req: Request, res: Response){
    if (GetCurrentUserInfo().IsAdmin){
        try {
            const id = Number(req.params.id);
            try {
                await Movie.Find(id);
            } catch (_e) {
                return HANDLE_ERR(res, _e);
            }

            await Movie.Delete(id);
        } catch (error) {
            if (error !== "404")
                HANDLE_ERR(res, error);
            else 
                res.send(JSON.stringify({
                    message: `Movie with id "${req.params.id}" deleted successfuly!`
                }));
        }
    } else {
        HANDLE_ERR(res, new Error("You don't have permission to do this!"));
    }
}
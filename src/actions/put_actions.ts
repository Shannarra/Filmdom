import {Response, Request} from 'express';
import ApplicationRecord from '../models/application_record';
import User from '../models/user';
import Movie from '../models/movie';
import HANDLE_ERR from './helpers/error';
import GetCurrentUserInfo, { USER_STORAGE_PATH } from './helpers/util';

export async function UpdateMovie(req: Request, res: Response){
    try {
        // @ts-ignore
        await Movie.Find(req.params.id);

        try {
            const {error} = ApplicationRecord.ValidateMovie(req.body);

            if (!error)
                // @ts-ignore
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
}

export async function UpdateAccount(req: Request, res: Response){
    try {
        const curr = new User(GetCurrentUserInfo())

    // @ts-ignore
        if (await User.ComparePasswords(req.body.Password, curr.Password)) { // the body is the same as the current user
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
}
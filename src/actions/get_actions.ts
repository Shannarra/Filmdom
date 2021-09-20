import {Response, Request} from 'express';
import { readFileSync } from 'fs';
import JWTVerifiedRequest from "../middleware/jwt";
import Favourites from '../models/favourites';
import Movie from '../models/movie';
import User from '../models/user';
import HANDLE_ERR from './helpers/error';
import GetCurrentUserInfo, { USER_STORAGE_PATH } from './helpers/util';

export async function GetAllMovies(req: JWTVerifiedRequest, res: Response){
    try {
        res.send(
            JSON.stringify({
                movies: await Movie.All
            })
        );
    } catch (e) {
        HANDLE_ERR(res, e);
    }
}

export async function GetMovieById(req: Request, res: Response){
    try {
        res.send(await Movie.Find(Number(req.params.id)));
    } catch (e) {
        HANDLE_ERR(res, e);
    }
}

export async function GetAllUsers(req: Request, res: Response){
    try {
        if (GetCurrentUserInfo().IsAdmin)
        res.send(await User.All);
        else
        HANDLE_ERR(res, new Error("You don't have the privileges to acces this info!"))
    } catch (e) {
        HANDLE_ERR(res, e);
    }
}

export async function GetMyFavourites(req: Request, res: Response){
    try {
        const id = JSON.parse(readFileSync(USER_STORAGE_PATH).toString()).Id;
        res.send(await Favourites.UserFavourites(id));
    } catch (e) {
        HANDLE_ERR(res, e);
    }
}


export async function GetMyInfo(req: Request, res: Response){
    try {
        res.send(readFileSync(USER_STORAGE_PATH))
    }
    catch (e) {
        HANDLE_ERR(res, e);
    }
}
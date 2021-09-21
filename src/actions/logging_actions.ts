import {Response, Request} from 'express';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { signToken } from '../middleware/jwt';
import ApplicationRecord from '../models/application_record';
import User from '../models/user';
import HANDLE_ERR from './helpers/error';
import { USER_STORAGE_PATH } from './helpers/util';

export async function LogIn(req: Request, res: Response){
    if (Object.entries(req.body).length === 0)
        return res.send(JSON.stringify({message: "Empty request body"})).status(400);

    if (!existsSync(USER_STORAGE_PATH)){
        writeFileSync(USER_STORAGE_PATH, ''); // WARN!: Nodemon will restart the server upon file creation
    }

    const usr = req.body
    const {error} = ApplicationRecord.ValidateUser(usr);
    if (!error) {
        let dbUser;
        try {
            dbUser = new User(await User.Authenticate(usr));
        } catch (err) {
            if (err === "404")
                return HANDLE_ERR(res, new Error("Invalid credentials for user \"" + usr.Name +"\""))
            return HANDLE_ERR(res, err)
        }

        const data = readFileSync(USER_STORAGE_PATH);

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
}

export async function SignUp(req: Request, res: Response){
    if (Object.entries(req.body).length === 0)
        return res.send(JSON.stringify({message: "Empty request body"})).status(400);

    const givenUser = JSON.parse(req.body);
    const {error} = ApplicationRecord.ValidateUser(givenUser);
    if (!error) {
        const prep = await User.Prepare(givenUser);

        let exists;

        try {
            exists = await User.Exists(prep);
        }
        // tslint:disable jsdoc-format
        catch (e) { /**user with that name doesn't exist */ }

        if (exists)
            HANDLE_ERR(res, new Error(`User with "${prep.Name}" or with that email already exists!`))
        else {
            // user doesn't exist
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
}

export function LogOut(req: Request, res: Response){
    if (existsSync(USER_STORAGE_PATH) && readFileSync(USER_STORAGE_PATH)?.length > 0) {
        writeFileSync(USER_STORAGE_PATH, '');
        res.send(JSON.stringify({message: "Logged out"}));
    } else {
        HANDLE_ERR(res, new Error("Attempted logout with no user logged in."));
    }
}
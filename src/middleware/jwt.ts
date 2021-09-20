import { Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import config from 'config';
import User from '../models/user';

const JWT_SECRET = config.get('app.JWTSecret');

export default interface JWTVerifiedRequest extends Request {
    token?: string;
}

export function tokenVerifier(req: JWTVerifiedRequest, res: Response, next: any) {
    const bearer = req.headers.authorization;
    if (bearer) {
        req.token = bearer.split(' ')[1];
        matchToken(req, res, next);
    } else {
        res.status(403).send("{message: \"Access forbidden.\"}");
    }
}

export function matchToken(req: JWTVerifiedRequest, res: Response, callback: any) {
    if (req.token) {
        Jwt.verify(
            req.token,
            JWT_SECRET,
            callback
        );
    }
}

export function signToken(req: Request, res: Response, user: User) {
    Jwt.sign(
        {user},
        JWT_SECRET,
        (e, token) => {
            if (e)
                res.send(e).status(500);
            res.json({token});
        }
    )
}
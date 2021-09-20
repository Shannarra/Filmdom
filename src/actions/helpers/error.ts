import {Response} from 'express';

export default function HANDLE_ERR(res: Response, e: Error) {
    res.setHeader('Content-Type', 'application/json');
    if (e.toString() !== "404")
        res.status(500).send(JSON.stringify({ message: e.message }));
    else 
        res.status(404).send(JSON.stringify({ message: "Items not found"}));
}
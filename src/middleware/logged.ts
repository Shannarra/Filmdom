import { existsSync, readFileSync } from "fs";
const USER_STORAGE_PATH = './__user_storage.json';

export default function assure_logged_in(req, res, next) {
    if (existsSync(USER_STORAGE_PATH) && readFileSync(USER_STORAGE_PATH)?.length > 0)
        next();
    else
        res.status(403).send("{\"message\": \"Not logged in\" }");
}
import { readFileSync } from "fs";

export const USER_STORAGE_PATH = './__user_storage.json';

export default function GetCurrentUserInfo() {
    return JSON.parse(readFileSync(USER_STORAGE_PATH).toString())
};

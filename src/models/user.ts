import ApplicationRecord from './application_record';
import QueryStorage from './query_storage';
import bcrypt from 'bcryptjs';

// tslint:disable no-var-requires
const SALTS = require('config').get('app.BcryptSalts')

export interface IUserProps {
    Id?: number;
    Name: string;
    Email: string;
    Password: string;
    IsAdmin?: boolean;
}

export default class User extends ApplicationRecord implements IUserProps {


    Id?: number;
    Name: string;
    Email: string;
    Password: string;
    IsAdmin?: boolean;

    constructor(obj) {
        super();
        const { error } = ApplicationRecord.ValidateUser({
            Id: obj.Id,
            Name: obj.Name,
            Email: obj.Email,
            Password: obj.Password,
            IsAdmin: obj.IsAdmin
        });

        if (!error) {
            this.Id = obj.Id;
            this.Name = obj.Name;
            this.Email = obj.Email;
            this.Password = obj.Password;
            this.IsAdmin = obj.IsAdmin;
        } else {
            throw error;
        }
    }


    async MatchesPropertiesCorrectly(usr: User): Promise<boolean> {
        // the "this" is the DB user

        const passwordsMatch = await User.ComparePasswords(usr.Password, this.Password);

        return (
            this.Name === usr.Name &&
            passwordsMatch &&
            this.Email === usr.Email &&
            this.IsAdmin === Boolean(usr.IsAdmin || 0)
        );
    }

    static async ComparePasswords(userPass, fromDb) {
        return await bcrypt.compare(userPass, fromDb);
    }

    static async Prepare(givenUser: any): Promise<User> {
        const hashed = await User.Hash(givenUser);

        return new User({
            Id: givenUser.Id,
            Name: givenUser.Name,
            Email: givenUser.Email,
            Password: hashed,
            IsAdmin: givenUser.IsAdmin
        })
    }

    static Authenticate(wannabe) {
        const { error } = ApplicationRecord.ValidateUser(wannabe);

        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindUser(wannabe.Name, wannabe.Email),
            (users) => {
                if (error)
                    throw error;
                if (users.length > 1)
                    throw Error("Too many users");

                return users[0];
            }
        );
    }
    static Exists(prep: User) {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindUser(prep.Name, prep.Email),
            (items) => {
                return items[0];
            }
        )
    }

    static Create(u: User) {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.PostQueries.MakeUser(u)
        )
    }

    static Find(name: string, email: string) {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindUser(name, email)
        );
    }

    static Update(user: User, newValues: IUserProps) {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.UpdateQueries.UpdateUser(user, newValues)
        )
    }

    static RemoveFromFavourites(userid: number, movieId: number) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.DeleteQueries.DeleteFromFavourites(userid, movieId)
        )
    }

    static RemoveAllFavourites(id: number) {
        return this.PromiseHandledSQLTransaction(
            QueryStorage.DeleteQueries.DeleteAllFavourites(id)
        )
    }


    static get All() {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllUsers()
        );
    }

    static Hash(givenUser): Promise<string> {
        return new Promise(
            (resolve, reject) => {
                bcrypt.genSalt(SALTS, (e, salt) => {
                    if (!e)
                        bcrypt.hash(givenUser.Password, salt, (er, hash) => {
                            if (!er)
                                resolve(hash);
                            else
                                reject(er);
                        })
                    else
                        reject(e);
                })
            }
        )
    }
}
import ApplicationRecord from './application_record';
import QueryStorage from './query_storage';
import bcrypt from 'bcryptjs';

const SALTS = require('config').get('app.BcryptSalts')

export default class User extends ApplicationRecord {


    public Id: number;
    public Name: string;
    public Email: string;
    public Password: string;
    public IsAdmin: boolean;


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
        //the "this" is the DB user

        const passwordsMatch = await User.ComparePasswords(usr.Password, this.Password);

        return (
            this.Name === usr.Name &&
            passwordsMatch &&
            this.Email === usr.Email &&
            this.IsAdmin === Boolean(usr.IsAdmin || 0)
        );
    }

    static async ComparePasswords(user_pass, from_db) {
        return await bcrypt.compare(user_pass, from_db);
    }

    static async Prepare(givenUser: any): Promise<User> {
        let hashed = await User.Hash(givenUser);

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

    static get All() {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllUsers()
        );
    }

    private static Hash(givenUser): Promise<string> {
        return new Promise(
            (resolve, reject) => {
                bcrypt.genSalt(SALTS, (e, salt) => {
                    if (!e)
                        bcrypt.hash(givenUser.Password, salt, (e, hash) => {
                            if (!e)
                                resolve(hash);
                            else
                                reject(e);
                        })
                    else
                        reject(e);
                })
            }
        )
    }
}
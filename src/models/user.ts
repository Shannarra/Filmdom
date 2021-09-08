import ApplicationRecord from './application_record';
import QueryStorage from './query_storage';
import bcrypt from 'bcryptjs';

export default class User extends ApplicationRecord {
    public Name: string;
    public Email: string;
    public Password: string;
    public IsAdmin: boolean;


    constructor(obj) {
        super();
        const {error} = ApplicationRecord.validateUser({
            Name: obj.Name,
            Email: obj.Email, 
            Password: obj.Password, 
            IsAdmin: obj.IsAdmin});
        if (!error) {
            this.Name = obj.Name;
            this.Email = obj.Email;
            this.Password = obj.Password;
            this.IsAdmin = obj.IsAdmin;
        } else {
            throw error;
        }
    }

    matchesPropertiesCorrectly(usr: User): boolean {
        return(
            this.Name === usr.Name &&
            this.Password === usr.Password && // TEMPORARY!
            this.Email === usr.Email &&
            this.IsAdmin === Boolean(usr.IsAdmin || 0)
        );
    }

    static authenticate(wannabe) {
        const {error} = ApplicationRecord.validateUser(wannabe);

        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.FindUser(wannabe.Name),
            (users) => {
                if (error)
                    throw error;
                if (users.length > 1)
                    throw Error("Too many users");
                
                return users[0];
            }
        );

    }

    static get All() {
        return ApplicationRecord.PromiseHandledSQLTransaction(
            QueryStorage.GetQueries.AllUsers()    
        );  
    }
}
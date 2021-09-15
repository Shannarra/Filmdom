/**
 * In order to run you'll need to have ts-node installed
 * use the command: npm install -g ts-node
 */

import express from 'express';
import cors from 'cors';
import config from 'config';
import session from 'express-session';
import cookieParser from 'cookie-parser'

const app = express();
const PORT =  process.env.PORT || config.get('app.PORT') || 6188;
import router from './router';

/*
the biggest piece of shit in existance. In order to have a session it needs to be atop of
the routing declaration. Took me too much time to figure this shit out, and I'm pissed at
the JS shitfuckery...
Link to solution: https://stackoverflow.com/a/39796445/11542917
*/
app.use(session({ 
    resave: true, 
    secret: '123456', 
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 3600),
        secure: true
    }
})); 
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(cookieParser());

const server = app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log("KÖÓOl b0s, im @ localhost:" + PORT);
});


import {writeFileSync} from 'fs';
process.on('exit', () => {
    writeFileSync('__user_storage.json', ''); 
});

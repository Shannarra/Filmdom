/**
 * In order to run you'll need to have ts-node installed
 * use the command: npm install -g ts-node
 */

import ex from 'express';
import config from 'config';
const app = ex();
const PORT =  process.env.PORT || config.get('app.PORT') || 6188;
import router from './router';

app.use('/api', router);

app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log("KÖÓOl b0s, im @ localhost:" + PORT);
});

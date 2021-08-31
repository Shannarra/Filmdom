const ex = require('express');
const config = require('config');
const app = ex();
const PORT =  process.env.PORT || config.get('app.PORT');
const router = require('./src/router');

app.use('/api', router);

app.listen(PORT, () => {console.log("KÖÓOl b0s, im @ localhost:" + PORT);})
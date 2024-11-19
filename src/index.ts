import express from 'express';
import http from 'http'

import { Api } from './helpers/variables';
import { initRouter } from './router';
import { initMiddlewares } from './middlewares';
import { initDatabase } from './database';

const app = express();

initMiddlewares(app);
initRouter(app);
initDatabase();

const server = http.createServer(app);

server.listen(Api.PORT, () => {
    // clear console
    console.clear();
    console.log(`Server is running on port ${Api.PORT} ✔`);
});
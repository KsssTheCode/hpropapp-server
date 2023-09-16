import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import schedule from 'node-schedule';

import { authentication } from './src/middleware/is-auth.js';
import { systemClosing } from './src/middleware/systemClosing.js';

import db from './src/models/index.js';
import cookieParser from 'cookie-parser';
import mainRouter from './src/routes/mainRouter.js';

const app = express();
const port = 3302;

const sequelize = db.sequelize;

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: process.env.ALLOW_ORIGIN, credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));

async function syncDataBase(sequelize) {
   await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
}
syncDataBase(sequelize);

schedule.scheduleJob('01 00 00 * * *', systemClosing);

app.get('/', (req, res) => {
   res.send('Health Check');
});

app.use(authentication);

app.use('/', mainRouter);

app.use(async (error, req, res, next) => {
   console.log(error);
   res.status(error.status).json(error);
});

const server = app.listen(port);

// webSocket(server);

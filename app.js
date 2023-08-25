import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import schedule from 'node-schedule';

import { authentication } from './src/middleware/is-auth.js';
import { systemClosing } from './src/middleware/systemClosing.js';

import authRoutes from './src/routes/authRouter.js';
import roomRoutes from './src/routes/roomRouter.js';
import staffRoutes from './src/routes/staffRouter.js';
import roomTypeRoutes from './src/routes/roomTypeRouter.js';
import reservatinoRoutes from './src/routes/reservationRouter.js';
import groupReservationRoutes from './src/routes/groupReservationRouter.js';
import departmentRoutes from './src/routes/departmentRouter.js';
import rateTypeRoutes from './src/routes/rateTypeRouter.js';
import roomRateRoutes from './src/routes/roomRateRouter.js';
import membershipRoutes from './src/routes/membershipRouter.js';
import memberRoutes from './src/routes/memberRouter.js';
import groupRoutes from './src/routes/groupRouter.js';
import dailyRateRoutes from './src/routes/dailyRateRouter.js';
import memoRoutes from './src/routes/memoRouter.js';
import cleanStatusRoutes from './src/routes/cleanStatusRouter.js';
import reservationStatusRoutes from './src/routes/reservationStatusRouter.js';
import floorRoutes from './src/routes/floorRouter.js';
import db from './src/models/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3302;

const sequelize = db.sequelize;

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: process.env.ALLOW_ORIGIN, credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

async function syncDataBase(sequelize) {
   await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
}

syncDataBase(sequelize);

app.use(morgan('dev'));

schedule.scheduleJob('01 00 00 * * *', systemClosing);

app.get('/', (req, res) => {
   res.send('Health Check');
});

app.use(authentication);

app.use('/auth', authRoutes);
app.use('/staff', staffRoutes);
app.use('/room', roomRoutes);
app.use('/roomtype', roomTypeRoutes);
app.use('/rsvn', reservatinoRoutes);
app.use('/group-rsvn', groupReservationRoutes);
app.use('/dept', departmentRoutes);
app.use('/ratetype', rateTypeRoutes);
app.use('/roomrate', roomRateRoutes);
app.use('/membership', membershipRoutes);
app.use('/member', memberRoutes);
app.use('/group', groupRoutes);
app.use('/daily-rate', dailyRateRoutes);
app.use('/clean-status', cleanStatusRoutes);
app.use('/rsvn-status', reservationStatusRoutes);
app.use('/memo', memoRoutes);
app.use('/floor', floorRoutes);

app.use(async (error, req, res, next) => {
   console.log(error);
   res.status(error.status).json(error);
});

app.listen(port);

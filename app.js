import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { authentication } from './middleware/is-auth.js';

import authRoutes from './routes/authRouter.js';
import roomRoutes from './routes/roomRouter.js';
import roomTypeRoutes from './routes/roomTypeRouter.js';
import reservatinoRoutes from './routes/reservationRouter.js';
import groupReservationRoutes from './routes/groupReservationRouter.js';
import departmentRoutes from './routes/departmentRouter.js';
import rateTypeRoutes from './routes/rateTypeRouter.js';
import roomRateRoutes from './routes/roomRateRouter.js';
import membershipRoutes from './routes/membershipRouter.js';
import memberRoutes from './routes/memberRouter.js';
import groupRoutes from './routes/groupRouter.js';
import dailyRateRoutes from './routes/dailyRateRouter.js';
import memoRoutes from './routes/memoRouter.js';
import cleanStatusRoutes from './routes/cleanStatusRouter.js';
import reservationStatusRoutes from './routes/reservationStatusRouter.js';
import floorRoutes from './routes/floorRouter.js';
import db from './models/index.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3302;

const sequelize = db.sequelize;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.ALLOW_ORIGIN, credentials: true }));

async function syncDataBase(sequelize) {
   await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
}

syncDataBase(sequelize);

app.use(morgan('dev'));

app.get('/', (req, res) => {
   res.send('Health Check');
});

app.use(authentication);

app.use('/auth', authRoutes);
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
   res.status(error.status).send(error.message);
});

app.listen(port);

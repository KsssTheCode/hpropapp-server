import express from 'express';
import authRoutes from './authRouter.js';
import roomRoutes from './roomRouter.js';
import staffRoutes from './staffRouter.js';
import roomTypeRoutes from './roomTypeRouter.js';
import reservatinoRoutes from './reservationRouter.js';
import groupReservationRoutes from './groupReservationRouter.js';
import departmentRoutes from './departmentRouter.js';
import rateTypeRoutes from './rateTypeRouter.js';
import roomRateRoutes from './roomRateRouter.js';
import membershipRoutes from './membershipRouter.js';
import memberRoutes from './memberRouter.js';
import groupRoutes from './groupRouter.js';
import dailyRateRoutes from './dailyRateRouter.js';
import memoRoutes from './memoRouter.js';
import floorRoutes from './floorRouter.js';

const mainRouter = express.Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use('/staff', staffRoutes);
mainRouter.use('/room', roomRoutes);
mainRouter.use('/roomtype', roomTypeRoutes);
mainRouter.use('/rsvn', reservatinoRoutes);
mainRouter.use('/group-rsvn', groupReservationRoutes);
mainRouter.use('/dept', departmentRoutes);
mainRouter.use('/ratetype', rateTypeRoutes);
mainRouter.use('/roomrate', roomRateRoutes);
mainRouter.use('/membership', membershipRoutes);
mainRouter.use('/member', memberRoutes);
mainRouter.use('/group', groupRoutes);
mainRouter.use('/daily-rate', dailyRateRoutes);
mainRouter.use('/memo', memoRoutes);
mainRouter.use('/floor', floorRoutes);

export default mainRouter;

import express from 'express';
import * as controller from '../controllers/reservationStatusController.js';
// import * as validation from '../middleware/validation/reservationStatusValidation.js';
// import * as existance from '../middleware/existance/reservationStatusExistance.js';

const router = express.Router();

router.get('/get-rsvn-status', controller.getReservationStatus);
router.post('/create-rsvn-status', controller.createReservationStatus);
router.delete('/delete-rsvn-status', controller.deleteReservationStatus);

export default router;

import express from 'express';
import * as controller from '../controllers/dailyRateController.js';
import * as validation from '../middleware/validation/dailyRateValidation.js';
import * as existance from '../middleware/existance/dailyRateExistance.js';

const router = express.Router();

router.get(
   '/get-new-daily-rate',
   validation.getNewDailyRateValidation,
   existance.getNewDailyRateExistance,
   controller.getNewDailyRate
);

router.post(
   '/edit-specific-rsvn-daily-rate',
   validation.editSpecificRsvnDailyRateValidation,
   existance.editSpecificRsvnDailyRateExistance,
   controller.editSpecificRsvnDailyRate
);

export default router;

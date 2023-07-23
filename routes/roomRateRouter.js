import express from 'express';
import * as controller from '../controllers/roomRateController.js';
import * as validation from '../middleware/validation/roomRateValidation.js';
import * as existance from '../middleware/existance/roomRateExistance.js';

const router = express.Router();

router.post(
   '/initialize-roomrates',
   validation.getAndInitializeRoomRatesValidation,
   existance.checkRateTypeAndRoomTypeExistance,
   controller.initializeRoomRatesInTerm
);

router.get(
   '/get-all-roomrates-of-current-month',
   controller.getAllRoomRatesOfCurrentMonth
);

router.get(
   '/get-selected-roomrate',
   existance.getRoomRateExistanceOnly,
   controller.getSelectedRoomRate
);

router.get('/get-roomrates-by-indexes', controller.getRoomRateByIndexes);

router.post(
   '/edit-roomrates-in-options',
   validation.editRoomRatesInOptionsValidation,
   existance.checkRateTypeAndRoomTypeExistance,
   controller.editRoomRatesInOptions
);

router.post(
   '/edit-specific-roomrates',
   validation.editSpecificRoomRatesValidation,
   existance.editSpecificRoomRatesExistance,
   controller.editSpecificRoomRates
);

export default router;

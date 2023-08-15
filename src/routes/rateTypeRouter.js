import express from 'express';
import * as controller from '../controllers/rateTypeController.js';
import * as validation from '../middleware/validation/rateTypeValidation.js';
import * as existance from '../middleware/existance/rateTypeExistance.js';

const router = express.Router();

router.get(
   '/get-ratetypes-data-for-filter-selection',
   controller.getRateTypesDataForFilterSelection
);

router.post(
   '/create-ratetype',
   validation.createRateTypeValidation,
   existance.createRateTypeExistance,
   controller.createRateType
);

router.post(
   '/edit-ratetype',
   validation.editRateTypeValidation,
   existance.editRateTypeExistance,
   controller.editRateType
);

router.delete(
   '/delete-ratetype',
   validation.checkRateTypeValidationOnly,
   existance.checkRateTypeExistanceOnly,
   controller.deleteRateType
);
export default router;

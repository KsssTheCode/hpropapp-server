import express from 'express';
import * as controller from '../controllers/floorController.js';

import * as validation from '../middleware/validation/floorValidation.js';
import * as existance from '../middleware/existance/floorExistance.js';

const router = express.Router();

router.get('/get-floors-data', controller.getFloorsData);

router.post(
   '/create-floors-data',
   validation.createFloorsValidation,
   existance.craeteFloorsExistance,
   controller.createFloorsData
);

export default router;

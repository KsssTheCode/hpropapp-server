import express from 'express';
import * as controller from '../controllers/floorController.js';

import * as validation from '../middleware/validation/floorValidation.js';
import * as existance from '../middleware/existance/floorExistance.js';

const router = express.Router();

router.get('/get-floors', controller.getFloors);

router.post(
   '/create-floors',
   validation.createFloorsValidation,
   existance.craeteFloorsExistance,
   controller.createFloors
);

export default router;

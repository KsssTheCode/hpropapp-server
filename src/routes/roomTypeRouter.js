import express from 'express';

import * as validation from '../middleware/validation/roomTypeValidation.js';
import * as existance from '../middleware/existance/roomTypeExistance.js';
import * as controller from '../controllers/roomTypeController.js';

const router = express.Router();

//roomTypeController.createRoomType메소드에서 findOrCreate를 사용하므로 Exsitance 생략
router.post(
   '/create-roomtype',
   validation.createRoomTypeValidation,
   existance.createRoomTypeExistance,
   controller.createRoomType
);
router.get(
   '/get-roomtypes-data-for-filter-selection',
   controller.getRoomTypesDataForFilterSelection
);
router.get(
   '/get-selected-roomtype',
   validation.checkRoomTypeCodeValidationOnly,
   existance.checkRoomTypeExistanceOnly,
   controller.getSelectedRoomType
);
router.post(
   '/edit-roomtype',
   validation.editRoomTypeValidation,
   existance.editRoomTypeExistance,
   controller.editRoomType
);
router.delete(
   '/delete-roomtype',
   validation.checkRoomTypeCodeValidationOnly,
   existance.checkRoomTypeExistanceOnly,
   controller.deleteRoomType
);

export default router;

import express from 'express';
import * as controller from '../controllers/roomController.js';

import * as validation from '../middleware/validation/roomValidation.js';
import * as existance from '../middleware/existance/roomExistance.js';

const router = express.Router();

//roomController.createRooms메소드에서 findOrCreate를 사용해 existance검사 생략
router.post(
   '/create-rooms',
   validation.createEditDeleteRoomValidation,
   existance.createRoomsExistance,
   controller.createRooms
);

router.post(
   '/assign-room',
   validation.assignRoomValidation,
   existance.assignRoomExistance,
   controller.assignRoom
);

router.get('/get-rooms-for-room-preview', controller.getRoomsForRoomPreview);

router.get(
   '/get-rooms-in-options-for-assign',
   controller.getRoomsInOptionsForAssign
);

router.get('/get-all-rooms', controller.getAllRooms);
router.post(
   '/edit-roomtype-of-rooms',
   validation.createEditDeleteRoomValidation,
   existance.editRoosmsExistance,
   controller.editRoomTypeOfRooms
);
router.delete(
   '/delete-rooms-in-options',
   validation.createEditDeleteRoomValidation,
   existance.deleteRoomExistance,
   controller.deleteRooms
);

router.get('/get-all-rooms-for-preview', controller.getAllRoomsForPreview);

router.get(
   '/get-all-rooms-in-preview',
   validation.getRoomsForPreviewInOptionsValidation,
   existance.getRoomsInOptionsForPreviewExistance,
   controller.getRoomsInOptionsForPreview
);

export default router;

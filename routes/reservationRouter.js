import express from 'express';
import * as validation from '../middleware/validation/reservationValidation.js';
import * as existance from '../middleware/existance/reservationExistance.js';
import * as controller from '../controllers/reservationController.js';

const router = express.Router();

router.post('/create-test-rsvns', controller.createTestRsvns);

router.post(
   '/create-rsvn',
   validation.createRsvnValidation,
   existance.createRsvnExistance,
   controller.createRsvn
);

router.get(
   '/get-rsvns-in-options',
   // validation.getRsvnsInOptionsValidation,
   // existance.getRsvnsInOptionsExistance,
   controller.getRsvnsInOptions
);

// router.get(
//    '/get-canceled-rsvns-in-options',
//    validation.getRsvnsInOptionsValidation,
//    existance.getRsvnsInOptionsExistance,
//    controller.getCanceledRsvnsInOptions
// );

router.get(
   '/get-selected-rsvn',
   validation.checkRsvnIdValidationOnly,
   existance.checkRsvnExistanceOnly,
   controller.getSelectedRsvn
);

router.patch(
   '/edit-rsvn',
   validation.editRsvnValidation,
   existance.editRsvnExistance,
   controller.editRsvn
);

router.patch('/assign-room-to-rsvn', controller.assignRoomToRsvn);

router.patch(
   '/release-assigned-room-from-rsvn',
   controller.releaseAssignedRoomFromRsvn
);

// router.patch(
//    '/edit-status-only',
//    validation.editStatusOnlyValidation,
//    existance.editStatusOnlyExistance,
//    controller.editStatusOnly
// );

// router.delete(
//    '/cancel-rsvn',
//    validation.checkRsvnIdValidationOnly,
//    existance.checkRsvnExistanceOnly,
//    controller.cancelRsvn
// );

export default router;

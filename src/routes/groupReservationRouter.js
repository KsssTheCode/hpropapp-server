import express from 'express';
import * as controller from '../controllers/groupReservationController.js';
import * as validation from '../middleware/validation/groupReservationValidation.js';
import * as existance from '../middleware/existance/groupReservationExistance.js';

const router = express.Router();

router.post('/create-test-rsvns', controller.createTestRsvns);

router.post(
   '/create-group-rsvn',
   // validation.createGroupRsvnWithDetailRsvnsValidation,
   // existance.createGroupRsvnWithDetailRsvnsExistance,
   controller.createGroupRsvn
);

router.post(
   '/create-detail-rsvns',
   // validation.createDetailRsvnsOfGroupRsvn,
   // existance.createDetailRsvnsOfGroupRsvn,
   controller.createDetailRsvns
);

router.get(
   '/get-selected-group-rsvn',
   validation.checkGroupRsvnIdValidationOnly,
   existance.checkGroupRsvnExistanceAndStore,
   controller.getSelectedGroupRsvn
);

router.get(
   '/get-group-rsvns-in-options',
   validation.getGroupRsvnsInOptionsValidation,
   existance.getGroupRsvnsInOptionsExistance,
   controller.getGroupRsvnsInOptions
);

router.post(
   '/edit-group-rsvn',
   validation.editGroupRsvnValidation,
   existance.editGroupRsvnExistance,
   controller.editGroupRsvn
);

router.delete(
   '/cancel-group-rsvn',
   validation.checkGroupRsvnIdValidationOnly,
   existance.checkGroupRsvnExistanceOnly,
   controller.cancelGroupRsvn
);

router.delete('/delete-detail-rsvns', controller.deleteDetailRsvns);

export default router;

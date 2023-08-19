import express from 'express';
import * as controller from '../controllers/groupReservationController.js';
import * as validation from '../middleware/validation/groupReservationValidation.js';
import * as existance from '../middleware/existance/groupReservationExistance.js';

const router = express.Router();

router.post('/create-test-rsvns', controller.createTestRsvns);

router.post(
   '/create-group-rsvn',
   validation.createGroupRsvnValidation,
   controller.createGroupRsvn
);

router.post(
   '/create-detail-rsvns',
   validation.createDetailRsvnsValidation,
   existance.createDetailRsvnsExistance,
   controller.createDetailRsvns
);

router.get(
   '/get-selected-group-rsvn',
   validation.checkGroupRsvnIdValidationOnly,
   existance.checkGroupRsvnExistanceOnly,
   controller.getSelectedGroupRsvn
);

router.get(
   '/get-group-rsvns-in-filter-options',
   validation.getGroupRsvnsInFilterOptionsValidation,
   existance.getGroupRsvnsInFilterOptionsExistance,
   controller.getGroupRsvnsInFilterOptions
);

router.post(
   '/edit-group-rsvn',
   validation.editGroupRsvnValidation,
   existance.editGroupRsvnExistance,
   controller.editGroupRsvn
);

router.delete('/delete-detail-rsvns', controller.deleteDetailRsvns);

export default router;

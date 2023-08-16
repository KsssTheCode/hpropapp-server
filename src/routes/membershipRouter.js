import express from 'express';
import * as controller from '../controllers/membershipController.js';
import * as validation from '../middleware/validation/membershipValidation.js';
import * as existance from '../middleware/existance/membershipExistance.js';

const router = express.Router();

router.post(
   '/create-membership',
   validation.createMembershipValidation,
   existance.createMembershipExistance,
   controller.createMembership
);

router.get(
   '/get-memberships-data-for-filter-selection',
   controller.getMembershipsDataForFilterSelection
);

router.get(
   '/get-selected-memberships',
   existance.checkMembershipExistanceOnly,
   controller.getSelectedMemebership
);

router.post(
   '/edit-membership',
   validation.editMembershipValidation,
   existance.editMembershipExistance,
   controller.editMembership
);

router.delete(
   '/delete-membership',
   validation.deleteMembership,
   existance.checkMembershipExistanceOnly,
   controller.editMembership
);

export default router;

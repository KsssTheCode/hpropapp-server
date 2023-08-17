import express from 'express';
import * as controller from '../controllers/memberController.js';
import * as validation from '../middleware/validation/memberValidation.js';
import * as existance from '../middleware/existance/memberExistance.js';

const router = express.Router();

router.post(
   '/create-member',
   validation.createMemberValidation,
   existance.createMemberExistance,
   controller.createMember
);

router.get(
   '/get-all-members',
   validation.getAllMembersValdiation,
   controller.getAllMembers
);

router.get(
   '/get-selected-member',
   existance.checkMemberExistanceOnly,
   controller.getSelectedMember
);

router.get(
   '/get-members-data-in-filter-options',
   validation.getMembersInOptionsValidation,
   existance.getMembersInOptionsExistance,
   controller.getMembersDataInFilterOptions
);

router.post(
   '/edit-member',
   validation.editMemberValidation,
   existance.editMemberExistance,
   controller.editMember
);

router.post(
   '/delete-member',
   existance.checkMemberExistanceOnly,
   controller.editMember
);

// router.get(
//    '/auto-compeletion-with-name',
//    validation.autoCompeletionWithNameValidation,
//    controller.autoCompeletionWithName
// );
export default router;

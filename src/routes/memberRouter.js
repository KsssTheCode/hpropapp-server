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

router.get('/get-all-members', controller.getAllMembers);

router.get(
   '/get-selected-member',
   validation.checkMemberIdValidationOnly,
   existance.checkMemberExistanceOnly,
   controller.getSelectedMemberData
);

router.get(
   '/get-members-data-in-filter-options',
   validation.getMembersInFilterOptionsValidation,
   existance.getMembersInFilterOptionsExistance,
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
   validation.checkMemberIdValidationOnly,
   existance.checkMemberExistanceOnly,
   controller.editMember
);

// router.get(
//    '/auto-compeletion-with-name',
//    validation.autoCompeletionWithNameValidation,
//    controller.autoCompeletionWithName
// );
export default router;

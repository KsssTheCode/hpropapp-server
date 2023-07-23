import express from 'express';
import * as controller from '../controllers/memberController.js';
import * as validation from '../middleware/validation/memberValidation.js';
import * as existance from '../middleware/existance/memberExistance.js';
import { pageExistanceOnly } from '../middleware/existance/commonExistance.js';

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
   pageExistanceOnly,
   controller.getAllMembers
);

router.get(
   '/get-selected-member',
   existance.checkMemberExistanceOnly,
   controller.getSelectedMember
);

router.get(
   '/get-members-in-options',
   validation.getMembersInOptionsValidation,
   existance.getMembersInOptionsExistance,
   controller.getMembersInOptions
);

router.get(
   '/auto-compeletion-with-name',
   validation.autoCompeletionWithNameValidation,
   controller.autoCompeletionWithName
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

export default router;

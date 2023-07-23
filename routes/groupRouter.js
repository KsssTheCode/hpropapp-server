import express from 'express';
import * as controller from '../controllers/groupController.js';
import * as validation from '../middleware/validation/groupValidation.js';
import * as existance from '../middleware/existance/groupExistance.js';
import { pageExistanceOnly } from '../middleware/existance/commonExistance.js';

const router = express.Router();

router.post(
   '/create-group',
   validation.createGroupValidation,
   existance.createGroupExistance,
   controller.createGroup
);

router.get(
   '/get-group-change-history',
   existance.checkGroupExistanceOnly,
   controller.getGroupChangeHistory
);

router.get(
   '/get-all-groups',
   validation.getAllGroupsValidation,
   pageExistanceOnly,
   controller.getAllGroups
);

router.get(
   '/get-groups-in-options',
   validation.getGroupInOptionsValidation,
   pageExistanceOnly,
   controller.getGroupsInOptions
);

router.get(
   '/get-selected-group',
   existance.checkGroupExistanceOnly,
   controller.getSelectedGroup
);

router.post(
   '/edit-group',
   validation.editGroupValidation,
   existance.editGroupExistance,
   controller.editGroup
);

router.delete(
   '/delete-group',
   existance.checkGroupExistanceOnly,
   controller.deleteGroup
);

export default router;
